'use strict';

/* global AFRAME, THREE */

AFRAME.registerComponent('waveform', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'},
    radius: {default: 10},
    modifier: {default: 1},
    downScale: {default: 10}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;

    var MAX_POINTS = this.analyser.waveform.length / this.data.downScale;
    this.npoints = MAX_POINTS;

    // geometry
    var geometry = new THREE.BufferGeometry();

    // attributes
    var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    // material
    var material = new THREE.LineBasicMaterial({
      linewidth: 2
    });

    // Apply mesh.
    this.line = new THREE.Line(geometry, material);
    this.el.setObject3D('mesh', this.line);

    this.colorCycle = 0;

  },

  tick: function() {
    this.colorCycle = (this.colorCycle + 1) % 510;

    var positions = this.line.geometry.attributes.position.array;

    this.line.material.color = new THREE.Color('rgb(' + [
      Math.abs(510 - this.colorCycle),
      Math.abs(340 - this.colorCycle),
      Math.abs(170 - this.colorCycle)
    ].join(',') + ')');

    var index = 0;

    for (var i = 0; i < this.npoints; i++) {

      var angle = (i + 1) / this.npoints * Math.PI * 2;

      positions[index++] = this.data.radius * Math.cos(angle);
      positions[index++] = this.data.modifier * this.analyser.waveform[i] / 64;
      positions[index++] = this.data.radius * Math.sin(angle);
    }

    this.line.geometry.attributes.position.needsUpdate = true;

  }
});
