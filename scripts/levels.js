'use strict';

/* global AFRAME */

AFRAME.registerComponent('levels', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;

    for (var i = 0; i < this.analyser.levels.length; i++) {
      var point = document.createElement('a-box');
      point.setAttribute('position', {
        x: (i / 10) - (this.analyser.levels.length / 20),
        y: 0,
        z: -10
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
    for (var i = 0; i < this.analyser.levels.length; i++) {
      if (children[i]) {
        children[i].setAttribute('position', {
          x: (i / 10) - (this.analyser.levels.length / 20),
          y: this.analyser.levels[i] / 50,
          z: -10
        });
      }
    }
  }
});
