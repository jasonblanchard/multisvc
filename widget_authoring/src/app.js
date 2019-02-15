const messages = require('./protobuf/widget_authoring_service/widget_authoring_pb.js');
const services = require('./protobuf/widget_authoring_service/widget_authoring_grpc_pb.js');
const grpc = require('grpc');

let id = 0;

function getId() {
  return (++id).toString();
}

const widgetsById = {
  1: {
    id: getId(),
    name: 'Thingy'
  }
}

function getWidget(call, callback) {
  const widget = widgetsById[call.request.getId()];
  const reply = new messages.Widget();
  reply.setId(widget.id);
  reply.setName(widget.name);
  callback(null, reply);
}

function createWidget(call, callback) {
  const id = getId();
  const widget = {
    id,
    name: call.request.getName(),
  }

  widgetsById[id] = widget;

  const reply = new messages.Widget();
  reply.setId(widget.id);
  reply.setName(widget.name);
  callback(null, reply);
}

var server = new grpc.Server();
server.addService(services.WidgetAuthoringService, {
  getWidget,
  createWidget,
});

const port = process.env.PORT || 50051;

server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
server.start();

console.log(`Listening on port ${port}`);