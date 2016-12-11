'use strict';

/* global AFRAME, ekko */

AFRAME.registerComponent('volume-graph', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'},
    maxChildren: {default: 50},
    ticksPerPoint: {default: 3}
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
      child.setAttribute('position', {
        x: position.x + 0.1,
        y: position.y,
        z: position.z
      });
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
          100 + Math.floor(intensity * 155),
          50,
          200 + Math.floor(intensity * 55)
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
