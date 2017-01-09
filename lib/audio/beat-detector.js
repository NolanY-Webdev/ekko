'use strict';

// Beat detection taken from https://github.com/JMPerez/beats-audio-api

var OfflineContext = window.OfflineAudioContext
      || window.webkitOfflineAudioContext;

function fetchAudio(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function() {
    cb(xhr.response);
  };

  xhr.send();
}

module.exports = function beatDetector(audioEl, cb) {

  var beating = false;
  var beat = {
    position: 0,
    tempo: 120
  };

  var beatTimer;
  function startBeat() {
    beating = true;
    clearInterval(beatTimer);
    beatTimer = setInterval(function() {
      if (!beating || audioEl.paused) clearInterval(beatTimer);
      cb();
    }, beat.duration * 1000);
  }


  audioEl.addEventListener('pause', function() {
    beating = false;
  });

  audioEl.addEventListener('play', function() {
    beating = false;

    var offlineCtx = new OfflineContext(2, 30 * 44100, 44100);

    fetchAudio(audioEl.src, function(audioData) {

      offlineCtx.decodeAudioData(audioData, function(buffer) {

        var source = offlineCtx.createBufferSource();
        source.buffer = buffer;

        var lowpass = offlineCtx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 150;
        lowpass.Q.value = 1;

        var highpass = offlineCtx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 100;
        highpass.Q.value = 1;

        source.connect(lowpass);
        lowpass.connect(highpass);
        highpass.connect(offlineCtx.destination);
        source.start(0);

        offlineCtx.oncomplete = function(e) {
          var buffer = e.renderedBuffer;

          var peaks = getPeaks([
            buffer.getChannelData(0),
            buffer.getChannelData(1)
          ]);
          var groups = getIntervals(peaks);

          var top = groups.sort(function(intA, intB) {
            return intB.count - intA.count;
          })[0];

          beat = top;
          setTimeout(
            startBeat,
            (beat.duration - (
              (audioEl.currentTime - beat.position) % beat.duration
            )) * 1000
          );
        };

        offlineCtx.startRendering();
      });
    });
  });

};


function getPeaks(data) {

  var partSize = 22050, // 0.5 sec sample
      parts = data[0].length / partSize,
      peaks = [];

  for (var i = 0; i < parts; i++) {
    var max = 0;
    for (var j = i * partSize; j < (i + 1) * partSize; j++) {
      var volume = Math.max(Math.abs(data[0][j]), Math.abs(data[1][j]));
      if (!max || (volume > max.volume)) {
        max = {
          position: j,
          volume: volume
        };
      }
    }
    peaks.push(max);
  }

  peaks.sort(function(a, b) {
    return b.volume - a.volume;
  });

  peaks = peaks.splice(0, peaks.length * 0.5);

  peaks.sort(function(a, b) {
    return a.position - b.position;
  });

  return peaks;
}

function getIntervals(peaks) {
  var groups = [];

  peaks.forEach(function(peak, index) {
    for (var i = 1; (index + i) < peaks.length && i < 10; i++) {
      var group = {
        tempo: (60 * 44100) / (peaks[index + i].position - peak.position),
        count: 1
      };

      while (group.tempo < 90) {
        group.tempo *= 2;
      }

      while (group.tempo > 180) {
        group.tempo /= 2;
      }

      group.tempo = Math.round(group.tempo);

      if (!(groups.some(function(interval) {
        return (interval.tempo === group.tempo ? interval.count++ : 0);
      }))) {
        group.duration = 60 / group.tempo;
        group.position = (peak.position / 44100) % group.duration;
        groups.push(group);
      }
    }
  });
  return groups;
}
