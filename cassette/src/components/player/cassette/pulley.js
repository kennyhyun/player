import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import Wheel from './wheel';

export const Pulley = (props) => {
  const { velocity, style, radius } = props;
  return (<Wheel
    backgroundImage={'url(/pulley.svg)'}
    velocity={velocity}
    radius={radius}
    style={{
      ...style
    }}
  />);
}

const types = {
  required: {
    velocity: 0, // positive when cw
  },
  optional: {
    style: {},
    radius: 29, // mm
  }
};

Pulley.propTypes = { ...propTypes(types) };
Pulley.defaultProps = { ...defaultProps(types) };

export default Pulley;

