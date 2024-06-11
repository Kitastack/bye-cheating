from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2

app = Flask(__name__)
CORS(app)  

current_rtsp_url = "rtsp://admin:%40psti2012@192.168.145.2/Streaming/Channels/1"

def generate_frames(rtsp_url):
    video = cv2.VideoCapture(rtsp_url)
    if not video.isOpened():
        raise Exception("Could not open video stream")

    while True:
        success, frame = video.read()
        if not success:
            break
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    video.release()

@app.route('/video_feed')
def video_feed():
    global current_rtsp_url
    return Response(generate_frames(current_rtsp_url), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/set_rtsp', methods=['POST', 'OPTIONS'])
def set_rtsp():
    if request.method == 'OPTIONS':
        return jsonify({"message": "Options request allowed"}), 200
    
    global current_rtsp_url
    data = request.json
    if 'url' in data:
        current_rtsp_url = data['url']
        return jsonify({"message": "RTSP URL updated"}), 200
    return jsonify({"message": "Invalid request"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
