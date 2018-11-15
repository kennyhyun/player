import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import { onlyUpdateForKeys, compose, withProps } from 'recompose';

import Reel from './reel';
import Pulley from './pulley';

const positions = {
  leftReel: {
    top: 179,
    left: 180,
  },
  rightReel: {
    top: 179,
    left: 431,
  },
  leftPulley: {
    top: 360,
    left: 34,
  },
  rightPulley: {
    top: 360,
    left: 575,
  },
};

const trim = (val, min, max) => {
  if (val < min)
    return min;
  if (val > max)
    return max;
  return val;
};

export const Case = (props) => {
  const {
    length,
    innerPos: pos,
    velocity,
    style,
    ...rests
  } = props;

  const pulleyRadius = 15;

  return <div style={{
    position: 'relative',
    width: '600px',
    height: '400px',
    margin: 'auto',
    backgroundImage: 'url(/Cassette.svg)',
    ...style,
  }} {...rests}>
    <Reel length={length - pos} velocity={velocity} {...positions.leftReel} />
    <Reel length={pos} velocity={velocity} {...positions.rightReel} />
    <Pulley radius={pulleyRadius} velocity={velocity * 4} {...positions.leftPulley} />
    <Pulley radius={pulleyRadius} velocity={velocity * 4} {...positions.rightPulley} />
  </div>;
};

const types = {
  required: {
  },
  optional: {
    length: 1800,
    pos: 0,
    sideIndex: 0,
    velocity: 0,
    style: {},
  }
};

Case.propTypes = { ...propTypes(types) };
Case.defaultProps = { ...defaultProps(types) };

export default compose(
  withProps(p => ({
    innerPos: trim(p.pos, 0, p.length),
  })),
  onlyUpdateForKeys(['innerPos', 'sideIndex', 'velocity'])
)(Case);
