'use strict';

/* global AFRAME */

// Audio Nodes
var source,
    audioCtx = window.AudioContext
      ? new window.AudioContext()
      : new window.webkitAudioContext(),
    analyser = audioCtx.createAnalyser();

function connectSource(audioStream) {
  source = audioStream;
  source.connect(analyser);
}

function listenToMic() {
  // Media Getter
  navigator.getUserMedia = (
    navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia
  );

  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: true}, function(stream) {
      connectSource(audioCtx.createMediaStreamSource(stream));
    }, function(err) {
      console.log('getUserMedia Error: ' + err);
    });
  } else {
    alert('No Audio Source.');
  }
}

AFRAME.registerComponent('audioanalyser', {
  init: function() {
    if (this.data.src) {
      alert(this.data.src);
      connectSource(this.data.src);
    } else {
      listenToMic();
    }
    this.analyser = analyser;
    this.levels = new Uint8Array(analyser.frequencyBinCount);
    this.waveform = new Uint8Array(analyser.fftSize);
  },

  tick: function() {
    if (!source) return;
    analyser.getByteFrequencyData(this.levels);
    analyser.getByteTimeDomainData(this.waveform);
  }
});
