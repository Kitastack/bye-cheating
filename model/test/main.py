from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import StreamingResponse
from imutils.video import VideoStream
from multiprocessing import Process, Queue
from protos import streaming_pb2, streaming_pb2_grpc

import imutils
import time
import cv2
import numpy as np
import threading
import uvicorn

app = FastAPI()


def capture_video(url_rtsp: str, queue):
    try:
        vs = VideoStream(url_rtsp).start()
        while True:
            time.sleep(0.5)

            frame = vs.read()
            frame = imutils.resize(frame, width=640)
            output_frame = frame.copy()

            if output_frame is None:
                continue

            (flag, encodedImage) = cv2.imencode(".jpg", output_frame)
            if not flag:
                continue

            queue.put(encodedImage)

    except Exception as e:
        print(f"Error in stream_video for connection: {e}")  # Log error


async def stream_video(url_rtsp):
    queue = Queue()
    thread = threading.Thread(target=capture_video, args=(url_rtsp, queue))
    thread.start()

    while not queue.empty():
        frame = queue.get()
        # Process frame and yield it for streaming
        yield (
            b"--frame\r\n"
            b"Connection: Keep-Alive\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + frame.tobytes() + b"\r\n"
        )

    thread.join()  # Wait for the capture thread to


@app.get("/streaming")
async def streaming(request: Request):
    # "rtsp://rtspstream:07451b4ef79b34a8473a745fd99a50e0@zephyr.rtsp.stream/movie"
    return StreamingResponse(
        stream_video("rtsp://localhost:8554/mystream", request),
        media_type="multipart/x-mixed-replace;boundary=frame",
    )


@app.get("/ping")
async def read_root():
    return {"message": "Pong!"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9000)
