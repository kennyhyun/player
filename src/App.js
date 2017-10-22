import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Player } from './components/player';

const sourceList = [
  [
    ['music/nodame canta/CD1/01.mp3'],
    ['music/nodame canta/CD1/02.mp3'],
    ['music/nodame canta/CD1/03.mp3'],
    ['music/nodame canta/CD1/04.mp3'],
    ['music/nodame canta/CD1/05.mp3'],
    ['music/nodame canta/CD1/06.mp3'],
    ['music/nodame canta/CD1/07.mp3'],
    ['music/nodame canta/CD1/08.mp3'],
    ['music/nodame canta/CD1/09.mp3'],
    ['music/nodame canta/CD1/10.mp3'],
  ],
  [
    ['music/nodame canta/CD2/01.mp3'],
    ['music/nodame canta/CD2/02.mp3'],
    ['music/nodame canta/CD2/03.mp3'],
    ['music/nodame canta/CD2/04.mp3'],
    ['music/nodame canta/CD2/05.mp3'],
    ['music/nodame canta/CD2/06.mp3'],
    ['music/nodame canta/CD2/07.mp3'],
  ]
];

class App extends Component {
  render() {
    return (
      <div className="App" style={{ backgroundColor: '#333' }}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Player</h1>
        </header>
        <div>
          <Player sourceList={sourceList} />
        </div>
      </div>
    );
  }
}

export default App;
