import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import { lifecycle, withProps, compose, onlyUpdateForKeys } from 'recompose';
import Wheel from './wheel';

export const Pulley = compose(
  onlyUpdateForKeys(['radius', 'velocity']),
  withProps(props => ({
    backgroundImage: 'url(/pulley.svg)',
  }))
)(Wheel);

const types = {
  required: {
    velocity: 0, // positive when cw
  },
  optional: {
    top: 0,
    left: 0,
    style: {},
    radius: 29, // mm
  }
};

Pulley.propTypes = { ...propTypes(types) };
Pulley.defaultProps = { ...defaultProps(types) };

export default Pulley;
