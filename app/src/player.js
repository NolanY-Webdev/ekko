'use strict';

var rust = require('rust'),
    _ = require('lodash'),
    Entity = require('aframe-react').Entity,
    skipProps;

var SC = require('soundcloud');
SC.initialize({'client_id': 'QEEXQ0EStbSsHD3cv5giTD6j2tusWuHr'});

module.exports = rust.class({
  getInitialState: function() {
    return {
      playing: false,
      current: 0,
      scroll: 0,
      playlists: [],
      list: []
    };
  },
  componentDidMount: function() {
    this.getFaves();
    this.getPlaylists();
    // setTimeout(this.play, 100);
    var ctx = this;

    // mobile start
    var play = document.getElementById('scene');
    var started = false;
    play.addEventListener('touchstart', function() {
      if (started) return;
      started = true;
      ctx.play();
    }, false);

    this.refs.song.addEventListener('ended', function() {
      if (ctx.state.list[ctx.state.current + 1]) {
        ctx.setState({current: ctx.state.current + 1});
      }
    });
  },

  getFaves: function() {
    SC.get('/users/makyeezy/favorites').then(this.setList);
  },
  getPlaylists: function() {
    var ctx;
    SC.get('/users/makyeezy/playlists').then(function(pls) {
      console.log('pls', pls);
      ctx.setState({playlists: pls});
    });
  },
  setList: function(list) {
    this.setState({
      list: list,
      scroll: 0
    });
  },
  clickItem: function(index) { // hack to fix click rebinding problem
    this.setCurrent(index + this.state.scroll);
  },
  setCurrent: function(index) {
    this.setState({current: index});
    setTimeout(this.play, 100);
  },

  nextPage: function() {
    this.setState({
      scroll: Math.min(this.state.scroll + 5, this.state.list.length - 5)
    });
  },
  previousPage: function() {
    this.setState({scroll: Math.max(this.state.scroll - 5, 0)});
  },

  nextSong: function() {
    this.setState({
      current: Math.min(this.state.list.length, this.state.current + 1)
    });
  },
  lastSong: function() {
    this.setState({current: Math.max(0, this.state.current - 1)});
  },

  play: function() {
    this.refs.song.play();
    this.setState({playing: true});
  },
  pause: function() {
    this.refs.song.pause();
    this.setState({playing: false});
  },
  toggle: function() {
    this.state.playing ? this.pause() : this.play();
  },

  render: function() {
    var ctx = this;
    var song = this.state.list[this.state.current] || {};

    return rust.o2([
      Entity,
      {
        // 'look-at': '[camera]',
        rotation: '0 -20 0',
        position: '0.75 1 -5'
      },

      ['audio', {
        ref: 'song',
        id: 'song',
        // autoPlay: true,
        crossOrigin: true,
        src: song['stream_url'] + '?client_id=QEEXQ0EStbSsHD3cv5giTD6j2tusWuHr'
      }],

      [Entity,
       {position: '0.2 0.2 0'},

       [Entity, {
         position: '-0.5 0 0',
         rotation: '0 0 180',
         onClick: this.lastSong
       }, skipProps = {
         geometry: {
           primitive: 'plane',
           width: 0.3,
           height: 0.3
         },
         material: {
           src: 'forward.png',
           opacity: 0.9,
           shader: 'flat',
           color: '#dddddd'
         },
         clickable: ''
       }],

       [Entity, {
         geometry: {
           primitive: 'plane',
           width: 0.6,
           height: 0.6
         },
         material: {
           src: this.state.playing ? 'pause.png' : 'play.png',
           opacity: 0.9,
           shader: 'flat',
           color: '#dddddd'
         },
         clickable: '',
         onClick: this.toggle
       }],

       [Entity, {
         position: '0.5 0 0',
         onClick: this.nextSong
       }, skipProps]
      ],

      [Entity, {
        position: '-1.2 -1 0',
        geometry: {
          primitive: 'plane',
          width: 0.3,
          height: 0.6
        },
        material: {
          src: 'move.png',
          opacity: 0.9,
          shader: 'flat',
          color: '#dddddd'
        },
        clickable: '',
        onClick: this.previousPage
      }],

      [Entity, {
        position: '-1.2 -3 0',
        rotation: '0 0 180',
        geometry: {
          primitive: 'plane',
          width: 0.3,
          height: 0.6
        },
        material: {
          src: 'move.png',
          opacity: 0.9,
          shader: 'flat',
          color: '#dddddd'
        },
        clickable: '',
        onClick: this.nextPage
      }],

      _.flatten([
        Entity,
        {position: '0 -0.65 0'},

        _.map(this.state.list.slice(this.state.scroll, this.state.scroll + 5),
              function(s, ind) {

                var i = ctx.state.scroll + ind;
                return [
                  Entity,
                  {
                    position: '0 -' + ind*0.8 + ' 0',
                    clickable: '',
                    onClick: function() {
                      ctx.clickItem(i);
                    }
                  },

                  s['artwork_url'] ? [Entity, {
                    position: '-0.5 0 0',
                    geometry: {
                      primitive: 'plane',
                      width: 0.65,
                      height: 0.65
                    },
                    material: {
                      shader: 'flat',
                      src: s['artwork_url']
                    }
                  }] : null,

                  [Entity, {
                    position: '0 0 -0.01',
                    'bmfont-text': {
                      color: i === ctx.state.current ? '#ff007f' : '#fff',
                      text: s.title
                    }
                  }],

                  [Entity, {
                    position: '0 -0.2 0.01',
                    'bmfont-text': {
                      color: i === ctx.state.current ? '#ff007f' : '#fff',
                      text: s.user.username
                    }
                  }],

                  [Entity, {
                    position: '2.5 0 0',
                    geometry: {
                      primitive: 'plane',
                      width: 5.2,
                      height: 0.7
                    },
                    material: {
                      opacity: 0.1,
                      shader: 'flat',
                      color: '#dddddd'
                    }
                  }]
                ];
              })
      ]),

      [Entity, {
        position: '3 -4.5 0',
        'bmfont-text': {
          text: 'makyeezy\'s likes',
          color: '#fff'
        }
      }]


    ]);
  }
});
