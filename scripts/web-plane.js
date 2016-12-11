'use strict';

/* global AFRAME, THREE */

AFRAME.registerComponent('web-plane', {
  schema: {
    webEl: {type: 'selector'}
  },

  init: function() {
    var material = new THREE.MeshBasicMaterial({wireframe: true});
    var geometry = new THREE.PlaneGeometry();
    var planeMesh= new THREE.Mesh(geometry, material);

    this.el.setObject3D('web-el-plane', planeMesh);

    var cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = 0;
    cssRenderer.domElement.style.zIndex = -1;
    document.body.appendChild(cssRenderer.domElement);

    this.cssRenderer = cssRenderer;

    this.cssScene = new THREE.Scene();

    var element = this.data.webEl;

    var cssObject = new THREE.CSS3DObject(element);

    var pos = planeMesh.parent.position;
    var rot = planeMesh.parent.rotation;
    planeMesh.position.set(pos.x, pos.y, pos.z);
    planeMesh.rotation.set(rot.x, rot.y, rot.z);
    cssObject.position.set(pos.x, pos.y, pos.z);
    cssObject.rotation.set(rot.x, rot.y, rot.z);

    this.cssScene.add(cssObject);

  },

  tick: function() {
    this.cssRenderer.render(this.cssScene, this.el.sceneEl.camera);
  }
});
