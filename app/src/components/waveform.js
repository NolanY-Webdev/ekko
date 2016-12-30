'use strict';

/* global AFRAME */

AFRAME.registerComponent('waveform', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'},
    modifier: {default: 1},
    downScale: {default: 10}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;

    for (var i = 0; i < this.analyser.waveform.length / this.data.downScale; i++) {
      var point = document.createElement('a-entity');
      point.setAttribute('geometry', {
        primitive: 'box',
        width: 0.1,
        height: 0.1,
        depth: 0.1
      });
      point.setAttribute('position', {
        x: i / 10,
        y: 0,
        z: 0
      });
      point.setAttribute('material', {
        color: '#dddddd'
      });
      this.el.appendChild(point);
    }
    this.colorCycle = 0;
  },

  tick: function() {
    this.colorCycle = (this.colorCycle + 1) % 510;

    var children = this.el.children;
    for (var i = 0; i < this.analyser.waveform.length / this.data.downScale; i++) {
      if (children[i]) {
        children[i].setAttribute('material', {
          color: 'rgb(' + [
            Math.abs(510 - this.colorCycle),
            Math.abs(340 - this.colorCycle),
            Math.abs(170 - this.colorCycle)
          ].join(',') + ')'
        });
        children[i].setAttribute('position', {
          x: i / 10,
          y: this.data.modifier * this.analyser.waveform[i] / 64,
          z: 0
        });
      }
    }
  }
});