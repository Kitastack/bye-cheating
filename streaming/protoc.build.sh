mkdir -p protoc
python3 -m grpc_tools.protoc -I. --python_out=./protoc --grpc_python_out=./protoc --proto_path=../protoc authentication.proto
python3 -m grpc_tools.protoc -I. --python_out=./protoc --grpc_python_out=./protoc --proto_path=../protoc report.proto
# python3 -m grpc_tools.protoc -I. --python_out=./protoc --grpc_python_out=./protoc --proto_path=../protoc store.proto
python3 -m grpc_tools.protoc -I. --python_out=./protoc --grpc_python_out=./protoc --proto_path=../protoc stream.proto