from fastapi.responses import JSONResponse, StreamingResponse, Response
from asgi_correlation_id import CorrelationIdMiddleware, correlation_id
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageDraw, ImageFont
from contextlib import asynccontextmanager
from imutils.video import VideoStream
from typing import Optional, Any
from datetime import datetime, timedelta
from ultralytics import YOLO
from config import settings
from minio import Minio
from io import BytesIO
from fastapi import (
    status as Status,
    FastAPI,
    Depends,
    Request,
)
from utils import (
    class_names,
    Label,
    JSONException,
    getRedisJson,
    setRedisJson,
)
import redis.asyncio as redis
import numpy as np
import threading
import tempfile
import asyncio
import uvicorn
import base64
import httpx
import time
import math
import json
import cv2
import io


async def run_tomorrow(task_fn, *args, **kwargs):
    now = datetime.now()
    tomorrow = (now + timedelta(days=1)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    delay = (tomorrow - now).total_seconds()

    print(f"Waiting {delay} seconds to run the task tomorrow...")
    await asyncio.sleep(delay)
    await task_fn(*args, **kwargs)


async def cleanRedis():
    try:
        await redis_client.flushdb()
        print("All keys have been deleted.")
    except Exception as e:
        print(f"Failed to clean Redis: {e}")
    finally:
        # Schedule next run regardless of success/failure
        asyncio.create_task(run_tomorrow(cleanRedis))


# lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("logs - background worker starting")
    asyncio.create_task(consumeIncomingRtspLive())
    asyncio.create_task(run_tomorrow(cleanRedis))
    yield  # keeps the app running
    print("logs - shutting down")


# server initial
minio_client = Minio(
    settings.minio_hostname,
    access_key="minioadmin",
    secret_key="minioadmin",
    secure=False,
)
redis_client = redis.from_url(url=settings.redis_url, decode_responses=True)
model = YOLO(settings.path_model)
image_type = "image/jpeg"
video_type = "video/mp4"
fourcc_format = "mp4v"
image_format = ".jpeg"
video_format = ".mp4"
default_fps = 30
app = FastAPI(lifespan=lifespan)

# middlewares
app.add_middleware(CorrelationIdMiddleware)  # add extra corrlation id for every request
app.add_middleware(CORSMiddleware, allow_origins="*")


# app
def isStreamAvailable(vs: VideoStream):
    if vs.read() is None:
        return False
    return True


def routeValidation(request: Request):
    try:
        user_header = request.headers.get("x-auth-user")
        if not user_header:
            raise Exception("Missing x-auth-user header")
        # Store it for use in endpoints/middleware
        request.state.current_user = json.loads(
            base64.b64decode(user_header).decode("utf-8")
        )
    except Exception as error:
        raise JSONException(
            statusCode=Status.HTTP_401_UNAUTHORIZED,
            message=str(error),
        )


def uploadFrameToMinio(bucket_name: str, object_name: str, data: Any):
    print(f"sending {object_name}")
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)
    minio_client.put_object(
        bucket_name, object_name, BytesIO(data), len(data), content_type=image_type
    )


def framesIntoRecordVideoUploadToMinio(
    bucket_name: str, folder_name: str, fps: int = default_fps
):
    output_name = f"{folder_name}/video{video_format}"
    try:
        frames = sorted(
            list(
                minio_client.list_objects(
                    bucket_name, prefix=f"{folder_name}/", recursive=True
                )
            ),
            key=lambda x: x.object_name,
        )
        if not frames:
            raise ValueError(
                f"No frames found in MinIO under the given folder {folder_name}"
            )

        # Read first frame to get size
        first_data = minio_client.get_object(bucket_name, frames[0].object_name).read()
        first_array = np.asarray(bytearray(first_data), dtype=np.uint8)
        first_frame = cv2.imdecode(first_array, cv2.IMREAD_COLOR)
        height, width, _ = first_frame.shape

        # Create temp file for video
        with tempfile.NamedTemporaryFile(suffix=video_format) as tmp:
            fourcc = cv2.VideoWriter.fourcc(*fourcc_format)
            out = cv2.VideoWriter(tmp.name, fourcc, fps, (width, height))

            for frame in frames:
                data = minio_client.get_object(bucket_name, frame.object_name).read()
                np_data = np.asarray(bytearray(data), dtype=np.uint8)
                frame = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
                if frame is not None:
                    out.write(frame)
            out.release()

            # Upload video from temp file
            tmp.seek(0)
            minio_client.fput_object(
                bucket_name=bucket_name,
                object_name=output_name,
                file_path=tmp.name,
                content_type=video_type,
            )
    except:
        raise GeneratorExit
    finally:
        print()


def resizeImage(frame, width: int = None, height: int = None):
    if frame is None:
        return None

    if width >= 1920 or height >= 1080:
        width = 1920
        height = 1080

    if width == None or height == None:
        return frame

    return cv2.resize(frame, (width, height))


