describe('star ratings', () => {
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

  it('gets star ratings', () => {
    cy.request({ url: 'auth/csrf', failOnStatusCode: false })
      .then(response => {
        const csrfToken = response.body.csrfToken;

        const query = `query starRatingsByRatableId($ratableId: String!) {
          starRatingsByRatableId(ratableId: $ratableId) {
            id
            rating
          }
        }`

        const variables = {
          ratableId: '1'
        };

        return cy.request({
          url: '/graphql/',
          body: {
            query,
            variables
          },
          method: 'POST',
          headers: { 'CSRF-Token': response.body.csrfToken }
        });
      })
      .then(response => {
        const starRating = response.body.data.starRatingsByRatableId[0];
        expect(starRating.id).to.equal('1');
        expect(starRating.rating).to.equal(3);
      });
  });
});