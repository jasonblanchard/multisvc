var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

const usersByUsername = {
  'test': {
    username: 'test',
    password: 'testpass',
    id: 1
  }
}
 
var app = express();

app.use(bodyParser.json());
 
app.use(session({
  key: 'session_id',
  secret: 'sekret',
  resave: false,
  saveUninitialized: true,
  // TODO: Use RedisStore
}));

app.use(cookieParser());

app.get('/health', (request, response) => {
  return response.json({ status: 'ok' });
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

app.get('/session', (request, response) => {
  if (request.cookies.session_id && request.session.user) {
    // TODO: Cache this and regenerate when it expires
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    response.header('Authorization', `Bearer ${token}`);
    return response.status(200).end();
  }
  return response.status(401).end();
});

app.delete('/session', (request, response) => {
  response.clearCookie('session_id');
  response.status(204).end();
});

app.listen(process.env.PORT || 8082);