def createTextImage(
    text,
    width=1920,
    height=1080,
    bg_color="black",
    text_color="white",
    font_path=None,
    font_size=250,
):
    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)
    if font_path:
        font = ImageFont.truetype(font_path, font_size)
    else:
        font = ImageFont.load_default()
    # centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    # draw text on image
    draw.text((x, y), text, font=font, fill=text_color)
    # save image to bytes buffer
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)  # rewind buffer to the beginning
    return buffer.getvalue()


def captureModelFrameTask(frame: Optional[np.ndarray] | Any | None):
    if frame is None:
        return False

    predictions = model.track(
        source=frame, conf=0.5, line_width=1, device=settings.device
    )

    if predictions[0] is None:
        return False

    thickness = 2
    # Process the predictions (e.g., draw bounding boxes)
    for prediction in predictions:
        boxes = prediction.boxes
        data_prediction = json.loads(prediction.tojson())
        idx: int = 0
        for box in boxes:
            # x1, y1, x2, y2 = box.xyxy[0]
            # bounding boxes
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

            # confidence
            confidence = math.ceil(box.conf[0] * 100) / 100

            # class name
            cls_idx = int(box.cls[0])

            # draw bounding box and get Label
            if type(class_names[0]) is Label:
                curr_class: str = class_names[cls_idx].name  # type: ignore
                color: tuple[int, int, int] = class_names[cls_idx].color  # type: ignore
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, thickness)
            else:
                curr_class: str = class_names[cls_idx]  # type: ignore
                color: tuple[int, int, int] = class_names[cls_idx].color
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, thickness)

            # Label
            # Label text with outline
            lbl = f"[{data_prediction[idx].get('track_id')}] {curr_class}: {confidence}"
            org = (x1, y1)
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.7
            text_thickness = 2
            line_type = cv2.LINE_AA
            outline_color = (255, 255, 255)  # Black (0, 0, 0); white (255, 255, 255)
            cv2.putText(
                frame,
                lbl,
                org,
                font,
                font_scale,
                outline_color,
                text_thickness - 1,
                line_type,
            )
            cv2.putText(
                frame, lbl, org, font, font_scale, color, text_thickness - 1, line_type
            )
            idx += 1

    # Convert the image into image_format
    _, encoded_image = cv2.imencode(image_format, frame)

    # return image
    return frame, encoded_image.tobytes(), predictions[0].tojson()


async def captureModelTask(vs: VideoStream):
    frame = vs.read()
    if frame is None:
        return None, None
    # captureModelFrameTask have to be non async
    return await asyncio.to_thread(captureModelFrameTask, frame)


async def captureFrameTask(vs: VideoStream):
    frame = vs.read()
    if frame is None:
        return None, None
    _, encoded_frame = cv2.imencode(image_format, frame)
    return frame, encoded_frame.tobytes()


async def captureTask(
    id: str, width: int | None, height: int | None, is_prediction_enabled: bool = False
):
    data = await getRedisJson(rd=redis_client, key=id)
    if data is None:
        yield (
            b"--frame\r\n"
            b"Content-Type: "
            + image_type.encode("utf-8")
            + b"\r\n\r\n"
            + createTextImage("your live session is invalid")
            + b"\r\n"
        )
        return
    try:
        rtsp_url = data["stream"]["url"]
        vs = VideoStream(src=rtsp_url).start()

        while data.get("expiryTimeInMinutes") is None or time.time() < int(
            data.get("expiryTimeInMinutes")
        ):
            # Run processing in parallel
            data = await getRedisJson(rd=redis_client, key=id)
            if data is None:
                break

            if is_prediction_enabled:
                frame, encoded_frame, prediction = await captureModelTask(vs)
            else:
                frame, encoded_frame = await captureFrameTask(vs)

            if frame is None or encoded_frame is None:
                break

            yield (
                b"--frame\r\n"
                b"Content-Type: "
                + image_type.encode("utf-8")
                + b"\r\n\r\n"
                + encoded_frame
                + b"\r\n"
            )

        if int(time.time()) > int(data.get("expiryTimeInMinutes", 0)):
            yield (
                b"--frame\r\n"
                b"Content-Type: "
                + image_type.encode("utf-8")
                + b"\r\n\r\n"
                + createTextImage(
                    "your live session has reached time limit. Reload to extend the limit"
                )
                + b"\r\n"
            )
    except Exception as e:
        raise GeneratorExit
    finally:
        if vs is not None:
            vs.stop()
        print(f"capture live with {id} stopped")


