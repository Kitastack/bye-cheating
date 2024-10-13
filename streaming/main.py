import sys

sys.path.append("./protoc")

from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse, Response
from asgi_correlation_id import CorrelationIdMiddleware, correlation_id
from protoc.authentication_pb2_grpc import AuthenticationServiceStub
from concurrent.futures import ThreadPoolExecutor, as_completed
from protoc.report_pb2_grpc import ReportServiceStub
from protoc.stream_pb2_grpc import StreamServiceStub
from imutils.video import VideoStream
from protoc import authentication_pb2
from protoc import stream_pb2
from protoc import report_pb2
from ultralytics import YOLO
from typing import Optional
from config import settings
from PIL import Image

from utils import (
    JSONException,
    Label,
    imageToBase64,
    setRedis,
    setRedisJson,
    getRedisJson,
    delRedis,
    setRedisListGroup,
    getLastElRedisListGroup,
    getElByKeyRedisListGroup,
    getRedis,
)
from fastapi import (
    FastAPI,
    Depends,
    Request,
    status as Status,
)

import asyncio
import numpy as np
import uvicorn
import base64
import redis
import time
import math
import json
import grpc
import cv2
import io

# "rtsp://rtspstream:07451b4ef79b34a8473a745fd99a50e0@zephyr.rtsp.stream/movie
# grpc server
generalServerChannel = grpc.insecure_channel(settings.grpc_url)
authenticationStub = AuthenticationServiceStub(generalServerChannel)
reportStub = ReportServiceStub(generalServerChannel)
streamStub = StreamServiceStub(generalServerChannel)

# http server
image_format = ".jpeg"
app = FastAPI()
model = YOLO(settings.path_model)
rd = redis.from_url(url=settings.redis_url, decode_responses=True)
classNames = [
    Label("Cheat Sheet", (47, 52, 212)),
    Label("Exchange Paper", (47, 135, 212)),
    Label("Giving Code", (82, 205, 209)),
    Label("Looking Friend", (69, 168, 147)),
    Label("Normal", (69, 168, 71)),
]

# middleware
app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(CORSMiddleware, allow_origins="*")


@app.exception_handler(JSONException)
async def json_exception_handler(_: Request, exc: JSONException):
    return JSONResponse(
        status_code=exc.statusCode,
        content={"status": False, "message": exc.message},
    )


def route_validation(request: Request, token: Optional[str] = None):
    try:

        request.state.token = (
            lambda header_auth: (
                base64.b64decode(token).decode("utf-8")
                if header_auth == None
                else (
                    lambda header_token: (
                        header_auth.split(" ")[1] if header_token != None else None
                    )
                )(header_auth)
            )
        )(request.headers.get("Authorization"))

        if request.state.token == None:
            raise Exception("Please sign in first")

        if request.state.token == None:
            raise Exception("Could not validate session")

        payload = authenticationStub.validateToken(
            authentication_pb2.AuthenticationRequest(token=request.state.token)
        )

        if payload.success != True:
            raise Exception(payload.message)

        if payload.result.id == None:
            raise Exception("Please sign in again")

        request.state.current_user = payload.result
    except Exception as error:
        raise JSONException(
            statusCode=Status.HTTP_401_UNAUTHORIZED,
            message=str(error),
        )


def save_task(report_data: dict):
    try:
        store_response = reportStub.saveReport(
            report_pb2.ReportStoreRequest(
                report_id=report_data.get("id"),
            ),
            metadata=[("token", report_data.get("token"))],
        )
        print(f"save response {store_response.success}")
    except Exception as e:
        print(str(e))


def is_stream_available(vs: VideoStream):
    if vs.read() is None:
        return False
    return True


def update_model_status(report_data: dict):
    if report_data is None or "id" not in report_data:
        return

    report_data["is_frame_live"] = False
    setRedisJson(
        rd=rd,
        key=report_data.get("id"),
        value=report_data,
    )


def update_raw_status(report_data: dict):
    if report_data is None or "id" not in report_data:
        return

    report_data["is_rawframe_live"] = False
    setRedisJson(
        rd=rd,
        key=report_data.get("id"),
        value=report_data,
    )


