'use strict';

var express = require('express');

var app = express();

var path = __dirname + (process.env.NODE_ENV === 'test'
                        ? '/test_public'
                        : '/public');

app.use(express.static(path));

var port = process.env.PORT || 3010;

app.listen(port, function() {
  console.log('Server listening on ' + port);
});
