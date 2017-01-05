'use strict';

var rust = require('rust'),
    aframe = require('aframe-react'),
    Scene = aframe.Scene,
    Entity = aframe.Entity,
    Player = require('player'),
    logoProps;

require('components/analyser');
require('components/levels');
require('components/waveform');
require('components/volume-graph');
require('components/volume-light');
require('aframe-bmfont-text-component');
require('components/clickable');

module.exports = rust.o2([
  Scene,
  {antialias: true},

  [Entity,
   {primitive: 'a-assets'},
   ['img', {
     id: 'logo',
     src: 'images/ekko.png'
   }]
  ],

  [Player],

  [
    Entity,
    {
      position: '-5 8 -15'
    },

    ['a-animation', {
      attribute: 'rotation',
      dur: '10000',
      repeat: 'indefinite',
      to: '0 360 0',
      easing: 'linear'
    }],

    ['a-plane', logoProps = {
      src: '#logo',
      opacity: '0.99',
      height: 3,
      width: 6
    }],

    // Backside of logo
    ['a-plane', {
      rotation: '0 180 0'
    }, logoProps]
  ],

  [Entity, {
    id: 'analyser',
    audioanalyser: {
      // src: '#song'
    }
  }],

  [Entity, {
    position: '0 0 -10',
    levels: {analyserEl: '#analyser'}
  }],

  [Entity, {
    position: '-4 0 -14',
    waveform: {analyserEl: '#analyser'}
  }],

  [Entity, {
    position: '-8 0 -18',
    'volume-graph': {analyserEl: '#analyser'}
  }],

  [Entity, {
    position: '0 0 0',
    'volume-light': {analyserEl: '#analyser'}
  }],


  ['a-sky', {color: '#222222'}],
  // ['a-sky', {src: '#bg'}]

  [
    Entity,
    {
      // position: '-3.8 1.6 -3.7',
      // rotation: '1.5 -19.6 0'
      camera: true,
      'wasd-controls': '',
      'look-controls': ''
    },

    // ['a-cursor', {
    //   color: '#888888',
    //   'update-raycaster': '',
    //   raycaster: 'objects: .clickable'
    //   'event-set__1': 'name: mouseenter; color: green;',
    //   'event-set__2': 'name: mouseleave; color: #888888;'
    // }]

    // ['a-animation', {
    //   begin: 'mouseenter',
    //   attribute: 'material.color',
    //   fill: 'forwards',
    //   easing: 'ease-in',
    //   from: '#888888',
    //   to: 'green',
    //   dur: 300,
    //   repeat: 0
    // }]

    [Entity, {
      position: '0 0 -1', // always in front of camera
      geometry: {
        primitive: 'ring',
        radiusInner: 0.0085,
        radiusOuter: 0.015
      },
      material: {
        opacity: 0.5,
        color: '#888888',
        shader: 'flat'
      },
      raycaster: {
        objects: '.clickable'
      },
      'update-raycaster': '',
      clicker: '',
      cursor: {}
    }]

  ]

]);
