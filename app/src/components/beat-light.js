'use strict';

/* global AFRAME */

function randVal() {
  return Math.random();
}

AFRAME.registerComponent('beat-light', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function() {
    var light = this.el.components.light.light;
    function change() {
      light.color.setRGB(randVal(), randVal(), randVal());
    }
    var timedCatch = setInterval(change, 2000);
    this.data.analyserEl.addEventListener('beat', function() {
      clearInterval(timedCatch);
      change();
      timedCatch = setInterval(change, 2000);
    });
  }
});