def resize_image(frame_buffer, width: int = None, height: int = None):
    if frame_buffer is None:
        return None

    if width >= 1920 or height >= 1080:
        width = 1920
        height = 1080

    if width == None or height == None:
        return frame_buffer

    return cv2.resize(frame_buffer, (width, height))
    # return resize(frame_buffer, width=width, height=height)


def capture_frame_task(vs: VideoStream, report_data: dict):
    frame = vs.read()
    report_data = getRedisJson(rd=rd, key=report_data.get("id"))

    if (
        frame is None
        or report_data is None
        or report_data.get("is_rawframe_live") == False
    ):
        return False

    _, encoded_frame = cv2.imencode(image_format, frame)
    # return frame, encoded_frame.tobytes()
    setRedisJson(
        rd=rd,
        key=report_data.get("id"),
        value=report_data,
    )
    setRedisListGroup(
        rd=rd,
        key="rawframe",
        group=report_data.get("id"),
        value=imageToBase64(encoded_frame),
    )
    return True


async def capture_task(
    report_data: dict,
):
    try:
        vs = VideoStream(src=report_data.get("url")).start()
        start_time = time.time()
        while (time.time() - start_time) < report_data.get("live_time"):
            with ThreadPoolExecutor(max_workers=2) as executor:
                report_data = getRedisJson(rd=rd, key=report_data.get("id"))

                if report_data is None:
                    break

                report_data["runtime"] = time.time() - start_time
                setRedisJson(
                    rd=rd,
                    key=report_data.get("id"),
                    value=report_data,
                )

                future = executor.submit(capture_frame_task, vs, report_data)
                result = await asyncio.to_thread(future.result)

                if result != True:
                    break
    except Exception as e:
        raise GeneratorExit
    finally:
        vs.stop()
        update_raw_status(report_data)
        print(f"capture task stopped")


def capture_model_frame(frame: str, report_data: dict):
    # time.sleep(1)
    string_frame = base64.b64decode(frame)
    report_data = getRedisJson(rd=rd, key=report_data.get("id"))

    if (
        string_frame is None
        or report_data is None
        or report_data.get("is_frame_live") == False
    ):
        return False

    image = Image.open(io.BytesIO(string_frame))
    decode_image = cv2.imdecode(np.frombuffer(string_frame, np.uint8), cv2.IMREAD_COLOR)

    predictions = model.track(source=image, conf=0.5, line_width=1, device="cpu")

    if predictions[0] is None:
        return False

    # Process the predictions (e.g., draw bounding boxes)
    for prediction in predictions:
        boxes = prediction.boxes
        data_prediction = json.loads(prediction.tojson())

        idx: int = 0
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            # bounding boxes
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

            # confidence
            confidence = math.ceil(box.conf[0] * 100) / 100

            # class name
            cls_idx = int(box.cls[0])

            # draw bounding box and get Label
            if type(classNames[0]) is Label:
                curr_class: str = classNames[cls_idx].name  # type: ignore
                color: tuple[int, int, int] = classNames[cls_idx].color  # type: ignore
                cv2.rectangle(decode_image, (x1, y1), (x2, y2), color, 4)
            else:
                curr_class: str = classNames[cls_idx]  # type: ignore
                color: tuple[int, int, int] = classNames[cls_idx].color
                cv2.rectangle(decode_image, (x1, y1), (x2, y2), color, 4)

            # Label
            lbl = f"(id_{data_prediction[idx].get('track_id')}) {curr_class}: {confidence}"

            # object details
            org = [x1, y1]
            font = cv2.FONT_HERSHEY_SIMPLEX
            fontScale = 1
            thickness = 2
            lineType = cv2.LINE_AA

            cv2.putText(
                decode_image, lbl, org, font, fontScale, color, thickness, lineType
            )

            idx += 1

    # Convert the image to a base64 string
    _, encoded_image = cv2.imencode(image_format, decode_image)

    setRedisListGroup(
        rd=rd,
        key="frame",
        group=report_data.get("id"),
        value=imageToBase64(encoded_image),
    )

    setRedisListGroup(
        rd=rd,
        key="prediction",
        group=report_data.get("id"),
        value=predictions[0].tojson(),
    )

    # return image
    return True


