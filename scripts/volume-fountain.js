'use strict';

/* global AFRAME, ekko */

AFRAME.registerComponent('volume-fountain', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'},
    maxChildren: {default: 50},
    ticksPerPoint: {default: 1},
    size: {default: 0.05}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;
    this.count = 0;
    this.vols = Array(this.data.maxChildren);
    this.vols.fill(0);

    for (var i = 0; i < this.vols.length; i++ ) {
      this.el.appendChild(ekko.entity({
        geometry: {
          primitive: 'torus',
          radius: this.data.size * i + 0.001,
          radiusTubular: this.data.size / 4
        },
        rotation: '-90 0 0',
        material: {
          color: 'white'
        }
      }));
    }
  },

  tick: function() {

    // Shift
    this.vols.pop();
    this.vols.unshift(this.analyser.volume);

    // Render
    for (var c = 0; c < this.vols.length; c++) {
      var ring = this.el.children[c];

      var intensity = this.vols[c] * (1 - (c / 1.5) / this.vols.length);
      ring.setAttribute('scale', '1 1 ' + intensity * 30);
      ring.setAttribute('material', {
        shader: 'flat',
        color: 'rgb(' + [
          50 + Math.floor(intensity * 205),
          50 + Math.floor(intensity * 155),
          50 + Math.floor(intensity * 155)
        ].join(',') + ')'
      });
    }

  }
});
