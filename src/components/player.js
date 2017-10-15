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
      side: 'A',
      pos: 0,
      length: 60,
      index: 0,
      endIndex: listA.length,
      listA,
      listB
    }
  }

  ComponentDidMount = () => {
  };

  nav = (step = 1) => {
    const { index: prev, endIndex } = this.state;
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
    if (side === 'A') {
      return listA[i];
    }
    return listB[i];
  };

  render = () => {
    const { style, counterStyle } = this.props;
    const { side, index, listA, listB } = this.state;
    const list = side === 'A' ? listA : listB;

    return (<div>
      <FullControl
        src={this.getSource(0)}
        prev={this.getSource(-1)}
        next={this.getSource(1)}
      />
      <Button onClick={() => this.nav(-1)}>
      prev
      </Button>
      <Button onClick={() => this.nav(1)}>
      next
      </Button>
    </div>);
  };
}

