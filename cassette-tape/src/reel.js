import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';

import Axis from './axis';

function round(val, digit = 1) {
  if (digit < 1 || digit > 8) {
    return 0;
  }
  const shift = Math.pow(10, digit);
  return Math.round(val * shift) / shift;
} 

const styles = {
};

export const Reel = (props) => {
  const {
    thickness = 0.0038,
    length,
    velocity,
    style,
    axisRadius = 29,
  } = props;

  const pixelRatio = 2.4;
  let radius = Math.sqrt(length * 1000 * thickness / Math.PI + axisRadius * axisRadius);
  radius = radius < axisRadius ? axisRadius : radius;
  const radiusPx = round(radius * pixelRatio);
  const axisRadiusPx = round(axisRadius * pixelRatio);
  const axisVelocity = round(velocity * axisRadius / radius, 2);
  
  return (<div>
    <div style={{
      position: 'absolute',
      top: style.top == null ? '100px' : style.top,
      left: style.left == null ? '100px' : style.left,
      width: `${radiusPx * 2}px`,
      height: `${radiusPx * 2}px`,
      transform: `translate3d(0, 0, 0) translateX(${-radiusPx}px) translateY(${-radiusPx}px)`,
      borderRadius: '1000px',
      backgroundColor: 'black',
    }}>
    </div>
    <div style={{
      position: 'absolute',
      top: style.top == null ? '100px' : style.top,
      left: style.left == null ? '100px' : style.left,
      width: `${axisRadiusPx * 2 - 1}px`,
      height: `${axisRadiusPx * 2 - 1}px`,
      transform: `translate3d(0, 0, 0) translateX(${0.5-axisRadiusPx}px) translateY(${0.5-axisRadiusPx}px)`,
      borderRadius: '1000px',
      backgroundColor: 'white',
    }}>
    </div>
    <Axis radius={axisRadius} velocity={axisVelocity} style={{
      top: style.top == null ? '100px' : style.top,
      left: style.left == null ? '100px' : style.left,
    }}/>
  </div>);
};

const types = {
  required: {
    length: 10, // m
    velocity: 0, // positive when cw
  },
  optional: {
    style: {},
    thickness: 0.0038, // mm
    axisRadius: 29, // mm
  }
};

Reel.propTypes = { ...propTypes(types) };
Reel.defaultProps = { ...defaultProps(types) };

export default Reel;

