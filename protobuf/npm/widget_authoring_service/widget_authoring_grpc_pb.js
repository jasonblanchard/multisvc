// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var widget_authoring_service_widget_authoring_pb = require('../widget_authoring_service/widget_authoring_pb.js');

function serialize_widgets_authoring_CreateWidgetRequest(arg) {
  if (!(arg instanceof widget_authoring_service_widget_authoring_pb.CreateWidgetRequest)) {
    throw new Error('Expected argument of type widgets.authoring.CreateWidgetRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_widgets_authoring_CreateWidgetRequest(buffer_arg) {
  return widget_authoring_service_widget_authoring_pb.CreateWidgetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_widgets_authoring_Widget(arg) {
  if (!(arg instanceof widget_authoring_service_widget_authoring_pb.Widget)) {
    throw new Error('Expected argument of type widgets.authoring.Widget');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_widgets_authoring_Widget(buffer_arg) {
  return widget_authoring_service_widget_authoring_pb.Widget.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_widgets_authoring_WidgetRequest(arg) {
  if (!(arg instanceof widget_authoring_service_widget_authoring_pb.WidgetRequest)) {
    throw new Error('Expected argument of type widgets.authoring.WidgetRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_widgets_authoring_WidgetRequest(buffer_arg) {
  return widget_authoring_service_widget_authoring_pb.WidgetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var WidgetAuthoringService = exports.WidgetAuthoringService = {
  getWidget: {
    path: '/widgets.authoring.WidgetAuthoring/GetWidget',
    requestStream: false,
    responseStream: false,
    requestType: widget_authoring_service_widget_authoring_pb.WidgetRequest,
    responseType: widget_authoring_service_widget_authoring_pb.Widget,
    requestSerialize: serialize_widgets_authoring_WidgetRequest,
    requestDeserialize: deserialize_widgets_authoring_WidgetRequest,
    responseSerialize: serialize_widgets_authoring_Widget,
    responseDeserialize: deserialize_widgets_authoring_Widget,
  },
  createWidget: {
    path: '/widgets.authoring.WidgetAuthoring/CreateWidget',
    requestStream: false,
    responseStream: false,
    requestType: widget_authoring_service_widget_authoring_pb.CreateWidgetRequest,
    responseType: widget_authoring_service_widget_authoring_pb.Widget,
    requestSerialize: serialize_widgets_authoring_CreateWidgetRequest,
    requestDeserialize: deserialize_widgets_authoring_CreateWidgetRequest,
    responseSerialize: serialize_widgets_authoring_Widget,
    responseDeserialize: deserialize_widgets_authoring_Widget,
  },
};

exports.WidgetAuthoringClient = grpc.makeGenericClientConstructor(WidgetAuthoringService);
