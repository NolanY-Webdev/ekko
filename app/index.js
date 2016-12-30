'use strict';

var ReactDOM = require('react-dom');
require('aframe'); // Load in aframe

ReactDOM.render(
  require('main'),
  document.getElementById('app-entry')
);

window.onload = function() {
  console.log('loaded');
  var play = document.getElementById('scene');
  var audio = document.getElementById('song');
  var playing = false;
  play.addEventListener('touchstart', function() {
    console.log('touch', playing);
    // if (playing) return;
    playing = true;
    audio.play();
  }, false);
};
