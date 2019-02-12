#!/bin/bash

grpc_tools_node_protoc=./node_modules/bin/grpc_tools_node_protoc

# TODO: Iterate through services and build client libraries for each
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:npm --grpc_out=npm --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` widget_authoring_service/widget_authoring.proto