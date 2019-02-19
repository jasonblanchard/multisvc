const messages = require('../src/protobuf/widget_authoring_service/widget_authoring_pb.js');
const services = require('../src/protobuf/widget_authoring_service/widget_authoring_grpc_pb.js');
const grpc = require('grpc');

const client = new services.WidgetAuthoringClient('localhost:50051', grpc.credentials.createInsecure());

describe('client', () => {
  it('works', done => {
    const request = new messages.WidgetRequest();
    request.setId('1');

    client.getWidgetById(request, (error, response) => {
      expect(response.getId()).toEqual('1');
      expect(response.getName()).toEqual('Thingy');
      done();
    });
  });
});
