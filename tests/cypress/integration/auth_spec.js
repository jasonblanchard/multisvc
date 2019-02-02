const baseUrl = 'http://192.168.99.105:31312';

describe('auth', () => {
  beforeEach(() => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/auth/session`,
      failOnStatusCode: false,
      body: {
        username: 'test',
        password: 'testpass'
      }
    });
  });
  
  it('Checks health', function() {
    cy.request(`${baseUrl}/auth/health`)
      .then(response => {
        expect(response.status).to.equal(200);
      });
  });
  
  describe('get session', () => {
    it('Gets a 401 when not authorized', function() {
      cy.request({ url: `${baseUrl}/auth/session`, failOnStatusCode: false })
        .then(response => {
          expect(response.status).to.equal(401);
        });
    });
  });
  
  describe('create session', () => {
    it('creates a session', function() {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/session`,
        failOnStatusCode: false,
        body: {
          username: 'test',
          password: 'testpass'
        }
      })
        .then(response => {
          expect(response.status).to.equal(201);
    
          return cy.request({ url: `${baseUrl}/auth/session`, failOnStatusCode: false });
        })
        .then(response => {
          expect(response.status).to.equal(200);
          console.log(response);
          expect(response.headers.authorization).to.match(/Bearer .+\..+\./);
        });
    });
  
    it('returns 401 if the password is wrong', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/session`,
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
        url: `${baseUrl}/auth/session`,
        failOnStatusCode: false,
        body: {
          username: 'test',
          password: 'testpass'
        }
      })
        .then(response => {
          expect(response.status).to.equal(204);
    
          return cy.request({ url: `${baseUrl}/auth/session`, failOnStatusCode: false });
        })
        .then(response => {
          expect(response.status).to.equal(401);
        });
    });
  });
  
  describe('protected paths', () => {
    it('Gets a 401 when not authorized', function() {
      cy.request({ url: `${baseUrl}/echo/health`, failOnStatusCode: false })
        .then(response => {
          expect(response.status).to.equal(401);
        });
    });
  
    it('creates a session', function() {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/session`,
        failOnStatusCode: false,
        body: {
          username: 'test',
          password: 'testpass'
        }
      })
        .then(response => {
          expect(response.status).to.equal(201);
    
          return cy.request({ url: `${baseUrl}/echo/health`, failOnStatusCode: false });
        })
        .then(response => {
          expect(response.status).to.equal(200);
        });
      });
    });
});