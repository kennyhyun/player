import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import injectSheet from 'react-jss';

const styles = {
  wheel: {
    position: 'absolute',
    backgroundSize: 'cover',
    backgroundImage: p => p.backgroundImage,
    width: p => p.radius * 2,
    height: p => p.radius * 2,
    transform: p => `translate3d(${-p.radius}px, ${-p.radius}px, 0) rotate(0deg)`,
    top: p => p.top,
    left: p => p.left,
  },
};

class Wheel extends React.Component {
  constructor(p) {
    super(p);
    this.ref = React.createRef();
  }
  shouldComponentUpdate(p) {
    const { ref: { current: elem } } = this;
    elem.style.transition = `transform ${p.velocity && 3 / p.velocity / 6}s linear`;
    elem.style.transform = `translate3d(${-p.radius}px, ${-p.radius}px, 0) rotate(60deg)`;
    return false;
  }
  transitionEnd = (e) => {
    const { ref: { current: elem }, props: p } = this;
    elem.style.transition = 'none';
    elem.style.transform = `translateX(${-p.radius}px) translateY(${-p.radius}px) rotate(0deg)`;
    setTimeout(() => {
      elem.style.transition = `transform ${(p.velocity && 3 / p.velocity / 6)}s linear`;
      elem.style.transform = `translate3d(${-p.radius}px, ${-p.radius}px, 0) rotate(60deg)`;
    });
  }
  render() {
    return (
      <div className={this.props.classes.wheel} ref={this.ref} onTransitionEnd={this.transitionEnd} />
    );
  }
}

const types = {
  required: {
    // velocity: positive when cw
    velocity: 0,
    // backgroundImage hexagonal image
    backgroundImage: '',
  },
  optional: {
    top: 0,
    left: 0,
    radius: 29, // ~ mm
  }
};

Wheel.propTypes = { ...propTypes(types) };
Wheel.defaultProps = { ...defaultProps(types) };

export default injectSheet(styles)(Wheel);
