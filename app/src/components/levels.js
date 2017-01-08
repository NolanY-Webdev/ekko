'use strict';

/* global AFRAME */

function varyCol(v) {
  return Math.max(0, Math.min(255, Math.floor(Math.random() * 150 - 75 + v)));
}

AFRAME.registerComponent('levels', {
  dependencies: ['analyser'],

  schema: {
    analyserEl: {type: 'selector'},
    size: {default: 2},
    downScale: {default: 40}
  },

  init: function() {
    this.analyser = this.data.analyserEl.components.audioanalyser;

    this.max = this.analyser.levels.length;

    for (var i = 0; i < this.max; i += this.data.downScale) {
      for (var j = 1; j < this.max; j += this.data.downScale) {
        var point = document.createElement('a-entity');

        point.setAttribute('position', {
          x: (i - this.max / 2) / 15,
          y: 0,
          z: (j - this.max / 2) / 15
        });
        point.setAttribute('geometry', {
          primitive: 'box',
          width: 1,
          height: 0.1,
          depth: 1
        });

        point.setAttribute('material', {
          opacity: 0.95,
          color: 'rgb(' + [
            varyCol(0),
            varyCol(112),
            varyCol(255)
          ].join(',') + ')'
        });

        // var total = this.max;
        // var qrt = total / 4;
        // var hf = total / 2;
        // var p = (i + j) / 2;
        // point.setAttribute('material', {
        //   opacity: 0.85,
        //   color: 'rgb(' + [
        //     Math.floor(p < hf ? 255 - Math.abs(qrt - p) / qrt * 255 : 0),
        //     Math.floor(p > qrt && p < 3 * qrt
        //                ? 255 - Math.abs(hf - p) / qrt * 255
        //                : 0),
        //     Math.floor(p > hf ? 255 - Math.abs(qrt*3 - p) / qrt * 255 : 0)
        //   ].join(',') + ')'
        // });

        this.el.appendChild(point);
      }
    }
  },

  tick: function() {
    var children = this.el.children;

    for (var i = 0; i < this.max; i += this.data.downScale) {
      for (var j = 1; j < this.max; j += this.data.downScale) {
        var child = children[Math.floor(
          i * (this.max / this.data.downScale / this.data.downScale)
            + (j - 1) / this.data.downScale
        )];

        if (child) {
          var v = (this.analyser.levels[i] + this.analyser.levels[j]);
          child.setAttribute('scale', [
            1,
            v / 10,
            1
          ].join(' '));
          child.setAttribute('position', {
            y: v / 200
          });
        }

      }
    }
  }
});
