import { createAnimation } from '../utils/createAnimation';
import shouldSkipIntro from '../utils/shouldSkipIntro';
import { shouldSkipStory } from '../utils/shouldSkipStory';
import { shouldSkipIdle } from '../utils/shouldSkipIdle';

export default class BootScene extends Phaser.Scene {
  private introImage: Phaser.GameObjects.Sprite;

  private timesLooped: number;

  private animStopped: boolean;

  public constructor() {
    super({
      key: 'LoadingScene',
    });

    this.timesLooped = 0;
    this.animStopped = false;
  }

  private showLoadingAnimation(): void {
    this.anims.create(createAnimation(
      'intro',
      10,
      'introFrame',
      // @ts-ignore
      {
        frameRate: 10,
        repeat: 0,
      },
    ));

    this.anims.create(createAnimation(
      'intro-loop',
      2,
      'introFrame1',
      // @ts-ignore
      {
        frameRate: 3,
        repeat: -1,
      },
    ));

    this.introImage = this.add.sprite(0, 0, 'introFrame0');
    this.introImage.setOrigin(0, 0);
    this.introImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.introImage.anims.play('intro');
    this.introImage.anims.chain('intro-loop');

    this.introImage.on('animationrepeat', (animation: Phaser.Animations.Animation): void => {
      if (animation.key === 'intro-loop') {
        this.timesLooped += 1;
      }
    }, this);
  }

  public preload(): void {
    if (!shouldSkipIntro()) {
      this.showLoadingAnimation();
    }

    for (let i = 0; i < 13; i += 1) {
      this.load.image(`wizard-${i}`, `assets/spritesheets/wizard/wizard-${i}.png`);
    }

    for (let i = 0; i < 4; i += 1) {
      this.load.image(`monster-${i}`, `assets/spritesheets/monster/monster-${i}.png`);
    }

    for (let i = 0; i < 11; i += 1) {
      this.load.image(`fire-${i}`, `assets/spritesheets/fire/fire-${i}.png`);
    }

    for (let i = 0; i < 13; i += 1) {
      this.load.image(`hole-${i}`, `assets/spritesheets/hole/hole-${i}.png`);
    }

    this.load.image('bg', 'assets/images/bg.png');

    if (!shouldSkipStory()) {
      this.load.image('story-gun-closed', 'assets/images/gun_closed.png');
      this.load.image('story-gun-open-0', 'assets/images/gun_open-0.png');
      this.load.image('story-gun-open-1', 'assets/images/gun_open-1.png');

      for (let i = 0; i < 15; i += 1) {
        this.load.image(`story-gun-error-${i}`, `assets/spritesheets/gun-error/gun_anim_error${i}.png`);
      }

      this.load.audio('story-voiceover', 'assets/audio/intro.mp3');
    }

    if (!shouldSkipIdle()) {
      this.load.video('idle-video', 'assets/videos/idle-video.mp4', 'loadeddata', false, true);
    }

    this.load.image('overlay', 'assets/images/dark.png');

    for (let i = 0; i < 10; i += 1) {
      this.load.image(`fire-ui-${i}`, `assets/spritesheets/ui/fire-ui-${i}.png`);
    }

    this.load.image('staff-off', 'assets/spritesheets/ui/staff-off.png');
    this.load.image('staff-on', 'assets/spritesheets/ui/staff-on.png');

    this.load.image('warn', 'assets/images/warn.png');

    this.load.audio('theme', 'assets/audio/theme.mp3');
    this.load.audio('click', 'assets/audio/click.mp3');
    this.load.audio('wrong', 'assets/audio/wrong-button.mp3');
    this.load.audio('staff-death-1', 'assets/audio/enemy_death_1.mp3');
    this.load.audio('staff-death-2', 'assets/audio/enemy_death_2.mp3');
    this.load.audio('staff-death-0', 'assets/audio/enemy_death_0.mp3');
    this.load.audio('fire-sound', 'assets/audio/fire.mp3');
    this.load.audio('fire-death', 'assets/audio/enemy_death_fire.mp3');
    this.load.audio('wizard-death', 'assets/audio/mag-death.mp3');
    this.load.audio('laska', 'assets/audio/laska.mp3');
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  public create(): void {}

  private changeScene(): void {
    if (!shouldSkipIdle()) {
      this.scene.start('IdleScene');
    } else if (!shouldSkipStory()) {
      this.scene.start('IntroScene');
    } else {
      this.scene.start('GameScene');
    }
  }

  private playEndingAnimation(): void {
    this.animStopped = true;
    this.introImage.anims.stop();
    this.introImage.anims.playReverse('intro');
    this.introImage.on('animationcomplete', this.changeScene, this);
  }

  public update(): void {
    if (shouldSkipIntro()) {
      this.changeScene();
      return;
    }

    if (!this.animStopped && this.timesLooped > 2) {
      this.playEndingAnimation();
    }
  }
}