async def capture_model_task(
    report_data: dict,
):
    try:
        last_index = -1
        # skip_time = time.time() + 1
        while True:
            with ThreadPoolExecutor(max_workers=4) as executor:
                report_data = getRedisJson(rd=rd, key=report_data.get("id"))

                if report_data is None:
                    break

                frame_data = getElByKeyRedisListGroup(
                    rd=rd, key="rawframe", group=report_data.get("id"), index=last_index
                )

                if frame_data is None and report_data.get("live_time") > (
                    lambda runtime: 0 if runtime is None else round(runtime)
                )(report_data.get("runtime")):
                    continue
                elif frame_data is None:
                    break
                else:
                    last_index -= 1

                # if time.time() >= skip_time:
                #     skip_time += 1
                #     continue

                future = executor.submit(capture_model_frame, frame_data, report_data)
                result = await asyncio.to_thread(future.result)

                if result != True:
                    break
    except Exception as e:
        raise GeneratorExit
    finally:
        print(f"{report_data.get('id')} capture task stopped")
        update_model_status(report_data)
        save_task(report_data)


@app.post("/report/start", dependencies=[Depends(route_validation)])
async def startReportStream(
    request: Request,
):
    try:
        body = await request.json()
        if "streamId" not in body and "url" not in body:
            raise Exception("None of streamId or url provided")

        if "streamId" not in body and "url" in body:
            stream_data = streamStub.createStream(
                stream_pb2.StreamCreateRequest(url=body.get("url")),
                metadata=[("token", request.state.token)],
            )
        else:
            stream_data = streamStub.getStream(
                stream_pb2.StreamRequest(streamId=body.get("streamId")),
                metadata=[("token", request.state.token)],
            )

        if (
            stream_data.result == "null"
            or stream_data.result is None
            or stream_data.success != True
        ):
            raise Exception(
                "failed to create due to non existing stream otherwise new url was not provided"
            )

        stream_data = json.loads(stream_data.result)
        if (
            is_stream_available(VideoStream(src=f"{stream_data.get('url')}").start())
            == False
        ):
            raise Exception("stream from the url is not available")

        report_data = reportStub.createReport(
            report_pb2.ReportRequest(
                streamId=stream_data.get("id"),
                userId=request.state.current_user.id,
                title=body.get("title"),
                description=body.get("description"),
                isFrameStored=body.get("isFrameStored"),
            ),
            metadata=[("token", request.state.token)],
        )

        if (
            report_data.result == "null"
            or report_data.result is None
            or report_data.success != True
        ):
            raise Exception("failed to create report stream")

        base_time = 15 * 60  # max 15 minutes
        if "time" not in body or body.get("time") >= base_time:
            body["time"] = base_time

        report_data: dict = json.loads(report_data.result)
        report_data["token"] = request.state.token
        report_data["time"] = body.get("time")
        report_data["live_time"] = body.get("time")
        report_data["stream"] = stream_data
        report_data["url"] = stream_data.get("url")
        report_data["is_rawframe_live"] = True
        report_data["is_frame_live"] = True

        setRedisJson(rd=rd, key=report_data.get("id"), value=report_data)

        asyncio.create_task(capture_task(report_data=report_data))
        asyncio.create_task(capture_model_task(report_data=report_data))

        return JSONResponse(
            content={
                "message": "recording started",
                "success": True,
                "result": report_data,
            }
        )
    except Exception as e:
        raise JSONException(
            statusCode=Status.HTTP_400_BAD_REQUEST,
            message=str(e),
        )


@app.post("/report/end", dependencies=[Depends(route_validation)])
async def endReportStream(
    request: Request,
):
    try:
        body: dict = await request.json()
        if body is None or "id" not in body:
            raise Exception("None of reportId is provided")

        last_report_data: dict = getRedisJson(rd=rd, key=body.get("id"))
        if last_report_data is None or "id" not in last_report_data:
            raise Exception(f"None of report has id of {body.get('id')}")

        last_report_data["live_time"] = 0
        setRedisJson(rd=rd, key=last_report_data.get("id"), value=last_report_data)
        update_raw_status(last_report_data)
        update_model_status(last_report_data)

        return JSONResponse(
            content={
                "message": "recording stopped",
                "success": True,
                "result": last_report_data,
            }
        )
    except Exception as e:
        raise JSONException(
            statusCode=Status.HTTP_400_BAD_REQUEST,
            message=str(e),
        )


