// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var widgets_pb = require('./widgets_pb.js');

function serialize_widgets_Widget(arg) {
  if (!(arg instanceof widgets_pb.Widget)) {
    throw new Error('Expected argument of type widgets.Widget');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_widgets_Widget(buffer_arg) {
  return widgets_pb.Widget.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_widgets_WidgetRequest(arg) {
  if (!(arg instanceof widgets_pb.WidgetRequest)) {
    throw new Error('Expected argument of type widgets.WidgetRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_widgets_WidgetRequest(buffer_arg) {
  return widgets_pb.WidgetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var WidgetsService = exports.WidgetsService = {
  getWidget: {
    path: '/widgets.Widgets/GetWidget',
    requestStream: false,
    responseStream: false,
    requestType: widgets_pb.WidgetRequest,
    responseType: widgets_pb.Widget,
    requestSerialize: serialize_widgets_WidgetRequest,
    requestDeserialize: deserialize_widgets_WidgetRequest,
    responseSerialize: serialize_widgets_Widget,
    responseDeserialize: deserialize_widgets_Widget,
  },
};

exports.WidgetsClient = grpc.makeGenericClientConstructor(WidgetsService);
