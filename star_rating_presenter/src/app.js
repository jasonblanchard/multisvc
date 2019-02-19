const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const morgan = require('morgan')

const grpc = require('grpc');

require('dotenv').config();

const typeDefs = gql`
  type StarRating {
    id: String
    rating: Int
  }

  type Query {
    starRatingsByRatableId(ratableId: String!): [StarRating]
  }
`;

const resolvers = {
  Query: {
    // TODO: CHange to starRatingsByRatableId
    starRatingsByRatableId: (_parent, _args, context) => {
      // TODO: Figure out how to get an authenticated user id in here from the graphql service
      return new Promise((resolve, reject) => {
        return resolve([
          {
            id: '1',
            rating: 3
          }
        ]);
      });
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

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