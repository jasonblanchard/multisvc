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

        const client = new GraphQLClient('/graphql/', {
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

  it('gets widgets', () => {
    cy.request({ url: 'auth/csrf', failOnStatusCode: false })
      .then(response => {
        const csrfToken = response.body.csrfToken;

        const client = new GraphQLClient('/graphql/', {
          headers: {
            'CSRF-Token': csrfToken,
          },
        })

        const query = `query getWidget($id: String!) {
          widget(id: $id) {
            id
            name
          }
        }`

        const variables = {
          id: '1'
        };

        return client.request(query, variables);
      })
      .then(data => {
        const { widget } = data;
        expect(widget.id).to.equal('1');
        expect(widget.name).to.equal('Thingy');
      });
  });
});