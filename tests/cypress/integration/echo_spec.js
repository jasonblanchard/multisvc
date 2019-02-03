describe('echo', () => {
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

  it('kitchen sink', () => {
    cy.request({ url: 'echo/health'})
      .then(response => {
        expect(response.status).to.equal(200);
      });
  });
});