'use strict';

/* global AFRAME */

var downScale = 3;

AFRAME.registerComponent('levels', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;

    for (var i = 0; i < this.analyser.levels.length; i += downScale) {
      var point = document.createElement('a-entity');
      point.setAttribute('position', {
        x: i / (10 * downScale),
        y: 0,
        z: 0
      });
      point.setAttribute('geometry', {
        primitive: 'box',
        width: 0.1,
        height: 0.1,
        depth: 0.1
      });

      var total = this.analyser.levels.length;
      var qrt = total / 4;
      var hf = total / 2;
      point.setAttribute('material', {
        color: 'rgb(' + [
          Math.floor(i < hf ? 255 - Math.abs(qrt - i) / qrt * 255 : 0),
          Math.floor(i > qrt && i < 3 * qrt ? 255 - Math.abs(hf - i) / qrt * 255 : 0),
          Math.floor(i > hf ? 255 - Math.abs(qrt*3 - i) / qrt * 255 : 0)
        ].join(',') + ')'
      });

      this.el.appendChild(point);
    }
  },

  tick: function() {
    var children = this.el.children;
    for (var i = 0; i < this.analyser.levels.length; i += downScale) {
      if (children[i / downScale]) {
        children[i / downScale].setAttribute('position', {
          x: i / (10 * downScale),
          y: this.analyser.levels[i] / 50,
          z: 0
        });
      }
    }
  }
});
