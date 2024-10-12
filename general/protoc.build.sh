mkdir -p ./src/protoc
./node_modules/.bin/grpc_tools_node_protoc --grpc_out=grpc_js:./src/protoc --js_out=import_style=commonjs,binary:./src/protoc  --proto_path=../protoc authentication.proto
./node_modules/.bin/grpc_tools_node_protoc  --grpc_out=grpc_js:./src/protoc --js_out=import_style=commonjs,binary:./src/protoc --proto_path=../protoc report.proto
# ./node_modules/.bin/grpc_tools_node_protoc  --grpc_out=grpc_js:./src/protoc --js_out=import_style=commonjs,binary:./src/protoc --proto_path=../protoc store.proto
./node_modules/.bin/grpc_tools_node_protoc  --grpc_out=grpc_js:./src/protoc --js_out=import_style=commonjs,binary:./src/protoc --proto_path=../protoc stream.proto
protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --ts_out=grpc_js:./src/protoc --proto_path=../protoc authentication.proto
protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --ts_out=grpc_js:./src/protoc --proto_path=../protoc report.proto
# protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --ts_out=grpc_js:./src/protoc --proto_path=../protoc store.proto
protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --ts_out=grpc_js:./src/protoc --proto_path=../protoc stream.proto