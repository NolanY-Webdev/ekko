'use strict';

/* global _ */

var ekko = {
  entity: function(props) {
    var ent = document.createElement('a-entity');
    _.map(props, function(v, k) {
      ent.setAttribute(k, v);
    });
    return ent;
  }
};

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

// Visualization targets
// var canvas = document.getElementById('visualizer');
// var canvasCtx = canvas.getContext('2d');

// var WIDTH = window.innerWidth,
//     HEIGHT = window.innerHeight;
// canvas.setAttribute('width', WIDTH);
// canvas.setAttribute('height', HEIGHT);

// function visualize() {
//   requestAnimationFrame(visualize);
//   analyser.fftSize = 256;
//   var bufferLength = analyser.frequencyBinCount;
//   var dataArray = new Uint8Array(bufferLength);

//   analyser.getByteFrequencyData(dataArray);

//   canvasCtx.fillStyle = 'rgb(0, 0, 0)';
//   canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

//   var barWidth = (WIDTH / bufferLength) * 2.5;
//   var barHeight;
//   var x = 0;

//   for (var i = 0; i < bufferLength; i++) {
//     barHeight = dataArray[i];

//     canvasCtx.fillStyle = 'rgb(' + [
//       (barHeight+100),
//       (barHeight+100),
//       (barHeight+100)
//     ].join(',') + ')';
//     canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

//     x += barWidth + 1;
//   }
// }