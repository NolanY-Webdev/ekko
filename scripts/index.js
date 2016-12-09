'use strict';

// Media Getter
navigator.getUserMedia = (
  navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia
);

// Audio Nodes
var audioCtx = window.AudioContext
      ? new window.AudioContext()
      : new window.webkitAudioContext(),
    analyser = audioCtx.createAnalyser(),
    gainNode = audioCtx.createGain();

function connectSource(source) {
  source.connect(analyser);
  // analyser.connect(gainNode);
  // gainNode.connect(audioCtx.destination);
  visualize();
}

// Audio Source
if (navigator.getUserMedia) {
  navigator.getUserMedia({audio: true}, function(stream) {
    connectSource(audioCtx.createMediaStreamSource(stream));
  }, function(err) {
    console.log('getUserMedia Error: ' + err);
  });
} else {
  alert('No Audio Source.');
}

// Visualization targets
var canvas = document.getElementById('visualizer');
var canvasCtx = canvas.getContext('2d');

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
canvas.setAttribute('width', WIDTH);
canvas.setAttribute('height', HEIGHT);

function visualize() {
  requestAnimationFrame(visualize);
  analyser.fftSize = 256;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    canvasCtx.fillStyle = 'rgb(' + [
      (barHeight+100),
      (barHeight+100),
      (barHeight+100)
    ].join(',') + ')';
    canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

    x += barWidth + 1;
  }
}
