'use strict';

// Doesn't work in fullscreen

// Dependency <script src="https://rawgit.com/mrdoob/three.js/master/examples/js/renderers/CSS3DRenderer.js"></script>


/* global AFRAME, THREE */

AFRAME.registerComponent('web-plane', {
  schema: {
    webEl: {type: 'selector'}
  },

  init: function() {
    var element = this.data.webEl;

    window.el = element;

    // Plane mesh creates "window" to CSS Renderer
    var material   = new THREE.MeshBasicMaterial();
    material.color.set('black');
    material.opacity = 0;
    material.blending  = THREE.NoBlending;
    var geometry = new THREE.PlaneGeometry(
      element.offsetWidth,
      element.offsetHeight
    );
    var planeMesh= new THREE.Mesh(geometry, material);

    this.el.setObject3D('web-el-plane', planeMesh);


    // CSS Renderer renders separate 3d context behind aframe context
    var cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = 0;
    cssRenderer.domElement.style.zIndex = -1;
    this.el.sceneEl.appendChild(cssRenderer.domElement);
    this.cssRenderer = cssRenderer;

    this.cssScene = new THREE.Scene();

    var cssObject = new THREE.CSS3DObject(element);
    this.cssScene.add(cssObject);


    // Match up locations
    var pos = planeMesh.parent.position;
    var rot = planeMesh.parent.rotation;
    planeMesh.position.set(pos.x, pos.y, pos.z);
    planeMesh.rotation.set(rot.x, rot.y, rot.z);
    cssObject.position.set(pos.x, pos.y, pos.z);
    cssObject.rotation.set(rot.x, rot.y, rot.z);


  },

  tick: function() {
    // Line up rendering
    this.cssRenderer.render(this.cssScene, this.el.sceneEl.camera);
  }
});
