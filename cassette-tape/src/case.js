import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import { shouldUpdate, shallowEqual } from 'recompose';

import Reel from './reel';
import Pulley from './pulley';

const styles = {
  leftReel: {
    top: '179px',
    left: '180px',
  },
  rightReel: {
    top: '179px',
    left: '431px',
  },
  leftPulley: {
    top: '360px',
    left: '34px',
  },
  rightPulley: {
    top: '360px',
    left: '575px',
  },
};

export const Case = (props) => {
  const {
    length,
    pos,
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
    <Reel length={length - pos} velocity={velocity} style={styles.leftReel} />
    <Reel length={pos} velocity={velocity} style={styles.rightReel} />
    <Pulley radius={pulleyRadius} velocity={velocity * 4} style={styles.leftPulley} />
    <Pulley radius={pulleyRadius} velocity={velocity * 4} style={styles.rightPulley} />
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

const changed = ({ props, nextProps }) => {
  if (!props || !nextProps) return true;
  return !shallowEqual(props, nextProps);
};

export default shouldUpdate(changed)(Case);
