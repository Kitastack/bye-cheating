FROM python:3.11-slim-buster

# Set the working directory
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg libgl1-mesa-glx 
# libglib2.0-0 libsm6 libxext6
# Copy requirements.txt and install dependencies 
COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the server code
COPY . .

# Define the entry point
CMD ["sh", "start.sh"]