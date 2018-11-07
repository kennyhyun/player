import React from 'react'
import { propTypes, defaultProps } from 'proptypes-helper';

import Digit from './Digit'

const styles = {
  odometer: {
    display: 'inline-block',
    height: '1em',
    fontFamily: 'sans-serif',
    borderRadius: 5,
    background: '#222',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadow: '0 -1px rgba(0, 0, 0, 0.9)',
    boxShadow: 'inset 0 2px 8px -2px #000',
  }
};

const Odometer = ({number, digits, speed, size, classes}) => {
  const intNum = Math.round(number);
  let chars = intNum.toString().split('')
  if (chars.length > digits) chars = chars.slice(-digits)
  while (chars.length < digits) chars.unshift('0')
  const odometerStyle = {
    fontSize: `${size}px`, 
    lineHeight: `${size}px`
  }

  return (
    <div className={[classes.odometer, 'odometer'].join(' ')} style={{
      ...styles.odometer,
      ...odometerStyle
    }}>
      { chars.map((digit, i) => {
        const place = Math.pow(10, (digits-i-1))
        const animate = (intNum % place === 0) || place === 1
        return (
          <Digit key={i} digit={digit} speed={speed} animate={animate}/>
        )
      })}
    </div>
  )
}

const types = {
  required: {
    number: 0,
  },
  optional: {
    classes: { odometer: '' },
    digits: 4,
    speed: 100,
    size: 72,
  }
}

Odometer.propTypes = { ...propTypes(types) };
Odometer.defaultProps = { ...defaultProps(types) };

export default Odometer;
