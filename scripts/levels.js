'use strict';

/* global AFRAME */

AFRAME.registerComponent('levels', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;

    for (var i = 0; i < this.analyser.levels.length; i += 2) {
      var point = document.createElement('a-entity');
      point.setAttribute('position', {
        x: (i / 20) - (this.analyser.levels.length / 40),
        y: 0,
        z: -10
      });
      point.setAttribute('geometry', {
        primitive: 'box',
        width: 0.1,
        height: 0.1,
        depth: 0.1
      });
      point.setAttribute('material', {
        color: '#dddddd'
      });
      this.el.appendChild(point);
    }
  },

  tick: function() {
    var children = this.el.children;
    var total = this.analyser.levels.length;
    var qrt = total / 4;
    var hf = total / 2;
    for (var i = 0; i < this.analyser.levels.length; i += 2) {
      if (children[i / 2]) {
        children[i/2].setAttribute('material', {
          color: 'rgb(' + [
            Math.floor(i < hf ? 255 - Math.abs(qrt - i) / qrt * 255 : 0),
            Math.floor(i > qrt && i < 3 * qrt ? 255 - Math.abs(hf - i) / qrt * 255 : 0),
            Math.floor(i > hf ? 255 - Math.abs(qrt*3 - i) / qrt * 255 : 0)
          ].join(',') + ')'
        });
        children[i / 2].setAttribute('position', {
          x: (i / 20) - (this.analyser.levels.length / 40),
          y: this.analyser.levels[i] / 50,
          z: -10
        });
      }
    }
  }
});
