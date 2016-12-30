'use strict';

/* global AFRAME, ekko */

AFRAME.registerComponent('volume-light', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;
    this.volume = 0;

    this.el.appendChild(ekko.entity({
      light: {
        type: 'directional',
        intensity: this.volume
      },
      position: '-0.5 1 1'
    }));
    this.el.appendChild(ekko.entity({
      light: {
        type: 'ambient',
        intensity: 0.2
      }
    }));
  },

  tick: function() {

    // Update Light
    this.el.children[0].setAttribute('light', {
      type: 'directional',
      intensity: this.volume * 2
    });

    this.volume = Math.max(this.analyser.volume * 2, this.volume * 0.9);
  }
});
