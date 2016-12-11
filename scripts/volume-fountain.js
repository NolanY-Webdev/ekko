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
      // this.el.appendChild(ekko.entity({
      //   geometry: {
      //     primitive: 'cylinder',
      //     openEnded: true,
      //     radius: 0.05 * i,
      //     height: 0.1
      //   },
      //   material: {
      //     color: 'white'
      //   }
      // }));
      this.el.appendChild(ekko.entity({
        geometry: {
          primitive: 'ring',
          radiusInner: this.data.size * i + 0.0001,
          radiusOuter: this.data.size * (i + 1)
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
      // var cyl = this.el.children[c * 2];
      // cyl.setAttribute('scale', {
      //   x: 1,
      //   y: Math.max(1, this.vols[c] * 10),
      //   z: 1
      // });
      var ring = this.el.children[c];
      ring.setAttribute('position', {
        x: 0,
        y: Math.max(1, this.vols[c] * 3) - 1,
        z: 0
      });
      ring.setAttribute('material', {
        color: 'rgb(' + [
          100 + Math.floor(this.vols[c] * 155),
          200 + Math.floor(this.vols[c] * 55),
          50
        ].join(',') + ')'
      });
    }

    // // Shift
    // for (var c = 0; c < this.el.children.length; c++) {
    //   var child = this.el.children[c];
    //   var geometry = child.getComputedAttribute('geometry');
    //   child.setAttribute('geometry', {
    //     primitive: 'cylinder',
    //     openEnded: true,
    //     radius: geometry.radius + 0.02,
    //     height: geometry.height
    //   });
    // }

    // // Add new point every ticksPerPoint ticks
    // this.count++;
    // if (this.count % this.data.ticksPerPoint > 0) return;

    // // Max maxChildren points
    // if (this.el.children.length > this.data.maxChildren) {
    //   this.el.removeChild(this.el.children[0]);
    // }

    // var intensity = this.analyser.volume;
    // var point = ekko.entity({
    //   geometry: {
    //     primitive: 'cylinder',
    //     openEnded: true,
    //     radius: 0.1,
    //     height: intensity * 5
    //   },
    //   material: {
    //     shader: 'flat',
    //     color: 'rgb(' + [
    //       100 + Math.floor(intensity * 155),
    //       50,
    //       200 + Math.floor(intensity * 55)
    //     ].join(',') + ')'
    //   }
    // });
    // this.el.appendChild(point);

  }
});
