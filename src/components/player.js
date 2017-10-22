import React, { Component } from 'react';
// import Howl from 'howler';
import FullControl from './controller';
import Button from './Button';
// import './player.css';

export class Player extends Component {
  constructor(props) {
    super(props);
    const { sourceList: [listA = [], listB = []] } = props;
    listA.map(src => src.map((val, i) =>
       src[i] = encodeURIComponent(decodeURIComponent(val))));
    listB.map(src => src.map((val, i) =>
       src[i] = encodeURIComponent(decodeURIComponent(val))));
    this.state = {
      durations: [],
      side: 'A',
      pos: 0,
      length: 60,
      index: 0,
      endIndex: listA.length,
      listA,
      listB
    }
    this.loading = [];
  }

  ComponentDidMount = () => {
  };

  nav = (step = 1) => {
    const { index: prev, endIndex } = this.state;
    if (this.loading.indexOf(true) >= 0) {
      console.log(this.loading);
      console.log('skip since loading');
      return;
    } 
    const index = Number(prev) + Number(step);
    if (index < 0) return;
    if (index >= endIndex) return;
    this.setState({ index });
  }

  getSource = (pos = 0) => {
    const { endIndex, index, side, listA, listB } = this.state;
    let i = Number(index) + Number(pos);
    if (i < 0 || i >= endIndex) {
      return [];
    }
    let src = '';
    if (side === 'A') {
      src = listA[i];
    } else {
      src = listB[i];
    }
    return src;
  };

  setDuration = (pos = 0, duration) => {
    const { loaded, durations, index } = this.state;
    const newIndex = Number(index) + Number(pos);
    if (newIndex >= 0) {
      durations[newIndex] = duration;
      this.loading[newIndex] = false;
      this.setState({ durations });
    }
  };

  getOffset = () => {
    const { durations, index } = this.state;
    const ret = durations.reduce((sum, val, idx) => {
      if (index > idx) {
        sum += Number(val);
      }
      return sum;
    }, 0);
    console.log('getOffset', ret, durations);
    return ret;
  };

  componentWillUpdate = (nextProps, nextState) => {
    const { index: nextIndex } = nextState;
    const { index } = this.state;
    if (index !== nextIndex) {
      console.log('get loading status');
    }
    // if (src) {
    //   console.log('set', i, 'true');
    //   this.loading[i] = true;
    // }
  };

  render = () => {
    const { style, counterStyle } = this.props;
    const { side, index, listA, listB } = this.state;
    const list = side === 'A' ? listA : listB;

    return (<div>
      <FullControl
        offset={this.getOffset()}
        src={this.getSource(0)}
        prev={this.getSource(-1)}
        next={this.getSource(1)}
        onEnded={() => this.nav(1)}
        onLoaded={{
          src: duration => {this.setDuration(0, duration)},
          prev: duration => {this.setDuration(-1, duration)},
          next: duration => {this.setDuration(1, duration)},
        }}
      />
      <Button className="digital-control" onClick={() => this.nav(-1)}>
        <span title="Previous" className="fa fa-fast-backward" />
      </Button>
      <Button className="digital-control" onClick={() => this.nav(1)}>
        <span title="Next" className="fa fa-fast-forward" />
      </Button>
    </div>);
  };
}