@app.get("/live/{liveId}")
async def liveStream(
    request: Request,
    liveId: str,
    width: int = None,
    height: int = None,
    prediction: bool = False,
):
    liveData = await getRedisJson(rd=redis_client, key=liveId)
    if liveData is not None and liveData.get("expiryTimeInMinutes") is None:
        liveData["expiryTimeInMinutes"] = int(time.time()) + 1 * 60
        await setRedisJson(rd=redis_client, key=liveId, value=liveData)
    return StreamingResponse(
        captureTask(
            id=liveId, is_prediction_enabled=prediction, width=width, height=height
        ),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@app.get("/live/{liveId}/extend-more-minutes")
async def liveStream(request: Request, liveId: str):
    try:
        if redis_client.exists(liveId) == False:
            raise Exception(f"your live with id {liveId} does not exist")

        liveData = await getRedisJson(rd=redis_client, key=liveId)
        liveData["expiryTimeInMinutes"] = (
            # int(liveData.get("expiryTimeInMinutes")) + 1 * 60
            int(time.time())
            + 1 * 60
        )
        await setRedisJson(rd=redis_client, key=liveId, value=liveData)
        return JSONResponse(
            content={
                "message": "live time extended susccessfully",
                "success": True,
            }
        )
    except Exception as e:
        raise JSONException(
            statusCode=Status.HTTP_404_NOT_FOUND,
            message=str(e),
        )


async def recordLiveStream(id: str):
    data = await getRedisJson(rd=redis_client, key=id)
    if data is None:
        return
    user_data = base64.b64encode(json.dumps(data["user"]).encode("utf-8")).decode(
        "utf-8"
    )
    rtsp_url = data["stream"]["url"]
    expiry_ts = data["report"]["expiryTimeInMinutes"]
    vs = VideoStream(src=rtsp_url).start()
    start_time = time.time()
    try:
        frame_count = 0
        while expiry_ts is None or time.time() < int(expiry_ts):
            # Run processing in parallel
            data = await getRedisJson(rd=redis_client, key=id)
            if data is None:
                break

            # predic
            frame, prediction_frame, prediction = await captureModelTask(vs)

            # store frames
            object_name = f"{data["report"]["id"]}/{frame_count}{image_format}"
            print(f"send {object_name}")
            await asyncio.to_thread(
                uploadFrameToMinio, settings.minio_bucket, object_name, prediction_frame
            )
            frame_count += 1
            # todo: store items
            async with httpx.AsyncClient() as client:
                await client.patch(
                    f"{settings.general_service_url}/report/items",
                    json={
                        "reportId": data["report"]["id"],
                        "items": [{"data": prediction}],
                    },
                    headers={
                        "x-from-internal": "true",  # headers must be strings
                        "x-auth-user": user_data,
                    },
                )
            await asyncio.sleep(1 / default_fps)  # ~30 FPS, sent 1 frame every 33ms
        # todo: make the video
        duration = time.time() - start_time
        actual_fps = frame_count / duration if duration > 0 else 1
        await asyncio.to_thread(
            framesIntoRecordVideoUploadToMinio,
            settings.minio_bucket,
            f"{data["report"]["id"]}",
            actual_fps,
        )
        # todo: update report data
        async with httpx.AsyncClient() as client:
            await client.patch(
                f"{settings.general_service_url}/report",
                json={
                    "id": data["report"]["id"],
                    "recordUrl": f"{data["report"]["id"]}/video{video_format}",
                    "thumbnailUrl": f"{data["report"]["id"]}/0{image_format}",
                },
                headers={
                    "x-from-internal": "true",  # headers must be strings
                    "x-auth-user": user_data,
                },
            )
        # todo: add success notification
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{settings.general_service_url}/user/notification",
                json={
                    "entityId": data["report"]["id"],
                    "entityName": "Report",
                    "title": f"Recording is finished",
                    "caption": data["report"]["title"] or None,
                    "description": f"You can see it now!",
                },
                headers={
                    "x-from-internal": "true",  # headers must be strings
                    "x-auth-user": user_data,
                },
            )
    except Exception as e:
        # handle error logs for user
        print(f"Recording error: {e}")
        # todo: add falsy notification
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{settings.general_service_url}/user/notification",
                json={
                    "entityId": data["report"]["id"],
                    "entityName": "Report",
                    "title": f"Recording is failed",
                    "caption": data["report"]["title"] or None,
                    "description": f"Something is wrong with the streaming",
                },
                headers={
                    "x-from-internal": "true",  # headers must be strings
                    "x-auth-user": user_data,
                },
            )
    finally:
        if vs is not None:
            vs.stop()
        print(f"record capture with {id} stopped")
        raise GeneratorExit


async def consumeIncomingRtspLive():
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(settings.redis_channel)
    # track tasks
    running = set()
    async for message in pubsub.listen():
        if message["type"] != "message":
            continue
        data = message["data"]
        if isinstance(data, bytes):
            liveId = data.decode("utf-8")
        else:
            liveId = data
        # spawn a new task for each message immediately
        task = asyncio.create_task(recordLiveStream(liveId))
        running.add(task)
        task.add_done_callback(lambda t: running.discard(t))
    # if pubsub ever ends, wait for all
    if running:
        await asyncio.wait(running)


@app.get("/ping")
async def ping(request: Request):
    try:
        return JSONResponse(status_code=200, content={"message": "pong"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# if __name__ == "__main__":
#     print("logs - api starting")
# Run the FastAPI server in the main thread
# uvicorn.run(app, host=settings.host, port=settings.port, lifespan="on")
# print("logs - worker starting")
# # Start the async worker in a separate thread
# threading.Thread(target=run_background_worker, daemon=True).start()

# def run_background_worker():
#     """worker is running on separate thread"""
#     loop = asyncio.new_event_loop()
#     asyncio.set_event_loop(loop)
#     loop.run_until_complete(consumeIncomingRtspLive())
