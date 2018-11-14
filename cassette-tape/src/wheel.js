import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import styled, { keyframes } from 'styled-components';
import { compose, withProps, onlyUpdateForKeys } from 'recompose';

const rotate = p => keyframes`
  from {
    transform: translateX(${-p.radius}px) translateY(${-p.radius}px) rotate(60deg);
  }
  to {
    transform: translateX(${-p.radius}px) translateY(${-p.radius}px) rotate(0deg);
  }
`;

const Wheel = styled.div`
  position: absolute;
  background-size: cover;
  background-image: ${p => p.backgroundImage};
  width: ${p => `${p.radius * 2}px`};
  height: ${p => `${p.radius * 2}px`};
  transform: translate3d(0, 0, 0) translateX(${p=>-p.radius}px) translateY(${p=>-p.radius}px);
  animation: ${rotate} infinite 0s linear;
`;

const types = {
  required: {
    velocity: 0, // positive when cw
    backgroundImage: '',
  },
  optional: {
    top: 0,
    left: 0,
    radius: 29, // mm
  }
};

Wheel.propTypes = { ...propTypes(types) };
Wheel.defaultProps = { ...defaultProps(types) };

export default compose(
  onlyUpdateForKeys(['radius', 'backgroundImage', 'velocity']),
  withProps(p => ({
    style: {
      top: p.top,
      left: p.left,
      animationDuration: `${p.velocity && 3 / p.velocity / 6}s`
    }
  }))
)(Wheel);
