import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import styled, { keyframes } from 'styled-components';
import { onlyUpdateForKeys } from 'recompose';

const rotate = p => keyframes`
  from {
    transform: translate3d(0, 0, 0) translateX(${-p.radius}px) translateY(${-p.radius}px) rotate(360deg);
  }
  to {
    transform: translate3d(0, 0, 0) translateX(${-p.radius}px) translateY(${-p.radius}px) rotate(0deg);
  }
`;

const Wheel = styled.div`
  position: absolute;
  background-size: cover;
  background-image: ${p => p.backgroundImage};
  width: ${p => `${p.radius * 2}px`};
  height: ${p => `${p.radius * 2}px`};
  transform: translate3d(0, 0, 0) translateX(${p=>-p.radius}px) translateY(${p=>-p.radius}px);
  animation: ${p => rotate(p)} ${p => `${p.velocity && 3 / p.velocity}s`} linear;
  animation-iteration-count: infinite;
`;

const types = {
  required: {
    velocity: 0, // positive when cw
    backgroundImage: '',
  },
  optional: {
    style: {},
    radius: 29, // mm
  }
};

Wheel.propTypes = { ...propTypes(types) };
Wheel.defaultProps = { ...defaultProps(types) };

export default onlyUpdateForKeys(['style', 'radius', 'backgroundImage', 'velocity'])(Wheel);
