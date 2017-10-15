import React from 'react'

import { SSString } from './ssstring';
import Button from './Button'

function fixed(val, digits, fixed) {
  const num = val || 0;
  const numStr = Array(digits).join('0') + num.toFixed(fixed);
  return numStr.slice(-fixed-digits);
}

export const PlayerUI = ({
  playing,
  pos,
  loading,
  loop,
  mute,
  volume,
  seek,
  duration,
  handleLoopToggle,
  handleMuteToggle,
  handleToggle,
  handleStop,
  handleVolumeChange,
}) => {
  return (<div>
    <p>{!loading ? 'Loaded' : 'Loading'}</p>
    <div className='toggles'>
      <label>
        Loop:
        <input
          type='checkbox'
          checked={loop}
          onChange={handleLoopToggle}
        />
      </label>
      <label>
        Mute:
        <input
          type='checkbox'
          checked={mute}
          onChange={handleMuteToggle}
        />
      </label>
    </div>
    {(<SSString
      str={`${fixed(seek, 4, 2)
        }/${fixed(duration, 4, 2)
       }`}
      style={{
        transform: 'scale(0.6)',
        margin: '0 -40px',
        display: 'inline-block',
      }}
    />)}
    <div className='volume'>
      <label>
        Volume:
        <span className='slider-container'>
          <input
            type='range'
            min='0'
            max='1'
            step='.05'
            value={volume}
            onChange={handleVolumeChange}
            style={{verticalAlign: 'bottom'}}
          />
        </span>
        {volume.toFixed(2)}
      </label>
    </div>

    <Button onClick={handleToggle}>
      {(playing) ? 'Pause' : 'Play'}
    </Button>
    <Button onClick={handleStop}>
      Stop
    </Button>
  </div>);
};

