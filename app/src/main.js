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
      position: '3 2 -4'
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
      height: 1,
      width: 2
    }],

    // Backside of logo
    ['a-plane', {
      rotation: '0 180 0'
    }, logoProps]
  ],

  [Entity, {
    id: 'analyser',
    audioanalyser: {
      src: '#song'
    }
  }],

  [Entity, {
    position: '-4 -1.5 0',
    rotation: '0 60 0',
    levels: {analyserEl: '#analyser'}
  }],

  [Entity, {
    position: '10 -2 -5',
    rotation: '0 -140 0',
    waveform: {analyserEl: '#analyser'}
  }],

  [Entity, {
    position: '-5 -1 4',
    rotation: '0 90 0',
    'volume-graph': {analyserEl: '#analyser'}
  }],

  // [Entity, {
  //   position: '0 0 0',
  //   'volume-light': {analyserEl: '#analyser'}
  // }],


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
