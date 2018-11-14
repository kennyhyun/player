import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import { lifecycle, withProps, compose, onlyUpdateForKeys } from 'recompose';
import Wheel from './wheel';

const Axis = compose(
  /*
  lifecycle({
    componentDidUpdate(prev) {
      console.log('axis rendered', prev, this.props);
    }
  }),
  */
  onlyUpdateForKeys(['radius', 'velocity']),
  withProps(props => ({
    backgroundImage: 'url(/wheel.svg)',
    radius: props.radius * 1.55 * 2,
  }))
)(Wheel);

const types = {
  required: {
    velocity: 0, // positive when cw
  },
  optional: {
    top: 0,
    left: 0,
    radius: 29, // mm
  }
};

Axis.propTypes = { ...propTypes(types) };
Axis.defaultProps = { ...defaultProps(types) };

export default Axis;
