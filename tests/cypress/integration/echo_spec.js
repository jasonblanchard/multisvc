describe('echo', () => {
  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'auth/login',
      failOnStatusCode: false,
      body: {
        username: 'test',
        password: 'testpass'
      }
    })
  });

  it('kitchen sink', () => {
    cy.request({ url: 'echo/health'})
      .then(response => {
        expect(response.status).to.equal(200);
      });

    // cy.request({ url: 'http://localhost:8082/update', method: 'POST' })
    //   .then(response => {
    //     console.log(response);
    //   });
  });
});