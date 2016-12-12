'use strict';

var express = require('express');

var app = express();

app.use(express.static(__dirname));

app.get('/*', function(req, res) {
  req;
  res.sendFile(__dirname + '/index.html');
});

var port = process.env.PORT || 3010;

app.listen(port, function() {
  console.log('Server listening on ' + port);
});
