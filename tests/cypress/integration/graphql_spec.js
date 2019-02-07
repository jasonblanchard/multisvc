const GraphQLClient = require('graphql-request').GraphQLClient;

describe('graphql', () => {
  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'auth/session',
      failOnStatusCode: false,
      body: {
        username: 'test',
        password: 'testpass'
      }
    })
  });

  it('works', () => {
    cy.request({ url: 'auth/csrf', failOnStatusCode: false })
      .then(response => {
        const csrfToken = response.body.csrfToken;
        // return cy.request({
        //   url: 'graphql/',
        //   method: 'POST',
        //   headers: { 'CSRF-Token': response.body.csrfToken },
        //   body: {
        //     query:"{\n  health {\n    status\n  }\n}\n"
        //   }
        // });

        const client = new GraphQLClient('http://192.168.99.106:32511/graphql/', {
          headers: {
            'CSRF-Token': csrfToken,
          },
        })

        const query = `{
          health {
            status
            service
          }
        }`

        return client.request(query);
      })
      .then(data => {
        const { health } = data;
        expect(health.status).to.equal('ok');
        expect(health.service).to.equal('GraphQL');
      });
  });
});