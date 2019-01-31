var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.get('/health', (request, response) => {
  return response.json({ status: 'ok' });
});

app.listen(process.env.PORT || 8082);