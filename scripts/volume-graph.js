'use strict';

/* global AFRAME, ekko */

AFRAME.registerComponent('volume-graph', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'},
    maxChildren: {default: 50},
    ticksPerPoint: {default: 3},
    rbase: {default: 100},
    rscale: {default: 155},
    gbase: {default: 50},
    gscale: {default: 0},
    bbase: {default: 200},
    bscale: {default: 55}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;
    this.count = 0;
  },

  tick: function() {

    // Shift
    for (var c = 0; c < this.el.children.length; c++) {
      var child = this.el.children[c];
      var position = child.getComputedAttribute('position');
      if (position) {
        child.setAttribute('position', {
          x: position.x + 0.1,
          y: position.y,
          z: position.z
        });
      }
    }

    // Add new point every ticksPerPoint ticks
    this.count++;
    if (this.count % this.data.ticksPerPoint > 0) return;

    // Max maxChildren points
    if (this.el.children.length > this.data.maxChildren) this.el.removeChild(this.el.children[0]);

    var intensity = this.analyser.volume;
    var point = ekko.entity({
      geometry: {
        primitive: 'box',
        width: 0.2,
        height: intensity * 10,
        depth: 0.2
      },
      material: {
        color: 'rgb(' + [
          this.data.rbase + Math.floor(intensity * this.data.rscale),
          this.data.gbase + Math.floor(intensity * this.data.gscale),
          this.data.bbase + Math.floor(intensity * this.data.bscale)
        ].join(',') + ')'
      },
      position: {
        x: 0,
        y: intensity * 5,
        z: 0
      }
    });
    this.el.appendChild(point);

  }
});
