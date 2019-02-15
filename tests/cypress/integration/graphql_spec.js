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

        // const client = new GraphQLClient('/graphql/', {
        //   headers: {
        //     'CSRF-Token': csrfToken,
        //   },
        // })

        const query = `{
          health {
            status
            service
          }
        }`

        // TODO: Figure out why non cy-request promises aren't working in headless mode.
        // return client.request(query);
        return cy.request({
          url: '/graphql/',
          body: {
            query
          },
          method: 'POST',
          headers: { 'CSRF-Token': response.body.csrfToken },
          failOnStatusCode: false
        });
      })
      .then(response => {
        expect(response.status).to.equal(200);
        const health = response.body.data.health;
        // const { health } = data;
        expect(health.status).to.equal('ok');
        expect(health.service).to.equal('GraphQL');
      });
  });

  it('gets widgets', () => {
    cy.request({ url: 'auth/csrf', failOnStatusCode: false })
      .then(response => {
        const csrfToken = response.body.csrfToken;

        // const client = new GraphQLClient('/graphql/', {
        //   headers: {
        //     'CSRF-Token': csrfToken,
        //   },
        // })

        const query = `query getWidget($id: String!) {
          widget(id: $id) {
            id
            name
          }
        }`

        const variables = {
          id: '1'
        };

        // return client.request(query, variables);
        return cy.request({
          url: '/graphql/',
          body: {
            query,
            variables
          },
          method: 'POST',
          headers: { 'CSRF-Token': response.body.csrfToken },
          failOnStatusCode: false
        });
      })
      .then(response => {
        // const { widget } = data;
        const widget = response.body.data.widget;
        expect(widget.id).to.equal('1');
        expect(widget.name).to.equal('Thingy');
      });
  });
});