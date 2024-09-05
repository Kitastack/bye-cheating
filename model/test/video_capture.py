import queue
import threading
import cv2  # type: ignore
import numpy as np  # type: ignore


class VideoCapture:
    """cv2.VideoCapture wrapper, workaround to get the latest frame from cv2.VideoCapture"""

    def __init__(self, name):
        self.cap = cv2.VideoCapture(name)
        self.q = queue.Queue()
        t = threading.Thread(target=self.reader)
        t.daemon = True
        t.start()

    # read frames as soon as they are available, keeping only most recent one
    def reader(self):
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break
            if not self.q.qsize() < 20:
                try:
                    self.q.get_nowait()  # discard previous (unprocessed) frame
                except queue.Empty:
                    pass
            self.q.put(frame)

    def size(self):
        width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        return width, height

    def read(self):
        if self.q.empty():
            return
        return self.q.get()

    def release(self):
        self.cap.release()
