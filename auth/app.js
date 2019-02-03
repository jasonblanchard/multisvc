var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var jwt = require('jsonwebtoken');
var morgan = require('morgan')

const usersByUsername = {
  'test': {
    username: 'test',
    password: 'testpass',
    id: 1
  }
}
 
var app = express();

app.use(bodyParser.json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
 
app.use(session({
  key: 'sessionId',
  secret: 'sekret',
  resave: false,
  saveUninitialized: true,
  // TODO: Use RedisStore
}));

const csrfProtection = csrf();
app.use(cookieParser());

app.get('/health', (request, response) => {
  return response.json({ status: 'ok', service: 'auth', version: 9 });
});
 
app.post('/session', (request, response) => {
  const { username, password } = request.body;
  const user = usersByUsername[username];
  
  if (user && user.password === password) {
    request.session.user = { id: 1 };
    return response.status(201).end();
  }

  return response.status(401).end();
});

app.get('/csrf', csrfProtection, (request, response) => {
  return response.json({ csrfToken: request.csrfToken() });
});

app.use('/session/authn*', csrfProtection, (request, response) => {
  if (request.cookies.sessionId && request.session.user) {
    // TODO: Cache this and regenerate when it expires
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    response.header('Authorization', `Bearer ${token}`);
    return response.status(200).end();
  }
  return response.status(401).end();
});

app.delete('/session', (request, response) => {
  response.clearCookie('sessionId');
  response.status(204).end();
});

app.use(function (err, request, response, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  console.log(request.headers);
  response.status(403)
  response.json({ error: "Invalid csrf token" });
})

app.listen(process.env.PORT || 8082);