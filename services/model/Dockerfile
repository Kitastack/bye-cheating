# image
FROM python:3.9
# install dependencies
RUN pip freeze > requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt
# setup port
USER model
EXPOSE 8093
CMD ["fastapi", "run", "main.py", "--port", "80"]
