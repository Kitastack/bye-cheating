from starlette.middleware.authentication import AuthenticationMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from authentication_pb2_grpc import AuthenticationServiceStub
from concurrent.futures import ThreadPoolExecutor
from report_pb2_grpc import ReportServiceStub
from stream_pb2_grpc import StreamServiceStub
from imutils.video import VideoStream
from fastapi import BackgroundTasks, Response
from ultralytics import YOLO
from config import settings
from imutils import resize
from io import BytesIO
from utils import (
    JSONException,
    cancel_on_disconnect,
    setRedisJson,
    getRedisJson,
    setRedisGroup,
    delRedisGroup,
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

import threading
import asyncio
import authentication_pb2
import numpy as np
import stream_pb2
import report_pb2
import logging
import uvicorn
import base64
import redis
import uuid
import time
import json
import grpc
import cv2

# "rtsp://rtspstream:07451b4ef79b34a8473a745fd99a50e0@zephyr.rtsp.stream/movie
# rtsp://localhost:8554/mystream
# "rtsp://admin:@psti2012@192.168.145.2/Streaming/Channels/1"
generalServerChannel = grpc.insecure_channel(f"{settings.grpc_host}:{str(settings.grpc_port)}")
authenticationStub = AuthenticationServiceStub(generalServerChannel)
reportStub = ReportServiceStub(generalServerChannel)
streamStub = StreamServiceStub(generalServerChannel)


app = FastAPI()
model = YOLO(settings.path_model)
rd = redis.Redis(
    host=settings.redis_host, port=settings.redis_port, decode_responses=True
)


@app.exception_handler(JSONException)
async def json_exception_handler(_: Request, exc: JSONException):
    return JSONResponse(
        status_code=Status.HTTP_404_NOT_FOUND,
        content={"status": False, "message": exc.message},
    )

def route_validation(request: Request):
    try:
        request.state.token = request.headers.get("Authorization")
        request.state.token = request.state.token.split(" ")[1]

        if request.state.token == None:
            raise Exception("Could not validate token")

        payload = authenticationStub.validateToken(
            authentication_pb2.AuthenticationRequest(token=request.state.token)
        )

        if payload.success != True:
            raise Exception(payload.message)

        if payload.result.id == None:
            raise Exception("Please login again")
        
        request.state.current_user = payload.result
    except Exception as error:
        print(str(error))
        raise JSONException(
            statusCode=Status.HTTP_401_UNAUTHORIZED,
            message=str(error),
        )

def save_task(report_data: dict):
    # delRedisGroup(rd=rd, key=report_data.get("id"))
    """do some logic to store the data into cloud storage and database"""

def capture_frame(vs: VideoStream, report_data: dict):
    frame = vs.read()
    if frame is None or report_data is None:
        False

    _, encoded_frame = cv2.imencode(".jpeg", frame)
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
        value=base64.b64encode(encoded_frame.tobytes()).decode("utf-8"),
    )

    return True

async def capture_task(
    report_data: dict,
):
    vs = VideoStream(src=report_data.get("url")).start()
    try:
        start_time = time.time()
        while (time.time() - start_time) < report_data.get("time"):
            with ThreadPoolExecutor(max_workers=2) as executor:
                report_data = getRedisJson(rd=rd, key=report_data.get("id"))

                if report_data is None:
                    break

                report_data["runtime"]= time.time() - start_time

                future = executor.submit(capture_frame, vs, report_data)
                result = await asyncio.to_thread(future.result) 

                if result != True:
                    break
    except Exception as e:
        raise GeneratorExit
    finally:
        vs.stop()
        logging.info(f"capture task stopped")

async def capture_model_task(
    report_data: dict,
):
    try:
        # start from head
        last_index = -1
        while True:
            with ThreadPoolExecutor(max_workers=4) as executor:
                future = executor.submit(getElByKeyRedisListGroup, rd=rd,key="rawframe", group=report_data.get("id"), index=last_index)
                frame = await asyncio.to_thread(future.result) 
                report_data = getRedisJson(rd=rd, key=report_data.get("id"))

                try:
                    if frame is None and report_data.get("time") > (lambda runtime: 0 if runtime is None else round(runtime))(report_data.get("runtime")):
                        continue
                    elif frame is None:
                        break
                    else:
                        last_index -= 1

                    setRedisListGroup(
                        rd=rd,
                        key="frame",
                        group=report_data.get("id"),
                        value=frame,
                    )

                    prediction = model.track(source=frame, conf=0.35, line_width=1)

                    if prediction[0] is None:
                        continue
            
                    setRedisListGroup(
                        rd=rd,
                        key="frame",
                        group=report_data.get("id"),
                        value=base64.b64encode(cv2.imencode(".jpeg", prediction[0].plot())[1].tobytes()).decode("utf-8")
                    )

                    setRedisListGroup(
                        rd=rd,
                        key="prediction",
                        group=report_data.get("id"),
                        value=prediction[0].tojson(),
                    )
                except Exception as e:
                    raise e
    except Exception as e:
        raise GeneratorExit
    finally:
        logging.info(f"{report_data.get("id")} capture task stopped")
        delRedisGroup(rd=rd, key=report_data.get("id"))

