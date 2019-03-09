describe('auth', () => {
  beforeEach(() => {
    cy.request({
      method: 'DELETE',
      url: 'auth/session',
      failOnStatusCode: false,
      body: {
        username: 'test',
        password: 'testpass'
      }
    });
  });
  
  it('Checks health', function() {
    cy.request('auth/health')
      .then(response => {
        expect(response.status).to.equal(200);
      });
  });
  
  describe('get session', () => {
    it('Gets a 401 when not authorized', function() {
      cy.request({ url: 'auth/session/authn', failOnStatusCode: false })
        .then(response => {
          expect(response.status).to.equal(401);
        });
    });
  });
  
  describe('create session', () => {
    it('creates a session', function() {
      cy.request({
        method: 'POST',
        url: 'auth/login',
        failOnStatusCode: false,
        body: {
          username: 'test',
          password: 'testpass'
        }
      })
        .then(response => {
          expect(response.status).to.equal(201);
    
          return cy.request({ url: 'auth/session/authn', failOnStatusCode: false });
        })
        .then(response => {
          expect(response.status).to.equal(200);
          expect(response.headers.authorization).to.match(/Bearer .+\..+\./);
        });
    });
  
    it('returns 401 if the password is wrong', () => {
      cy.request({
        method: 'POST',
        url: 'auth/login',
        failOnStatusCode: false,
        body: {
          username: 'test',
          password: 'WRONG'
        }
      })
        .then(response => {
          expect(response.status).to.equal(401);
        });
    });
  });
  
  describe('delete a session', () => {
    it('deletes a session', function() {
      cy.request({
        method: 'DELETE',
        url: 'auth/session',
        failOnStatusCode: false,
        body: {
          username: 'test',
          password: 'testpass'
        }
      })
        .then(response => {
          expect(response.status).to.equal(204);
    
          return cy.request({ url: 'auth/session/authn', failOnStatusCode: false });
        })
        .then(response => {
          expect(response.status).to.equal(401);
        });
    });
  });
  
  describe('protected paths', () => {
    it('Gets a 401 when not authorized', function() {
      cy.request({ url: 'echo/health', failOnStatusCode: false })
        .then(response => {
          expect(response.status).to.equal(401);
        });
    });
  
    it('returns 200 after authenticating', function() {
      cy.request({
        method: 'POST',
        url: 'auth/login',
        failOnStatusCode: false,
        body: {
          username: 'test',
          password: 'testpass'
        }
      })
        .then(response => {
          expect(response.status).to.equal(201);
    
          return cy.request({ url: 'echo/health', failOnStatusCode: false });
        })
        .then(response => {
          expect(response.status).to.equal(200);
        });
      });

      it('requres returns 403 for POST request without csrf token', function() {
        cy.request({
          method: 'POST',
          url: 'auth/login',
          failOnStatusCode: false,
          body: {
            username: 'test',
            password: 'testpass'
          }
        })
          .then(response => {
            expect(response.status).to.equal(201);
            return cy.request({ url: 'echo/update', method: 'POST', failOnStatusCode: false });
          })
          .then(response => {
            expect(response.status).to.equal(403);
          });
      });

      it('returns 200 for POST requests with CSRF token', function() {
        cy.request({
          method: 'POST',
          url: 'auth/login',
          failOnStatusCode: false,
          body: {
            username: 'test',
            password: 'testpass'
          }
        })
          .then(response => {
            expect(response.status).to.equal(201);

            return cy.request({ url: 'auth/csrf', failOnStatusCode: false });
          }).then(response => {
            const csrfToken = response.body.csrfToken;
            expect(csrfToken).to.match(/\w+/);
            return cy.request({ url: 'echo/update', method: 'POST', headers: { 'CSRF-Token': response.body.csrfToken }, failOnStatusCode: false });
          })
          .then(response => {
            expect(response.status).to.equal(200);
          });
      });
    });
});