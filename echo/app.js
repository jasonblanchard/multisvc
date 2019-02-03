var express = require('express');
var bodyParser = require('body-parser');

var app = express();

let counter = 0;

app.use(bodyParser.json());

app.get('/health', (request, response) => {
  return response.json({ status: 'ok', service: 'echo', version: 5 });
});

app.post('/update', (request, response) => {
  counter++;

  return response.json({ counter });
});

app.listen(process.env.PORT || 8082);