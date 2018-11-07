import React from 'react'
import { Howl } from 'howler'
import raf from 'raf' // requestAnimationFrame polyfill
import { throttle, difference, findIndex, pull } from 'lodash';
import { setDebug, propTypes, defaultProps } from 'proptypes-helper';
import Cassette from 'cassette-tape';

import { PlayerUI } from './playerUI';
setDebug(true);

function callHowler(howl, method, ...args) {
  if (howl && howl._sounds) {
    return howl[method](...args);
  }
}

/*
 * Has three howlers for current/prev/next.
 * play/pause current howler.
 * has a player UI component
 */
class FullControl extends React.Component {
  constructor (props) {
    super(props)
    this.howlers = [];

    this.state = {
      seek: 0,
      position: 0,
      playStates: [],
      loadStates: [],
      durations: [],
      playing: false,
      loaded: false,
      loop: false,
      mute: false,
      volume: 1.0
    }
    this.initHowlers();
  }

  componentWillUnmount = () => {
    this.clearRAF()
  };

  handleRewind = (rewind) => {
    const { playing } = this.state;
    if (rewind) {
      this.setState({ rewind, ff: false });
      if (!playing) {
        console.log('rew 6');
        this.rew(6);
      }
    } else if (playing) {
      this.setState({ rewind });
    }
  };

  rew = (num) => {
    const newSeek = Number(this.state.seek || 0) - Number(num || 0);
    this.setState({ seek: newSeek >= 0 ? newSeek : 0 });
  };

  ff = (num) => {
    const newSeek = Number(this.state.seek || 0) + Number(num || 0);
    this.setState({ seek: newSeek });
  };

  handleFastForward = (ff) => {
    const { playing } = this.state;
    if (ff) {
      this.setState({ ff, rewind: false });
      if (!playing) {
        console.log('ff 6');
        this.ff(6);
      }
    } else if (playing) {
      this.setState({ ff });
    }
  };

  handleToggle = (pause) => {
    const { playing, pausing } = this.state;
    if (pause) {
      this.setState({ pausing: !pausing });
    } else {
      this.setState({ playing: !playing });
    }
  };

  handleVolumeChange = e => {
    this.setState({volume: parseFloat(e.target.value)});
  };

  handleOnLoad = (idx = 0) => {
    const currentIndex = this.currentPlayerIndex();
    const { loadStates, durations } = this.state;
    loadStates[idx] = true;
    durations[idx] = callHowler(this.howlers[idx], 'duration');
    if (idx === this.state.prevIdx) {
      this.props.onLoaded.prev(durations[idx]);
    } else if (idx === this.state.nextIdx) {
      this.props.onLoaded.next(durations[idx]);
    } else {
      this.props.onLoaded.src(durations[idx]);
    }
    const state = {
      loadStates,
      durations,
    };
    if (idx === currentIndex) {
      state.loaded = true;
    }
    console.log('loaded', idx, this.howlers[idx]._src);
    this.setState(state);
  }

  handleOnPlay = (idx = 0) => {
    const { playStates } = this.state;
    playStates[idx] = true;
    this.setState({
      playStates
    })
    this.renderSeekPos()
  }

  handleOnEnd = (idx = 0) => {
    const { playStates, loop } = this.state;
    // this.getCurrentHowler().stop()
    if (!loop) {
      this.props.onEnded();
      playStates[idx] = false;
      this.setState({
        playStates
      })
      this.clearRAF()
    }
  }

  handleStop = () => {
    this.getCurrentHowler().stop()
    this.setState({
      ff: false,
      rewind: false,
      playing: false // Need to update our local state so we don't immediately invoke autoplay
    })
    this.renderSeekPos()
  }

  handleLoopToggle = () => {
    this.setState({
      loop: !this.state.loop
    })
  }

  handleMuteToggle = () => {
    this.setState({
      mute: !this.state.mute
    })
  }

  renderSeekPos = () => {
    const seek = this.getCurrentHowler().seek();
    if (seek.toFixed) {
      this.setState({
        seek: this.getCurrentHowler().seek()
      })
    }
    if (this.state.playing) {
      this._raf = raf(this.renderSeekPos)
    }
  }

  clearRAF = () => {
    raf.cancel(this._raf)
  }

  currentPlayerIndex = () => {
    return this.state.currentIdx || 0;
  };
  prevPlayerIndex = () => {
    return this.state.prevIdx || 1;
  };
  nextPlayerIndex = () => {
    return this.state.nextIdx || 2;
  };
  playerSource = (idx = 0) => {
    const { src, prev, next } = this.props;
    if (idx === this.currentPlayerIndex()) {
      return src;
    }
    if (idx === this.nextPlayerIndex()) {
      return next;
    }
    return prev;
  };
  getHowlerProps = (idx = 0, source = '') => {
    const { playStates, playing, loop, mute, volume } = this.state;
    const currentIndex = this.currentPlayerIndex();
    return {
      src: source || this.playerSource(idx),
      playing: !!playStates[idx],
      onload: () => this.handleOnLoad(idx),
      onplay: () => this.handleOnPlay(idx),
      onend: () => this.handleOnEnd(idx),
      loop,
      mute,
      volume,
      falsehtml5: true,
    }
  }

  getCurrentHowler = () => {
    return this.howlers[this.currentPlayerIndex()];
  }

