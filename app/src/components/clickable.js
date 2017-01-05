'use strict';

/* global AFRAME */

AFRAME.registerComponent('update-raycaster', {
  dependencies: ['raycaster'],

  init: function() {
    var entity = this.el;

    setInterval(function() {
      entity.components.raycaster.refreshObjects();
    }, 1000);
  }
});

AFRAME.registerComponent('clicker', {
  init: function() {
    var entity = this.el;

    this.el.addEventListener('mouseenter', function() {
      entity.setAttribute('material', 'color', 'green');
    });

    this.el.addEventListener('mouseleave', function() {
      entity.setAttribute('material', 'color', '#888888');
    });
  }
});

AFRAME.registerComponent('clickable', {
  init: function() {
    this.el.classList.add('clickable');
    var entity = this.el;

    this.el.addEventListener('mouseenter', function() {
      entity.setAttribute('scale', '1.1 1.1 1');
    });

    this.el.addEventListener('mouseleave', function() {
      entity.setAttribute('scale', '1 1 1');
    });

  }
});
