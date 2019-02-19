const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {
  introspectSchema,
  makeExecutableSchema,
  mergeSchemas,
  makeRemoteExecutableSchema
} = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { setContext } = require('apollo-link-context');


require('dotenv').config();


// TODO: Figure out how to pass in an authenticated user context to the stitched schemas
function getRemoveExecutableSchema(uri) {
  const http = new HttpLink({ uri, fetch });
  
  const link = setContext((request, previousContext) => {
    console.log(request);
    return {
      headers: {
        'Authorization': 'asdf',
      }
    }
  }).concat(http);  

  return introspectSchema(link)
    .then(schema => {
      return makeRemoteExecutableSchema({
        schema,
        link,
      });      
    });
}

// TODO: This is suuuuuper dumb, but should eliminate startup order issues.
// TODO: Also need to tackle the schema change problem. Will need to bounce this server in the meantime to pick up changes.
const interval = setInterval(() => {
  const getRemoteExecutableSchemas = Promise.all([
    getRemoveExecutableSchema(process.env.WIDGET_AUTHORING_SERVICE_PRESENTER_PATH),
    getRemoveExecutableSchema(process.env.STAR_RATING_PRESENTER_PATH)
  ]);

  getRemoteExecutableSchemas.then(remoteExecutableSchemas => {
    clearInterval(interval);
    
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
    
    const resolvers = {
      Query: {
        health: () => ({
          status: 'ok',
          service: 'GraphQL',
          version: 9
        }),
      },
    };
    
    const schema = mergeSchemas({
      schemas:[
        makeExecutableSchema({ typeDefs, resolvers }),
        ...remoteExecutableSchemas
      ]
    });
    
    const server = new ApolloServer({ schema });
    
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
  }).catch(error => {
    console.log(error.message);
    console.log('Retrying');
  });
}, 1000);