def capture_live_report_frame(
    report_data: dict, is_raw: bool, width: int = None, height: int = None
):
    try:
        report_id: str = report_data.get("id")

        if report_data is None:
            raise Exception()

        if report_data.get("runtime") is None or (
            round(report_data.get("runtime")) >= report_data.get("live_time")
            and is_raw == True
        ):
            return None

        if is_raw == True:
            key_pair = "rawframe"
        else:
            key_pair = "frame"

        buffer_frame = getLastElRedisListGroup(rd=rd, key=key_pair, group=report_id)

        if buffer_frame is None:
            return None

        buffer_frame = base64.b64decode(buffer_frame)

        if width != None and height != None:
            _, image = cv2.imencode(
                image_format,
                resize_image(
                    cv2.imdecode(
                        np.frombuffer(buffer_frame, np.uint8), cv2.IMREAD_COLOR
                    ),
                    width,
                    height,
                ),
            )
            buffer_frame = image.tobytes()

        return buffer_frame
    except Exception as e:
        raise e


async def capture_live_report(
    request: Request,
    report_data: dict,
    is_raw: bool = True,
    width: int = None,
    height: int = None,
):
    try:
        while not await request.is_disconnected():
            report_data = getRedisJson(rd, report_data.get("id"))

            if (is_raw == True and report_data.get("is_rawframe_live") == False) or (
                is_raw == False and report_data.get("is_frame_live") == False
            ):
                raise Exception()

            with ThreadPoolExecutor(max_workers=2) as executor:
                if report_data is None or "id" not in report_data:
                    raise Exception()

                future = executor.submit(
                    capture_live_report_frame, report_data, is_raw, width, height
                )
                decoded_frame: bytes | None = await asyncio.to_thread(future.result)

                if decoded_frame is None:
                    break

                yield (
                    b"--frame\r\n"
                    b"Connection: Keep-Alive\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" + decoded_frame + b"\r\n"
                )
    except Exception as e:
        raise GeneratorExit
    finally:
        print("live capture stopped")


@app.get("/report/{report_id}/watch", dependencies=[Depends(route_validation)])
async def liveReportStream(
    request: Request,
    report_id: str,
    width: int = None,
    height: int = None,
    raw: bool = True,
):
    try:
        report_data = getRedisJson(rd, report_id)

        if report_data is None or "id" not in report_data:
            raise Exception(f"None of live report with id {report_id}")

        if raw == True and report_data.get("is_rawframe_live") == False:
            raise Exception(f"Live report with id {report_id} has been closed")

        if raw == False and report_data.get("is_frame_live") == False:
            raise Exception(f"Live model report with id {report_id} has been closed")

        return StreamingResponse(
            capture_live_report(
                request=request,
                report_data=report_data,
                is_raw=raw,
                width=width,
                height=height,
            ),
            media_type="multipart/x-mixed-replace;boundary=frame",
        )
    except Exception as e:
        raise JSONException(
            statusCode=Status.HTTP_404_NOT_FOUND,
            message=str(e),
        )


def capture_live_prediction_report_frame(report_data: dict):
    try:
        report_id: str = report_data.get("id")

        if report_data is None:
            return None

        selected_json = getLastElRedisListGroup(
            rd=rd, key="prediction", group=report_id
        )

        return selected_json
    except Exception as e:
        raise e


async def capture_live_prediction_report(request: Request, report_data: dict):
    try:
        while not await request.is_disconnected():

            report_data = getRedisJson(rd, report_data.get("id"))

            if report_data.get("is_frame_live") == False:
                break

            with ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(
                    capture_live_prediction_report_frame, report_data
                )
                decoded_json: str | None = await asyncio.to_thread(future.result)

                # print(f"hasil, {decoded_json}")
                if decoded_json is None:
                    break

                yield f"data: {json.dumps(decoded_json)}\n\n"
    except Exception as e:
        raise GeneratorExit
    finally:
        print(f"live prediction stopped")


