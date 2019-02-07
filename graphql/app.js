const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Health {
    status: String
    service: String
    version: Int
  }

  type Query {
    health: Health
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    health: () => ({
      status: 'ok',
      service: 'GraphQL',
      version: 1
    }),
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