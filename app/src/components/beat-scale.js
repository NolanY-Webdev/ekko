'use strict';

/* global AFRAME */

AFRAME.registerComponent('beat-scale', {
  dependencies: ['analyser'],

  schema: {
    x: {default: 0},
    y: {default: 0},
    z: {default: 0},
    analyserEl: {type: 'selector'}
  },

  init: function() {
    var ctx = this;
    this.data.analyserEl.addEventListener('beat', function() {
      ctx.scale = 1;
    });
  },

  tick: function() {
    this.el.setAttribute('scale', [
      1 + this.data.x * this.scale,
      1 + this.data.y * this.scale,
      1 + this.data.z * this.scale
    ].join(' '));

    this.scale *= 0.8;

  }
});
