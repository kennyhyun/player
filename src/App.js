import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { SSString } from 'react-sevenseg';
import { Player } from './components/player';

const sourceList = [
  [
    ['music/nodame canta/CD1/01.mp3'],
    ['music/nodame canta/CD1/02.mp3'],
    ['music/nodame canta/CD1/03 ガ_シュウィン_ ラプソディ_イン_ブル_ (__).mp3'],
    ['music/nodame canta/CD1/04 リスト_ メフィスト_ワルツ #1 S 514 「村の居酒屋で.mp3'],
    ['music/nodame canta/CD1/05 モ_ツァルト_ オ_ボエ協奏曲 ハ長調 K 314_285d -.mp3'],
    ['music/nodame canta/CD1/06 ドビュッシ__ 喜びの島.mp3'],
    ['music/nodame canta/CD1/07 ラヴェル_ 亡き王女のためのパヴァ_ヌ.mp3'],
    ['music/nodame canta/CD1/08 シュトラウス (R)_ 交響詩「ティル_オイレンシュピ_ゲルの愉快.mp3'],
    ['music/nodame canta/CD1/09 ベ_ト_ヴェン_ 交響曲 #7 イ長調 Op. 92 - 1..mp3'],
    ['music/nodame canta/CD1/10 海老原大作_ ロンド_トッカ_タ.mp3'],
  ],
  [
    ['music/nodame canta/CD2/01 ベルリオ_ズ_ 序曲《ロ_マの謝肉祭》.mp3'],
    ['music/nodame canta/CD2/02 ラヴェル_ バレエ《マ_メ_ル_ロワ》 - 3. 眠りの森の美女の.mp3'],
    ['music/nodame canta/CD2/03 ストラヴィンスキ__ 「ペトル_シュカ」からの3_章 - 1. ロ.mp3'],
    ['music/nodame canta/CD2/04 ラヴェル_ 水の_れ.mp3'],
    ['music/nodame canta/CD2/05 プ_ランク_ ピアノ オ_ボエ バソンのための三重奏曲 - 2.mp3'],
    ['music/nodame canta/CD2/06 デュカス_ 交響詩《魔法使いの弟子》.mp3'],
    ['music/nodame canta/CD2/07 モ_ツァルト_ ピアノ_ソナタ#8 イ短調  K 310(300.mp3'],
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
