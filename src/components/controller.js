import React from 'react'
import { Howl } from 'howler'
import raf from 'raf' // requestAnimationFrame polyfill
import { difference, findIndex, pull } from 'lodash';

// import { SSString } from 'react-sevenseg';
import { PlayerUI } from './playerUI';

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
  }

  handleToggle = () => {
    const playing = !this.state.playing;
    this.setState({
      playing,
    })
  }

  handleVolumeChange = e => {
    this.setState({volume: parseFloat(e.target.value)});
  };

  handleOnLoad = (idx = 0) => {
    const currentIndex = this.currentPlayerIndex();
    const { loadStates, durations } = this.state;
    loadStates[idx] = true;
    durations[idx] = this.howlers[idx].duration();
    const state = {
      loadStates,
      durations,
    };
    if (idx === currentIndex) {
      state.loaded = true;
    }
    console.log('loaded', idx);
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
    const { playStates } = this.state;
    playStates[idx] = false;
    this.setState({
      playStates
    })
    this.clearRAF()
  }

  handleStop = () => {
    this.getCurrentHowler().stop()
    this.setState({
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
    return this.currentIdx || 0;
  };
  prevPlayerIndex = () => {
    return this.prevIdx || 0;
  };
  nextPlayerIndex = () => {
    return this.nextIdx || 0;
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
    }
  }

  getCurrentHowler = () => {
    return this.howlers[0];
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
    const { playing: prevPlaying = false } = prevState;
    if (!prevPlaying && playing) {
      console.log('need play');
      // this.getCurrentHowler().play();
    } else if (prevPlaying && !playing) {
      console.log('need pause');
    }
    const { src, prev, next } = this.props;
    const { src: psrc, prev: pprev, next: pnext } = prevProps;
    if (difference([src, prev, next], [psrc, pprev, pnext]).length) {
      this.setPlayerSources(src, prev, next);
    }
  };

  setPlayerSources = (src, prev, next) => {
    const sources = this.howlers.map((howl, idx) => {
      return howl._src;
    });
    const remains = [0, 1, 2];
    const required = [src, prev, next];
    const indexNames = ['currentIdx', 'prevIdx', 'nextIdx'];
    const updatedIndice = {};
    required.map((resource, i) => {
      const idx = findIndex(sources, s => s === resource);
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
        if(howler.state() === 'loaded') {
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
    Object.assign(this, updatedIndice);
  };

  render () {
    const { src, prev, next } = this.props;
    const { seek, durations, loop, mute, volume, playing, loaded } = this.state;
    const howler = this.getCurrentHowler();
    if (playing) {
      if (!howler.playing()) {
        howler.play();
      }
    } else {
      if (howler.playing()) {
        howler.pause();
      }
    }
    const duration = durations[this.currentPlayerIndex()];
    const uiProps = {
      playing,
      loading: !loaded,
      loop,
      mute,
      volume,
      seek,
      duration,
    }
    return (
      <div className='full-control'>
        <PlayerUI
          {...uiProps}
          handleMuteToggle={this.handleMuteToggle}
          handleLoopToggle={this.handleLoopToggle}
          handleToggle={this.handleToggle}
          handleStop={this.handleStop}
          handleVolumeChange={this.handleVolumeChange}
        />
      </div>
    )
  }
}

export default FullControl;
