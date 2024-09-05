FROM python:slim-buster

# Set the working directory
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6 libgl1-mesa-glx libglib2.0-0

# Copy requirements.txt and install dependencies
COPY ./requirements.txt .
RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

# Copy the server code
COPY . .

# Expose the gRPC port
EXPOSE 5001

# Define the entry point
CMD ["python3", "main.py"]