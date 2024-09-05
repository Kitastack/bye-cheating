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
        frame_size (tuple): The expected frame size (width, height).
    """

    try:
        # command = [
        #     "ffmpeg",
        #     "-rtsp_transport",
        #     "tcp",  # Force TCP (for testing)
        #     "-max_delay",
        #     "30000000",
        #     # "-framerate",
        #     # "15",
        #     "-i",
        #     rtsp_url,
        #     "-vf",
        #     f"scale={frame_size[0]}:{frame_size[1]}",  # Ensure correct frame size
        #     "-vcodec",
        #     "rawvideo",  # Video format is raw video
        #     "-an",
        #     "-sn",  # disable audio processing
        #     "-pix_fmt",
        #     "bgr24",  # bgr24 pixel format matches OpenCV default pixels format.
        #     "-f",
        #     "rawvideo",
        #     "pipe:",
        # ]

        # process = subprocess.Popen(
        #     command, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        # )

        # for i in range(num_frames):
        #     frame_data = process.stdout.read(frame_size[0] * frame_size[1] * 3)

        #     if not frame_data:
        #         print("Empty frame received")
        #         continue  # Skip empty frames

        #     frame = np.frombuffer(frame_data, dtype=np.uint8)

        #     # Print frame size for debugging
        #     print(f"Frame size: {frame.shape} {type(frame_data)}")
        #     cv2.imwrite(f"{output_dir}/frame-{i:03d}.png", frame)

        #     # # # Encode to JPEG
        #     # _, encoded_image = cv2.imencode(".jpg", frame)

        #     # # Save the image to a file
        #     # image_path = f"{output_dir}/image_{i:03d}.jpg"
        #     # with open(image_path, "wb") as f:
        #     #     f.write(frame)

        #     time.sleep(0.1)  # Adjust sleep time based on frame rate

        # process.terminate()
        # print("Image capture completed.")

        vs = VideoStream(rtsp_url).start()
        i = 0
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

    except Exception as e:
        print(f"Error capturing images: {e}")


# Example usage:
rtsp_url = "rtsp://localhost:8554/mystream"
output_dir = "captured_images"
num_frames = 10
frame_size = (640, 480)  # Adjust frame size as needed

capture_rtsp_images(rtsp_url, output_dir, num_frames, frame_size)
