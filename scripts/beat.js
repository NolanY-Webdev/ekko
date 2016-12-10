'use strict';

/* global AFRAME, ekko */

AFRAME.registerComponent('beat', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function() {

    var plane = ekko.entity({
      geometry: {
        primitive: 'plane',
        width: 15,
        height: 0.2
      },
      rotation: '-45 0 0',
      material: {
        shader: 'flat',
        color: 'black'
      }
    });
    this.plane = plane;
    this.el.appendChild(plane);

    this.analyser = this.data.analyserEl.components.audioanalyser;

    // var analyser = this.data.analyserEl.components.audioanalyser;
    // analyser.addEventListener('beat', function() {

    //   plane.setAttribute('material', {
    //     color: 'rgb(' + [
    //       Math.floor(Math.random() * 100),
    //       Math.floor(Math.random() * 100),
    //       Math.floor(Math.random() * 100)
    //     ].join(',') + ')'
    //   });
    // });

  },

  tick: function() {

    var intensity = Math.floor(Math.max(
      50, 255 - (Date.now() - this.analyser.lastBeat) / 4));

    this.plane.setAttribute('material', {
      color: 'rgb(' + [
        intensity,
        intensity,
        intensity
      ].join(',') + ')'
    });


  }
});
