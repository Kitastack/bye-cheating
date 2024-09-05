import subprocess
import cv2  # type: ignore
from rtsp.video_capture import VideoCapture


class ModelPipe:
    video: VideoCapture
    """Wrapper of cv2.VideoCapture. model will read the latest frame from this class"""

    ffm: subprocess.Popen
    """FFMPEG subprocess"""

    size: tuple[int, int]
    """video source size (width, height)"""

    is_stopped: bool = False

    def __init__(self, source: str, output: str) -> None:
        self.source = source
        self.output = output

    # read frame from pipe as raw image with format RGB 24-Bit, size widthxheight
    def create_ffm(self, width: int, height: int):
        args = (
            f"ffmpeg -y -f rawvideo -vcodec rawvideo -pix_fmt bgr24 -s {width}x{height} -i pipe: -pix_fmt yuv420p -f rtsp {self.output.url}"
        ).split()
        return subprocess.Popen(
            args=args,
            stdin=subprocess.PIPE,
            stdout=subprocess.DEVNULL,  # hide shell output
            stderr=subprocess.STDOUT,
        )

    def setup_source(self):
        # check type of source
        if type(self.source) == str:
            print(f"SOURCE URL: {self.source.url}")
            self.video = VideoCapture(self.source.url)
            self.size = self.video.size()

    def setup_output(self):
        if type(self.output) == str:
            print(f"OUTPUT URL: {self.output.url}")
            self.ffm = self._create_ffm(width=self.size[0], height=self.size[1])

    def validate_source(self):
        return self.video.cap.isOpened()

    def start(self):
        self.is_stopped = False
        self.setup_source()
        if not self.validate_source():
            print("Source is NOT OPENED")
            return
        self._setup_output()
        print("IO Ready: Interferencing...")

        # Loop
        while True:
            if self.is_stopped:
                break

            frame = self.video.read()
            if frame is None:
                continue

            frame_labeled = self.ml.predict(frame)
            self.ffm.stdin.write(frame_labeled.astype(np.uint8).tobytes())  # type: ignore

            # cv2.imshow("Image", labeled)
            # if cv2.waitKey(1) == ord("q"):
            #     self.stop()

        self.video.release()
        self.ffm.stdin.close()  # type: ignore
        self.ffm.wait()
        cv2.destroyAllWindows()

    def stop(self):
        self.is_stopped = True
