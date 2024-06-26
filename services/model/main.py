from fastapi import FastAPI, Request, UploadFile, Form, HTTPException
from fastapi.responses import Response
from typing import Annotated, Optional
from ultralytics import YOLO
from PIL import Image as im
import numpy as np
import logging
import base64
import json
import cv2

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

app = FastAPI()
model = YOLO("best.pt")


def get_formatted_image_from_binary(image_bytes):
    image = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image


@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}


@app.post("/detect/")
async def detect_objects(
    request: Request,
    file: Optional[Annotated[UploadFile, Form()]] = Form(None),
    fileBase64: Optional[Annotated[str, Form()]] = Form(None),
):
    try:
        # Process the uploaded image for object detection
        if file:
            image_bytes = await file.read()
        else:
            image_bytes = base64.b64decode(fileBase64)

        # Perform object detection with YOLOv7 (interfence)
        detections = model.predict(
            get_formatted_image_from_binary(image_bytes),
            imgsz=1024,
            conf=0.35,
            line_width=1,
        )

        formatted_image = cv2.imencode("result.png", detections[0].plot())[1]

        logger.info(request.headers)
        # return as buffer
        return Response(
            content=im.fromarray(formatted_image).tobytes(),
            media_type="image/png",
        )
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="something wrong behind")


@app.post("/detect/result-with-image/")
async def detect_objects(
    request: Request,
    file: Optional[Annotated[UploadFile, Form()]] = Form(None),
    fileBase64: Optional[Annotated[str, Form()]] = Form(None),
):
    try:
        logger.info(request.headers)

        # Process the uploaded image for object detection
        if file:
            image_bytes = await file.read()
        else:
            image_bytes = base64.b64decode(fileBase64)

        # Perform object detection with YOLOv7 (interfence)
        detections = model.track(
            get_formatted_image_from_binary(image_bytes),
            imgsz=1024,
            conf=0.35,
            line_width=1,
        )

        formatted_image = cv2.imencode("result.png", detections[0].plot())[1]

        # return as json
        return {
            "message": "successfully predicted",
            "result": json.loads(detections[0].tojson()),
            "image": base64.b64encode(formatted_image),
        }
    except:
        raise HTTPException(status_code=500, detail="something wrong behind")
