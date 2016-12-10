'use strict';

/* global AFRAME */

var downScale = 10;

AFRAME.registerComponent('waveform', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;

    console.log('length', this.analyser.waveform.length);

    for (var i = 0; i < this.analyser.waveform.length / downScale; i += 10) {
      var point = document.createElement('a-entity');
      point.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.1
        // height: 0.1,
        // depth: 0.1
      });
      point.setAttribute('position', {
        x: i / 25,
        y: 0,
        z: 0
      });
      point.setAttribute('material', {
        color: '#dddddd'
      });
      this.el.appendChild(point);
    }
  },

  tick: function() {
    var children = this.el.children;
    for (var i = 0; i < this.analyser.waveform.length / downScale; i += 10) {
      if (children[i / 10]) {
        children[i / 10].setAttribute('position', {
          x: i / 25,
          y: this.analyser.waveform[i] / 64,
          z: 0
        });
      }
    }
  }
});
