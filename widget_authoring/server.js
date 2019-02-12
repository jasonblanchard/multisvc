const messages = require('./protobuf/widget_authoring_service/widget_authoring_pb.js');
const services = require('./protobuf/widget_authoring_service/widget_authoring_grpc_pb.js');
const grpc = require('grpc');

function getWidget(call, callback) {
  const reply = new messages.Widget();
  reply.setId('1');
  reply.setName('Thingy');
  callback(null, reply);
}

var server = new grpc.Server();
server.addService(services.WidgetAuthoringService, {
  getWidget,
});

const port = process.env.PORT || 50051;

server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
server.start();

console.log(`Listening on port ${port}`);