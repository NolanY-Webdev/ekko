'use strict';

/* global AFRAME, _ */

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
      var src = this.data.src;
      connectSource(audioCtx.createMediaElementSource(src));

      // mobile start
      document.body.addEventListener('touchstart', function() {
        setTimeout(function() {
          connectSource(audioCtx.createMediaElementSource(src));
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

    // beat detection vars
    this.threshold = 0;
    this.lastBeat = Date.now();
    this.bpms = [];
    this.last = Date.now();
    this.guess = 60;
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


    // Beat detection
    if (Date.now() - this.lastBeat > 60000 / this.guess - 10) {
      this.el.emit('beat');
      this.lastBeat = Date.now();
    }

    var cur = this.analyser;

    if (cur > this.threshold && cur > 0.2) {

      var d = Date.now();
      var interval = d - this.last;
      this.last = d;
      var bpm = 60000 / interval;
      this.bpms.push(bpm);
      var groups = [];
      _.map(this.bpms, function(b) {
        groups.push(Math.floor((b + 5) / 10) * 10);
      });
      var bpmMode = mode(groups);

      var averageModeBpm = 0;
      var samples = 0;
      for (var b = 0; b < groups.length; b++) {
        if (groups[b] === bpmMode) {
          samples++;
          averageModeBpm += (this.bpms[b] - averageModeBpm) / samples;
        }
      }
      this.guess = averageModeBpm;

      if (Math.abs(bpm - averageModeBpm) < 10) {
        if (Date.now() - this.lastBeat > 60000 / this.guess / 2) {
          this.el.emit('beat');
        }
        this.lastBeat = d; // reset downbeat
      }

      this.threshold = cur * 1.5;
    } else {
      this.threshold = this.threshold * 0.99;
    }
    // End Beat Detection

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
