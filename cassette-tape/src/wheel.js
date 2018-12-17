import React from 'react';
import { propTypes, defaultProps } from 'proptypes-helper';
import injectSheet, { jss } from 'react-jss';

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
  animating: {
    display: 'none',
  },
};

jss.createStyleSheet({
  '@keyframes cassette-tape-wheel-rotate': {
    from: {
      transform: `translateX(var(--wheel-radius)) translateY(var(--wheel-radius)) rotate(60deg)`,
    },
    to: {
      transform: `translateX(var(--wheel-radius)) translateY(var(--wheel-radius)) rotate(0deg)`,
    },
  }
}).attach()

const maxVelocity = 2;
class Wheel extends React.Component {
  constructor(p) {
    super(p);
    this.ref = React.createRef();
    this.aniRef = React.createRef();
    this.keepRotating = false;
    this.animating = false;
  }

  animationStart = velocity => {
    const { ref: { current: rotation }, aniRef: { current: animation }, props: p } = this;
    if (this.animating) {
      animation.style.animationDuration = `${3 / velocity / 6}s`;
    } else {
      this.animating = true;
      rotation.style.opacity = 0;
      animation.style.display = 'block';
      animation.style.animation = `cassette-tape-wheel-rotate infinite ${3 / velocity / 6}s linear`;
    }
  }
  animationStop = () => {
    if (!this.animating) return;
    this.animating = false;
    const { ref: { current: rotation }, aniRef: { current: animation }, props: p } = this;
    rotation.style.opacity = 1;
    animation.style.display = 'none';
    animation.style.animation = 'none';
  }

  shouldComponentUpdate = (p) => {
    if (p.velocity === 0) {
      this.animationStop();
      this.keepRotating = false;
    } else if (p.velocity > maxVelocity) {
      this.animationStart(p.velocity);
    } else {
      this.animationStop();
      if (!this.keepRotating) {
        this.keepRotating = true;
        this.rotate(p.velocity);
      }
    }
    return false;
  }

  rotate = vel => {
    const velocity = vel > maxVelocity ? maxVelocity :  vel;
    const { ref: { current: elem }, props: p } = this;
    elem.style.transition = 'none';
    elem.style.transform = `translateX(${-p.radius}px) translateY(${-p.radius}px) rotate(0deg)`;
    setTimeout(() => {
      elem.style.transition = `transform ${(velocity && 3 / velocity / 6)}s linear`;
      if (velocity) {
        elem.style.transform = `translate3d(${-p.radius}px, ${-p.radius}px, 0) rotate(-60deg)`;
      } else {
        elem.style.transform = `translate3d(${-p.radius}px, ${-p.radius}px, 0) rotate(0deg)`;
      }
    });
  }

  transitionEnd = (e) => {
    const { ref: { current: elem }, props: p } = this;
    if (this.keepRotating) {
      this.rotate(p.velocity);
    }
  }

  render() {
    const { props: { classes, velocity }, animating } = this;
    const rotatingClassName = classes.wheel;
    const animatingClassName = `${classes.wheel} ${classes.animating}`;
    return (
      <>
        <div className={rotatingClassName} ref={this.ref} onTransitionEnd={this.transitionEnd} />
        <div className={animatingClassName} ref={this.aniRef} style={{
          ['--wheel-radius']: `-${this.props.radius}px`
        }} onTransitionEnd={this.transitionEnd} />
      </>
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
