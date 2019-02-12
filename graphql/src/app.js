const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// TODO: Figure out how to share these. Share the compiled classes? Or the proto files?
// Probably proto files and re-compile in each consumer.
const widgetAuthoringMessages = require('./protobuf/widget_authoring_service/widget_authoring_pb.js');
const widgetAuthoringServices = require('./protobuf/widget_authoring_service/widget_authoring_grpc_pb.js');
const grpc = require('grpc');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Health {
    status: String
    service: String
    version: Int
  }

  type Widget {
    id: String
    name: String
  }

  type Query {
    health: Health
    widget(id: String!): Widget
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    health: () => ({
      status: 'ok',
      service: 'GraphQL',
      version: 7
    }),
    widget: (_, args) => {
      return new Promise((resolve, reject) => {
        // TODO: Get service and port from envs?
        const client = new widgetAuthoringServices.WidgetAuthoringClient('widget-authoring:8081', grpc.credentials.createInsecure());
        const request = new widgetAuthoringMessages.WidgetRequest();
        request.setId(args.id);

        client.getWidget(request, (error, response) => {
          resolve({
            id: response.getId(),
            name: response.getName(),
          });
        });
      });
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

app.get('/health', (request, response) => {
  response.json({ status: 'ok' });
});

const path = '/';

server.applyMiddleware({ app, path });

const port = process.env.PORT || 8002;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
);