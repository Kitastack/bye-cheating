# image
FROM python:3.12.4
# set working directory
WORKDIR /app
RUN apt-get update && apt-get clean RUN && \
apt-get install -y htop libgl1-mesa-glx libglib2.0-0
# RUN pip3 freeze > requirements.txt
COPY ./requirements.txt .
# install dependencies
RUN pip3 install fastapi
RUN pip3 install --no-cache-dir --upgrade -r requirements.txt
# Copy the rest of the application files to the container
COPY . .
# setup port
# EXPOSE 8093
CMD ["fastapi", "run", "main.py", "--port", "8000"]