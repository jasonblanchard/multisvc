const messages = require('./protobuf/widgets_service/widgets_pb.js');
const services = require('./protobuf/widgets_service/widgets_grpc_pb.js');
const grpc = require('grpc');

function getWidget(call, callback) {
  const reply = new messages.Widget();
  reply.setId('1');
  reply.setName('Thingy');
  callback(null, reply);
}

var server = new grpc.Server();
server.addService(services.WidgetsService, {
  getWidget,
});

const port = process.env.PORT || 50051;

server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
server.start();

console.log(`Listening on port ${port}`);