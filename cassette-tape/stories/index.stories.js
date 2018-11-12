import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withState } from 'recompose';

import Cassette from '../src/';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}

const WrappedCassette = withState('pos', 'setPos', 0)(({ pos, setPos }) =>
    <Cassette pos={pos} length={1800} velocity={pos ? 1 : 0} onClick={
      () => console.log(pos) || setPos(pos + 100)
    }/>
  );

storiesOf('Cassete tapes', module)
  .addDecorator(storyFn => (
    <div>
      {storyFn()}
    </div>
  ))
  .add('Cassette', () => <WrappedCassette />);
