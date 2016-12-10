'use strict';

/* global AFRAME */

AFRAME.registerComponent('waveform', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;
    console.log('init waveform', this.analyser.waveform);
    for (var i = 0; i < this.analyser.waveform.length; i += 10) {
      var point = document.createElement('a-box');
      point.setAttribute('position', {
        x: i / 10,
        y: 0,
        z: 0
      });
      point.setAttribute('color', '#dddddd');
      point.setAttribute('width', '0.1');
      point.setAttribute('height', '0.1');
      point.setAttribute('depth', '0.1');
      this.el.appendChild(point);
    }
  },

  tick: function() {
    var children = this.el.children;
    for (var i = 0; i < this.analyser.waveform.length; i += 10) {
      if (children[i / 10]) {
        children[i / 10].setAttribute('position', {
          x: i / 100,
          y: this.analyser.waveform[i] / 256,
          z: 0
        });
      }
    }
  }
});
