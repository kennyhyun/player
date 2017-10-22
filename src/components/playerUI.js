import React from 'react'
import Odometer from './Odometer'

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
  velocity,
  seek,
  duration,
  handleLoopToggle,
  handleMuteToggle,
  handleToggle,
  handleStop,
  handleVolumeChange,
  handleRewind,
  handleFastForward,
}) => {
  const counterRate = 1.9;
  const speed = velocity ? (counterRate * 1000 / velocity) : 0; 
  const counter = pos / counterRate;
  return (<div>
    <table className="no-border" style={{ margin: 'auto' }}>
      <tr>
        <td rowspan="2">

          <Button className="control" onClick={handleToggle}>
            <span title="Pause" className="fa fa-pause" />
          </Button>
          <Button className="control" onClick={() => !playing && handleToggle() }>
            <span title="Play" className="fa fa-play" />
          </Button>
          <Button className="control" onClick={handleStop}>
            <span title="Stop" className="fa fa-stop" />
          </Button>
          <Button className="control"
            onMouseDown={() => handleFastForward(true)}
            onMouseUp={() => handleFastForward(false)}
          >
            <span title="FF" className="fa fa-play" />
            <span title="FF" className="fa fa-play" />
          </Button>
        </td>

        <td>
          <Odometer
            size={36}
            digits={4}
            number={counter || 0}
            speed={speed}
          />
        </td>
        <td rowspan="2">

          <div className='volume'>
            <label>
              <span className='slider-container'>
                <input
                  type='range'
                  orient='vertical'
                  min='0'
                  max='1'
                  step='.05'
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{verticalAlign: 'bottom'}}
                />
              </span>
              <span>
                {volume.toFixed(2)}
              </span>
            </label>
          </div>

        </td>
      </tr>

      <tr>
        <td>

          <div className='toggle'>
            <h4>Loop</h4>
            <input checked={loop} onChange={handleLoopToggle}
              className="tgl tgl-light" id="cb1" type="checkbox"/>
            <label class="tgl-btn" for="cb1" />
          </div>

          <div className='toggle'>
            <h4>Mute</h4>
            <input checked={mute} onChange={handleMuteToggle}
              className="tgl tgl-light" id="cb2" type="checkbox"/>
            <label class="tgl-btn" for="cb2" />
          </div>

        </td>
      </tr>
    </table>

  </div>);
};

