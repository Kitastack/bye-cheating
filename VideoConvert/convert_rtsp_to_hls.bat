@echo off

set RTSP_URL=rtsp://admin:@psti2012@192.168.145.2/Streaming/Channels/1
set HLS_DIR=D:\Repository\Bye-Cheating\bye-cheating\VideoConvert

ffmpeg -i "%RTSP_URL%" -c:v copy -c:a copy -hls_time 2 -hls_list_size 10 -hls_flags delete_segments -start_number 1 "%HLS_DIR%\stream.m3u8"
