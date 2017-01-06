'use strict';

var express = require('express');

var app = express();

var path = __dirname + (process.env.NODE_ENV === 'test'
                        ? '/test_public'
                        : '/public');

app.use(express.static(path));

app.get('/*', function(req, res) {
  req;
  res.sendFile(path + '/index.html');
});

var port = process.env.PORT || 3010;

app.listen(port, function() {
  console.log('Server listening on ' + port);
});
