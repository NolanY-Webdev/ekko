'use strict';

/* global AFRAME, _ */

var beatDetector = require('audio/beat-detector');

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

function fetchAudio(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';

  source = audioCtx.createBufferSource();

  xhr.onload = function() {
    audioCtx.decodeAudioData(xhr.response, function(buffer) {
      source.buffer = buffer;
    });
  };

  xhr.send();
}

AFRAME.registerComponent('audioanalyser', {
  schema: {
    src: {type: 'selector'}
  },

  init: function() {
    if (this.data.src) {
      var audioEl = this.data.src;
      var src = audioCtx.createMediaElementSource(audioEl);
      connectSource(src);

      var ctx = this;
      beatDetector(audioEl, function() {
        ctx.el.emit('beat');
      });

      // mobile start
      document.body.addEventListener('touchstart', function() {
        setTimeout(function() {
          connectSource(src);
        }, 100);
      }, false);

      analyser.connect(audioCtx.destination);
    } else if (this.data.url) {
      fetchAudio(this.data.url);
      source.connect(analyser);
    } else {
      listenToMic();
    }
    this.analyser = analyser;
    this.levels = new Uint8Array(analyser.frequencyBinCount);
    this.waveform = new Uint8Array(analyser.fftSize);
    this.volume = 0;

  },

  tick: function() {
    if (!source) return;
    analyser.getByteFrequencyData(this.levels);
    analyser.getByteTimeDomainData(this.waveform);

    var sum = 0;
    for (var i = 0; i < this.levels.length; i += 50) {
      sum += this.levels[i];
    }
    this.volume = sum / 3000; // rough est of %
  }
});

function mode(items) {
  var lead = null;
  var max = 0;
  var counts = {};
  for (var i = 0; i < items.length; i++) {
    counts[items[i]] = (counts[items[i]] || 0) + 1;
    if (counts[items[i]] > max) {
      max = counts[items[i]];
      lead = items[i];
    }
  }
  return lead;
}