@app.get("/report/{report_id}/prediction", dependencies=[Depends(route_validation)])
async def liveReportPredictionStream(request: Request, report_id: str):
    try:
        report_data = getRedisJson(rd, report_id)

        if rd.exists(f"{report_id}") == False:
            raise Exception(f"None of prediction report with id {report_id}")

        if report_data.get("is_frame_live") == False:
            raise Exception(
                f"Live report prediction with id {report_id} has been closed"
            )

        return StreamingResponse(
            capture_live_prediction_report(request=request, report_data=report_data),
            media_type="text/event-stream",
        )
    except Exception as e:
        raise JSONException(
            statusCode=Status.HTTP_404_NOT_FOUND,
            message=str(e),
        )


def capture_live_stream_frame(
    vs: VideoStream, stream_data: dict, width: int = None, height: int = None
):
    frame_buffer = vs.read()
    if frame_buffer is None or stream_data is None:
        return None

    if width != None and height != None:
        frame_buffer = resize_image(frame_buffer, width=width, height=height)

    _, encoded_frame = cv2.imencode(image_format, frame_buffer)
    return encoded_frame.tobytes()


async def capture_live_stream(
    request: Request, stream_data: dict, width: int = None, height: int = None
):
    try:
        id = f"{request.state.current_user.id}#{stream_data.get('id')}"
        # id = f"#{stream_data.get("id")}"
        vs = VideoStream(src=f"{stream_data.get('url')}").start()

        if rd.exists(id) == True:
            start_time = float(getRedis(rd, id))
        else:
            start_time = float(setRedis(rd, id, time.time()))

        while not await request.is_disconnected():
            if (time.time() - start_time) > int(5 * 60):
                print(f"delete {id}")
                raise Exception()

            with ThreadPoolExecutor(max_workers=2) as executor:
                future = executor.submit(
                    capture_live_stream_frame, vs, stream_data, width, height
                )
                encoded_frame = await asyncio.to_thread(future.result)

                if encoded_frame is None:
                    break

                yield (
                    b"--frame\r\n"
                    b"Connection: Keep-Alive\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" + encoded_frame + b"\r\n"
                )

            check_if_exist = getRedis(rd, id)
            if check_if_exist is not None:
                start_time = float(check_if_exist)
    except Exception as e:
        raise GeneratorExit
    finally:
        delRedis(rd, id)
        vs.stop()
        print("live stream stopped")


@app.get("/stream/{stream_id}/extend", dependencies=[Depends(route_validation)])
async def extendLiveStream(request: Request, stream_id: str):
    try:
        id = f"{request.state.current_user.id}#{stream_id}"

        if rd.exists(id) == False:
            raise Exception(f"your stream with id {stream_id} does not exist")

        setRedis(rd, id, time.time())

        return JSONResponse(
            content={
                "message": "stream time extended susccessfully",
                "success": True,
            }
        )
    except Exception as e:
        raise JSONException(
            statusCode=Status.HTTP_404_NOT_FOUND,
            message=str(e),
        )


@app.get("/stream/{stream_id}/watch", dependencies=[Depends(route_validation)])
# @app.get("/stream/{stream_id}/watch")
async def liveStream(
    request: Request, stream_id: str, width: int = None, height: int = None
):
    try:
        stream_data = streamStub.getStream(
            stream_pb2.StreamRequest(streamId=stream_id),
            metadata=[("token", request.state.token)],
        )

        if (
            stream_data.result == "null"
            or stream_data.result is None
            or stream_data.success != True
        ):
            raise Exception("failed to load stream")

        stream_data = json.loads(stream_data.result)

        if stream_data.get("url") is None:
            raise Exception("cannot load stream url")

        if (
            is_stream_available(VideoStream(src=f"{stream_data.get('url')}").start())
            == False
        ):
            raise Exception("stream from the url is not available")

        # correlation_id.get()
        return StreamingResponse(
            capture_live_stream(
                request=request, stream_data=stream_data, width=width, height=height
            ),
            media_type="multipart/x-mixed-replace;boundary=frame",
        )
    except Exception as e:
        raise JSONException(
            statusCode=Status.HTTP_404_NOT_FOUND,
            message=str(e),
        )


if __name__ == "__main__":
    uvicorn.run(app, host=settings.host, port=settings.port)
