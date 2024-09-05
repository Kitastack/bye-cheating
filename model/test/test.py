import subprocess
from imutils.video import VideoStream
import imutils
import time
import cv2
import numpy as np


def capture_rtsp_images(rtsp_url, output_dir, num_frames=10, frame_size=(640, 480)):
    """Captures images from an RTSP stream and saves them to a directory.

    Args:
        rtsp_url (str): The RTSP URL of the stream.
        output_dir (str): The directory to save the captured images.
        num_frames (int): The number of frames to capture.
    """

    try:

        i = 0
        vs = VideoStream(rtsp_url).start()

        while True:
            time.sleep(1)

            frame = vs.read()
            frame = imutils.resize(frame, width=frame_size[0])
            output_frame = frame.copy()

            if output_frame is None:
                continue
            (flag, encodedImage) = cv2.imencode(".jpg", output_frame)
            if not flag:
                continue

            # Save the image to a file
            image_path = f"{output_dir}/image_{i:03d}.jpg"
            with open(image_path, "wb") as f:
                f.write(encodedImage)
            i += 1

        command = [
            "ffmpeg",
            "-noautorotate",
            "-loglevel",
            "quiet" "-i",
            rtsp_url,
            "-q:v",
            "2",
            "-an",
            "-sn",  # disable audio processing
            "-f",
            "image2",
            "-update",
            "1",
            "-",
        ]

        process = subprocess.Popen(
            command, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )

        for i in range(num_frames):
            # Add debugging statements

            frame_data = process.stdout.read()  # Read the entire frame data
            frame = np.frombuffer(frame_data, dtype=np.uint8)  # Convert to NumPy array

            if frame.size == 0:
                print("Empty frame received")
                continue

            # # Encode to JPEG
            # _, encoded_image = cv2.imencode(".jpg", frame)

            # # Save the image to a file
            # image_path = f"{output_dir}/image_{i:03d}.jpg"
            # with open(image_path, "wb") as f:
            #     f.write(encoded_image)

        process.terminate()
        print("Image capture completed.")

    except Exception as e:
        print(f"Error capturing images: {e}")


# Example usage:
rtsp_url = "rtsp://localhost:8554/mystream"
output_dir = "captured_images"
num_frames = 100
frame_size = (640, 480)  # Adjust frame size as needed

capture_rtsp_images(rtsp_url, output_dir, num_frames, frame_size)
