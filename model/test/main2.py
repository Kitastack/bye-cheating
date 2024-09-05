from streaming_pb2 import StreamResponse, StreamRequest, StreamState
from typing import Iterable
from concurrent import futures
from google.protobuf.json_format import MessageToJson

import grpc
import logging
import streaming_pb2_grpc
import threading
import time


# from proto import streaming_pb2_grpc
# from proto.streaming_pb2 import StreamResponse

# python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. --proto_path=../protos streaming.proto

server_options = [
    ("grpc.keepalive_time_ms", 20000),
    ("grpc.keepalive_timeout_ms", 10000),
    ("grpc.http2.min_ping_interval_without_data_ms", 5000),
    ("grpc.max_connection_idle_ms", 10000),
    ("grpc.max_connection_age_ms", 30000),
    ("grpc.max_connection_age_grace_ms", 5000),
    ("grpc.http2.max_pings_without_data", 5),
    ("grpc.keepalive_permit_without_calls", 1),
]


def create_state_response(
    stream_state: StreamState.State,
) -> StreamResponse:
    response = StreamResponse()
    response.stream_state.state = stream_state
    return response


class StreamingServicer(streaming_pb2_grpc.StreamingServicer):
    def __init__(self):
        self._id_counter = 0
        self._lock = threading.RLock()

    def _create_stream_session(self) -> StreamResponse:
        stream_info = StreamResponse()
        with self._lock:
            stream_info.session_id = str(self._id_counter)
            self._id_counter += 1
        stream_info.media = "https://link.to.audio.resources"
        logging.info("Created a stream session [%s]", MessageToJson(stream_info))
        return stream_info

    def _clean_stream_session(self, stream_info: StreamResponse) -> None:
        logging.info("Rtsp session cleaned [%s]", MessageToJson(stream_info))

    def StreamCall(
        self,
        request_iterator: Iterable[StreamRequest],
        context: grpc.ServicerContext,
    ) -> Iterable[StreamResponse]:
        try:
            request = next(request_iterator)
            logging.info(
                "Received a stream request for url [%s]",
                request.url,
            )
        except StopIteration:
            raise RuntimeError("Failed to receive stream request")

        # Simulate the acceptance of call request
        time.sleep(1)
        yield create_state_response(StreamState.NEW)

        # Simulate the start of the call session
        time.sleep(1)
        stream_info = self._create_stream_session()
        context.add_callback(lambda: self._clean_stream_session(stream_info))
        response = StreamResponse()
        response.stream_info.session_id = stream_info.session_id
        response.stream_info.media = stream_info.media
        yield response
        yield create_state_response(StreamState.ACTIVE)

        # Simulate the end of the call
        time.sleep(2)
        yield create_state_response(StreamState.ENDED)
        logging.info("Stream finished [%s]", request.url)


# class StreamingServicer(streaming_pb2_grpc.Streaming):
#     def StreamingRTSP(self, request, context):
#         print(request)
#         return StreamResponse(message=f"Hello!", frame=None)

# def StreamingRTSP(self, request, context):
# try:
#     vs = VideoStream(request.rtsp_url).start()
#     while True:
#         time.sleep(0.5)

#         frame = vs.read()
#         frame = imutils.resize(frame, width=640)
#         output_frame = frame.copy()

#         if output_frame is None:
#             continue

#         (flag, encodedImage) = cv2.imencode(".jpg", output_frame)
#         if not flag:
#             continue

#         yield StreamResponse(frame=encodedImage.tobytes())

# except Exception as e:
#     print(f"Error in stream_video for connection: {e}")  # Log error
# finally:
#     vs.stop()
# return StreamResponse(message=f"Hello!")


def serve():
    server = grpc.server(
        thread_pool=futures.ThreadPoolExecutor(max_workers=10), options=server_options
    )
    streaming_pb2_grpc.add_StreamingServicer_to_server(StreamingServicer(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()
    print("server running")


if __name__ == "__main__":
    logging.basicConfig()
    serve()
