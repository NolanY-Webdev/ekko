'use strict';

/* global AFRAME */

var maxChildren = 100,
    ticksPerPoint = 3;

AFRAME.registerComponent('volume-graph', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
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
    if (this.count % ticksPerPoint > 0) return;

    // Max 20 points
    if (this.el.children.length > maxChildren) this.el.removeChild(this.el.children[0]);

    var totalVol = 0;
    for (var i = 0; i < this.analyser.levels.length; i += 50) {
      totalVol += this.analyser.levels[i];
    }
    var point = document.createElement('a-entity');
    var intensity = totalVol / 3000; // rough est of max
    point.setAttribute('geometry', {
      primitive: 'box',
      width: 0.2,
      height: intensity * 10,
      depth: 0.2
    });
    point.setAttribute('material', {
      color: 'rgb(' + [
        100 + Math.floor(intensity * 155),
        50,
        200 + Math.floor(intensity * 55)
      ].join(',') + ')'
    });
    point.setAttribute('position', {
      x: 0,
      y: totalVol / 600,
      z: 0
    });
    this.el.appendChild(point);

  }
});
