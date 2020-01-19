import 'phaser';

import BootScene from './scenes/BootScene';
import LoadingScene from './scenes/LoadingScene';
import MainMenuScene from './scenes/GameScene';
import IntroScene from './scenes/IntroScene';
import shouldSkipIntro from './utils/shouldSkipIntro';

const config = {
  type: Phaser.AUTO,
  banner: true,
  width: 1280,
  height: 720,
  scene: [
    ...(shouldSkipIntro() ? [] : [BootScene]),
    LoadingScene,
    IntroScene,
    MainMenuScene,
  ],
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    width: 1280,
    height: 720,
  },
  zoom: 5,
  pixelArt: true,
  physics: {
    default: 'arcade',
  },
};

export default class Game extends Phaser.Game {}

window.addEventListener('load', (): Game => new Game(config));
