const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const morgan = require('morgan')

const widgetAuthoringMessages = require('./protobuf/widget_authoring_service/widget_authoring_pb.js');
const widgetAuthoringServices = require('./protobuf/widget_authoring_service/widget_authoring_grpc_pb.js');
const grpc = require('grpc');

require('dotenv').config();

const typeDefs = gql`
  type Widget {
    id: String
    name: String
  }

  type Query {
    widget(id: String!): Widget
  }

  type Mutation {
    createWidget(name: String!): Widget
  }
`;

const client = new widgetAuthoringServices.WidgetAuthoringClient(process.env.WIDGET_AUTHORING_SERVICE_HOST, grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    widget: (_, args) => {
      return new Promise((resolve, reject) => {
        const request = new widgetAuthoringMessages.WidgetRequest();
        request.setId(args.id);

        client.getWidget(request, (error, response) => {
          if (!response) return resolve(null);
          resolve({
            id: response.getId(),
            name: response.getName(),
          });
        });
      });
    },
  },
  
  Mutation: {
    createWidget: (_, args) => {
      return new Promise((resolve, reject) => {
        const request = new widgetAuthoringMessages.CreateWidgetRequest();
        
        request.setName(args.name);

        client.createWidget(request, (error, response) => {
          if (!response) return resolve(null);
          
          resolve({
            id: response.getId(),
            name: response.getName()
          })
        });
      });
    }
  }
};

const schema = mergeSchemas({
  schemas:[
    makeExecutableSchema({ typeDefs, resolvers }),
  ]
});

const server = new ApolloServer({ schema });

const app = express();

app.use(morgan('combined'));

app.get('/health', (request, response) => {
  response.json({ status: 'ok' });
});

const path = '/';

server.applyMiddleware({ app, path });

const port = process.env.PORT || 8003;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
);