@app.post("/stream/report/end", dependencies=[Depends(route_validation)])
async def endReportStream(
    request: Request,
):
    try:
        body: dict = await request.json()
        if "id" not in body:
            raise Exception("None of reportId is provided")

        last_report_data: dict = getRedisJson(rd=rd, key=body.get("id"))
        if "id" not in last_report_data:
            raise Exception(f"None of report has id of {body.get("id")}")

        last_report_data["time"] = 0
        setRedisJson(rd=rd, key=last_report_data.get("id"), value=last_report_data)

        return JSONResponse(
            content={
                "message": "recording stopped",
                "success": True,
                "result": last_report_data,
            }
        )
    except Exception as e:
        logging.error(f"error found at /stream/report/end: {e}")
        raise JSONException(
            statusCode=Status.HTTP_401_UNAUTHORIZED,
            message=str(e),
        )

@app.post("/stream/report/start", dependencies=[Depends(route_validation)])
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

        if stream_data.result == "null" or stream_data.result is None or stream_data.success != True:
            raise Exception("failed to create stream")

        stream_data = json.loads(stream_data.result)
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

        if report_data.result == "null" or report_data.result is None or report_data.success != True:
            raise Exception("failed to create report stream")

        if "time" not in body:
            body["time"] = 60

        report_data = json.loads(report_data.result)
        report_data["time"] = body.get("time")
        report_data["stream"] = stream_data
        report_data["url"] = stream_data.get("url")

        setRedisJson(rd=rd, key=report_data.get("id"), value=report_data)

        asyncio.create_task(capture_task(report_data=report_data))
        # asyncio.create_task(capture_model_task(report_data=report_data))

        return JSONResponse(
            content={
                "message": "recording started",
                "success": True,
                "result": report_data,
            }
        )
    except Exception as e:
        logging.error(f"error found at /stream/report/start: {e}")
        raise JSONException(
            statusCode=Status.HTTP_401_UNAUTHORIZED,
            message=str(e),
        )

async def capture_live_report(request: Request, report_data: dict, isRaw: bool = True, width: int = None, height: int = None):
    try:
        while not await request.is_disconnected():
            with ThreadPoolExecutor(max_workers=2) as executor:
                current_report_data: dict = executor.submit(getRedisJson, rd, report_data.get("id")).result()
                try:
                    if current_report_data is None:
                        break

                    if round(current_report_data.get('runtime')) >= current_report_data.get('time') and isRaw == True:
                        break

                    if isRaw == True:
                        key_pair = "rawframe"
                    else:
                        key_pair = "frame"

                    current_frame = getLastElRedisListGroup(rd=rd, key=key_pair, group=report_data.get("id"))
                    
                    if current_frame is None:
                        break

                    decoded_frame = base64.b64decode(current_frame)

                    # if width != None and height != None:
                    #     buffer_frame = resize(buffer_frame, width=width, height=height)
                    # _, encoded_frame = cv2.imencode(".jpeg", buffer_frame)

                    yield (
                        b"--frame\r\n"
                        b"Connection: Keep-Alive\r\n"
                        b"Content-Type: image/jpeg\r\n\r\n" + decoded_frame + b"\r\n"
                    )
                except Exception as e:
                    raise e
    except Exception as e:
        raise GeneratorExit
    finally:
        logging.info("live capture stopped")
        logging.info(f"{report_data.get("id")} live watching stopped")

@app.get("/stream/report/{report_id}/live") 
async def liveReportStream(request: Request, report_id: str, width: int = None, height: int = None, raw: bool = True):
    try:
        if rd.exists(f"{report_id}") == False:
            raise Exception(f"None of live report with id {report_id}")

        report_data = getRedisJson(rd, report_id)
        return StreamingResponse(
            capture_live_report(request=request, report_data=report_data, isRaw=raw, width=width, height=height),
            media_type="multipart/x-mixed-replace;boundary=frame",
        )
    except Exception as e:
        logging.error(f"error found at /stream/report/{report_id}/live: {e}")
        raise JSONException(
            statusCode=Status.HTTP_401_UNAUTHORIZED,
            message=str(e),
        )

async def capture_prediction_report(request: Request, report_data: dict):
    try:
        while not await request.is_disconnected():
            with ThreadPoolExecutor(max_workers=1) as executor:
                current_report_data: dict = executor.submit(getRedisJson, rd, report_data.get("id")).result()
                try:
                    if current_report_data is None:
                        break

                    current_prediction = getLastElRedisListGroup(rd=rd, key="prediction", group=report_data.get("id"))
                    
                    if current_prediction is None:
                        break

                    yield f"{json.loads(current_prediction)}\n"

                    yield (
                        b"--frame\r\n"
                        b"Connection: Keep-Alive\r\n"
                        b"Content-Type: application/json\r\n\r\n" + json.dumps(json.loads(current_prediction)).encode("utf-8") + b"\r\n"
                    )
                except Exception as e:
                    raise e
    except Exception as e:
        GeneratorExit
        raise e
    finally:
        logging.info("prediction capture stopped")
        logging.info(f"{report_data.get("id")} live prediction stopped")

@app.get("/stream/report/{report_id}/prediction") 
async def liveReportPredictionStream(request: Request, report_id: str):
    try:
        if rd.exists(f"{report_id}") == False:
            raise Exception(f"None of prediction report with id {report_id}")

        report_data = getRedisJson(rd, report_id)
        return StreamingResponse(
            capture_prediction_report(request=request, report_data=report_data),
            media_type="application/json",
        )
    except Exception as e:
        logging.error(f"error found at /stream/report/{report_id}/live: {e}")
        raise JSONException(
            statusCode=Status.HTTP_401_UNAUTHORIZED,
            message=str(e),
        )
    
if __name__ == "__main__":
    uvicorn.run(app, host=settings.host, port=settings.port)
