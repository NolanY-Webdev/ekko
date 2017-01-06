'use strict';

var expose = require('util/exposer')(module.exports),
    _ = require('lodash');

expose(entity);
function entity(props) {
  var ent = document.createElement('a-entity');
  _.map(props, function(v, k) {
    ent.setAttribute(k, v);
  });
  return ent;
}
