'use strict';

var rust = require('rust'),
    _ = require('lodash'),
    Entity = require('aframe-react').Entity;

var SC = require('soundcloud');
SC.initialize({'client_id': 'QEEXQ0EStbSsHD3cv5giTD6j2tusWuHr'});

module.exports = rust.class({
  getInitialState: function() {
    return {
      playing: false,
      currentSrc: '',
      songs: []
    };
  },

  getFaves: function() {
    SC.get('/users/makyeezy/favorites').then(this.setList);
  },
  setList: function(songs) {
    this.setState({songs: songs.slice(0, 5)});
  },
  setSong: function(src) {
    this.setState({
      currentSrc: src + '?client_id=QEEXQ0EStbSsHD3cv5giTD6j2tusWuHr'
    });
    setTimeout(this.play, 100);
  },

  componentDidMount: function() {
    this.getFaves();
    this.setSong('https://api.soundcloud.com/tracks/294906859/stream');
  },

  play: function() {
    this.refs.song.play();
    this.setState({playing: true});
  },
  pause: function() {
    this.refs.song.pause();
    this.setState({playing: false});
  },

  render: function() {
    var ctx = this;

    return rust.o2([
      Entity,
      {
        position: '0 0.85 -1.5'
      },

      ['audio', {
        ref: 'song',
        id: 'song',
        // autoPlay: true,
        crossOrigin: true,
        src: this.state.currentSrc
      }],


      [Entity,
       {
         onClick: this.state.playing ? this.pause : this.play
       },

       [Entity, {
         position: '0.2 0.05 0',
         geometry: {
           primitive: 'plane',
           width: 0.6,
           height: 0.3
         },
         material: {
           shader: 'flat',
           color: '#dddddd'
         }
       }],
       [Entity, {
         position: '0 0 0.01',
         'bmfont-text': {
           text: this.state.playing ? 'pause' : 'play'
         }
       }]
      ],

      _.flatten([
        Entity,
        {position: '0 -0.65 0'},

        _.map(this.state.songs, function(s, i) {
          return [
            Entity,
            {
              position: '0 -' + i*0.8 + ' 0',
              onClick: function() {
                ctx.setSong(s['stream_url']);
              }
            },

            [Entity, {
              position: '2.5 0 0',
              geometry: {
                primitive: 'plane',
                width: 5.2,
                height: 0.7
              },
              material: {
                shader: 'flat',
                color: '#dddddd'
              }
            }],

            [Entity, {
              position: '0 0 0.01',
              'bmfont-text': {
                text: s.title
              }
            }],

            [Entity, {
              position: '0 -0.2 0.01',
              'bmfont-text': {
                text: s.user.username
              }
            }]
          ];
        })
      ])


    ]);
  }
});
