import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';

import Reel from './reel';
import Pulley from './pulley';

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
    <Reel length={length - pos} velocity={velocity} style={{
      top: '179px',
      left: '180px',
    }} />
    <Reel length={pos} velocity={velocity} style={{
      top: '179px',
      left: '431px',
    }} />
    <Pulley radius={pulleyRadius} velocity={velocity * 4} style={{
      top: '360px',
      left: '575px',
    }}/>
    <Pulley radius={pulleyRadius} velocity={velocity * 4} style={{
      top: '360px',
      left: '34px',
    }}/>
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

export default Case;
