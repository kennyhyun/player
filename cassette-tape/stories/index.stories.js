import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Cassette from '../src/';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}


storiesOf('Cassete tapes', module)
  .addDecorator(storyFn => (
    <div>
      {storyFn()}
    </div>
  ))
  .add('Cassette', () => <Cassette pos={100} length={1800} velocity={1} />);
