FROM python:3.11-slim-buster

# Set the working directory
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg libgl1-mesa-glx 
# libglib2.0-0 libsm6 libxext6
# Copy requirements.txt and install dependencies 
COPY ./requirements.txt .
RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

# Copy the server code
COPY ./model .
COPY ./main.py .
COPY ./video_streaming_pb2_grpc.py .
COPY ./video_streaming_pb2.py .

RUN ls

# Expose the gRPC port
EXPOSE 5001

# Define the entry point
CMD ["python3", "main.py"]