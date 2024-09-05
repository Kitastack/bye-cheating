from concurrent import futures
import grpc
import time
import logging
import cv2
import imutils
import json
import numpy as np


from ultralytics import YOLO
from imutils.video import VideoStream
from video_streaming_pb2 import (
    StreamRequest,
    StreamResponse,
    StreamResponseModel,
    State,
)
from video_streaming_pb2_grpc import (
    VideoStreamingServicer,
    add_VideoStreamingServicer_to_server,
)

model = YOLO("./model/best.pt")
# select interpreter
# python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. --proto_path=../api/src video_streaming.proto
# "rtsp://localhost:8554/mystream" os.environ['ENV_VARIABLE_NAME'] if var1 is None else var1
# chunk_size = 1024  # Adjust chunk size as needed


class VideoStreamingServicer(VideoStreamingServicer):
    def getStream(self, request, context):
        try:
            vs = VideoStream(request.url).start()

            if hasattr(request, "resolution"):
                frame_size = (1280, 720)
            else:
                frame_size = None

            with futures.ThreadPoolExecutor(max_workers=1) as executor:
                while vs.stopped is False:
                    future = executor.submit(self.getNextFrame, vs, frame_size)
                    frame, encoded_frame = future.result()
                    try:
                        if frame is None or encoded_frame is None:
                            break

                        print("ok")
                        # todo = using chunks
                        # for i in range(0, len(encoded_frame), chunk_size):
                        #     chunk = encoded_frame[i : i + chunk_size]
                        #     yield StreamResponse(
                        #         data=chunk, state=StreamResponse.State.PROCESSING
                        #     )
                        yield StreamResponse(data=encoded_frame, state=State.COMPLETED)
                    except Exception as e:
                        print(e)
                        yield StreamResponse(state=State.ERROR)
                        vs.stop()
                        break
                    finally:
                        del frame
                        del encoded_frame
                        del future
                time.sleep(0.5)
        except Exception as e:
            print(e)
            yield StreamResponse(state=State.ERROR)
        finally:
            vs.stop()
            print("stopped")

    def getStreamModel(self, request, context):
        try:
            vs = VideoStream(request.url).start()

            if hasattr(request, "resolution"):
                frame_size = (1280, 720)
            else:
                frame_size = None

            with futures.ThreadPoolExecutor(max_workers=2) as frame_executor:
                while vs.stopped is False:
                    future = frame_executor.submit(self.getNextFrame, vs, frame_size)
                    frame, encoded_frame = future.result()
                    try:
                        if frame is None:
                            break

                        print(type(frame))

                        detections = model.track(
                            frame,
                            imgsz=1024,
                            conf=0.35,
                            line_width=1,
                        )

                        print(detections)

                        yield StreamResponseModel(
                            # detail=json.loads(detections[0].tojson()),
                            detail="",
                            raw=encoded_frame,
                            data=cv2.imencode("result.jpeg", detections[0].plot())[
                                1
                            ].tobytes(),
                            state=State.COMPLETED,
                        )
                    except Exception as e:
                        raise e
                    finally:
                        del frame
                        del encoded_frame
                        del future
                time.sleep(1)
        except Exception as e:
            print(e)
            yield StreamResponse(state=State.ERROR)
        finally:
            vs.stop()
            print("stopped")

    def getNextFrame(self, vs, frame_size=None, is_raw=False):
        frame = vs.read()
        if frame is None:
            return None, None

        if not frame_size is None:
            frame = imutils.resize(frame, width=frame_size[0], height=frame_size[1])

        if is_raw == True:
            return frame, None

        _, encoded_frame = cv2.imencode(".jpeg", frame)
        return frame, encoded_frame.tobytes()


def serve():
    server = grpc.server(
        thread_pool=futures.ThreadPoolExecutor(max_workers=10),
        options=[("grpc.max_send_message_size", 5 * 1024 * 1024)],  # Set to 100 MB
    )
    add_VideoStreamingServicer_to_server(VideoStreamingServicer(), server)
    server.add_insecure_port("[::]:5001")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    logging.basicConfig()
    serve()
