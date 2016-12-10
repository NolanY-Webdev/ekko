'use strict';

/* global AFRAME, ekko, _ */

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

AFRAME.registerComponent('beat', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;
    this.threshold = 0;
    this.lastBeat = Date.now();

    var plane = ekko.entity({
      geometry: {
        primitive: 'circle',
        radius: 10
      },
      rotation: '-90 0 0',
      material: {
        color: 'black'
      }
    });
    this.plane = plane;
    this.el.appendChild(plane);

    this.bpms = [];
    this.last = Date.now();
    this.guess = 60;
  },

  tick: function() {

    // Predict beat based on guess and last beat
    if (Date.now() - this.lastBeat > 60000 / this.guess - 10) {
      this.plane.setAttribute('material', {
        color: 'rgb(' + [
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100)
        ].join(',') + ')'
      });
      this.lastBeat = Date.now();
    }

    var cur = this.analyser.volume;

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
      console.log('g', this.guess, 'from', groups);

      if (Math.abs(bpm - averageModeBpm) < 10) {
        // if haven't recently updated update
        if (Date.now() - this.lastBeat > 60000 / this.guess / 2) {
          this.plane.setAttribute('material', {
            color: 'rgb(' + [
              Math.floor(Math.random() * 100),
              Math.floor(Math.random() * 100),
              Math.floor(Math.random() * 100)
            ].join(',') + ')'
          });
        }
        this.lastBeat = d; // reset downbeat
      }

      this.threshold = cur * 1.5;
    } else {
      this.threshold = this.threshold * 0.99;
    }

  }
});
