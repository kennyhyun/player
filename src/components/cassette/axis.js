import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import Wheel from './wheel';

export const Axis = (props) => {
  const { velocity, style, radius } = props;
  const pixelRatio = 1.55;
  const radiusPx = radius * pixelRatio;
  return (<Wheel
    backgroundImage={'url(/wheel.svg)'}
    velocity={velocity}
    radius={radiusPx * 2}
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

Axis.propTypes = { ...propTypes(types) };
Axis.defaultProps = { ...defaultProps(types) };

export default Axis;