  initHowlers = () => {
    const arr = [
      this.getHowlerProps(0),
      this.getHowlerProps(1),
      this.getHowlerProps(2),
    ];
    arr.map((props, idx) => {
      this.howlers[idx] = new Howl(props);
    })
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { playing = false } = this.state;
    const { playing: prevPlaying = false,  } = prevState;
    const { src, prev, next } = this.props;
    const { src: psrc, prev: pprev, next: pnext } = prevProps;
    if (difference([src, prev, next], [psrc, pprev, pnext]).length) {
      this.setPlayerSources(src, prev, next);
    }
    if (!playing) {
      if (this.state.ff) {
        setTimeout(() => this.ff(6), 200);
      } else if (this.state.rewind) {
        if (this.state.seek) {
          setTimeout(() => this.rew(6), 200);
        }
      }
    }
  };

  setPlayerSources = (src, prev, next) => {
    const sources = this.howlers.map((howl, idx) => {
      callHowler(howl, 'pause');
      return howl._src;
    });
    // console.log(sources);
    const remains = [0, 1, 2];
    const required = [src, prev, next];
    const indexNames = ['currentIdx', 'prevIdx', 'nextIdx'];
    const updatedIndice = {};
    required.map((resource, i) => {
      const idx = findIndex(sources, s => resource.includes(s));
      if (resource && idx >= 0) {
        updatedIndice[indexNames[i]] = idx;
        pull(remains, idx);
      }
    })
    required.map((resource, i) => {
      if (resource && updatedIndice[indexNames[i]] === undefined) {
        const idx = remains.shift();
        updatedIndice[indexNames[i]] = idx;
        const howler = this.howlers[idx];
        // console.log(howler._state);
        if (howler._state) {
          howler.unload();
          howler.unload();
        }
        this.howlers[idx] = new Howl(this.getHowlerProps(idx, resource));
        const { playStates, loadStates, durations } = this.state;
        playStates[idx] = false;
        loadStates[idx] = false;
        durations[idx] = 0;
        this.setState({ playStates, loadStates, durations });
      }
    });
    // console.log(updatedIndice);
    callHowler(this.howlers[updatedIndice.prevIdx], 'pause');
    callHowler(this.howlers[updatedIndice.nextIdx], 'pause');
    this.setState(updatedIndice);
  };

  updateHowler = throttle((props) => {
    const { rate, pausing, playing, mute, loop, volume } = props;
    const howler = this.getCurrentHowler();
    if (playing && !pausing) {
      if (!callHowler(howler, 'playing')) {
        howler.play();
      }
    } else if (playing && pausing) {
      if (callHowler(howler, 'playing')) {
        howler.pause();
      }
    }
    callHowler(howler, 'mute', props.mute);
    callHowler(howler, 'loop', props.loop);
    callHowler(howler, 'volume', props.volume);
    if (rate && rate !== howler._rate) {
      callHowler(howler, 'rate', rate);
    } else if (howler._rate !== 1) {
      callHowler(howler, 'rate', 1);
    }
  }, 200);

  logStatus = throttle(() => {
    this.howlers.map((howler, idx) => {
      howler && console.log(`howler${idx}`, howler._state, callHowler(howler, 'playing') ? 'playing' : '', howler._src);
    });
    console.log(this.props.offset, '----', this.state.seek);
  }, 1000);

  render () {
    const { offset, src, prev, next } = this.props;
    const { ff, rewind, seek = 0, durations, loop, mute, volume, pausing, playing, loaded } = this.state;
    const duration = durations[this.currentPlayerIndex()];
    const uiProps = {
      playing,
      pausing,
      loading: !loaded,
      loop,
      mute,
      volume,
      seek,
      duration,
    }
    let velocity = (playing && !pausing) ? 1 : 0;
    let audioVolume = volume;
    let rate = 0;
    if (playing) {
      if (rewind) {
        audioVolume *= 0.5;
        velocity = -4;
        rate = velocity;
      } else if (ff) {
        audioVolume *= 0.5;
        velocity = 4;
        rate = velocity;
      }
    } else {
      /*
      if (rewind) {
        velocity = -8;
        rate = velocity;
      } else if (ff) {
        velocity = 8;
        rate = velocity;
      }
      */
    }
    this.updateHowler({ playing, pausing, loop, mute, volume: audioVolume, rate });
    const pos = offset + seek;
    // this.logStatus();
    return (
      <div className='full-control'>
        <Cassette pos={pos} length={1800} velocity={velocity} />
        <PlayerUI
          {...uiProps}
          pos={pos}
          handleMuteToggle={this.handleMuteToggle}
          handleLoopToggle={this.handleLoopToggle}
          handleToggle={this.handleToggle}
          handleStop={this.handleStop}
          handleVolumeChange={this.handleVolumeChange}
          handleFastForward={this.handleFastForward}
          handleRewind={this.handleRewind}
          velocity={velocity}
        />
      </div>
    )
  }
}

const types = {
  required: {
    src: '',
  },
  optional: {
    onLoaded: { src: () => {}, prev: () => {}, next: () => {} },
    prev: '',
    next: '',
    offset: 0,
  }
};

FullControl.propTypes = { ...propTypes(types) };
FullControl.defaultProps = { ...defaultProps(types) };

export default FullControl;
