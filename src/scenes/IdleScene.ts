import { shouldSkipStory } from '../utils/shouldSkipStory';

export default class IntroScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'IdleScene',
    });
  }

  public async create(): Promise<void> {
    const video = this.add.video(1280 / 2, 720 / 2, 'idle-video') as Phaser.GameObjects.Video;

    video.setScale(0.4);
    video.play(true);

    const text = this.add.text(
      1280 / 2,
      70,
      'Press any key to start',
      {
        fontFamily: 'Pixel miners',
        fontSize: '24px',
        align: 'center',
      },
    );

    text.setX(text.x - text.width / 2);

    this.input.keyboard.on('keydown', (): void => {
      this.changeScene();
      this.input.keyboard.off('keydown');
    });
  }

  private changeScene(): void {
    if (!shouldSkipStory()) {
      this.scene.start('IntroScene');
    } else {
      this.scene.start('GameScene');
      this.scene.start('MainMenuScene');
      this.scene.bringToTop('MainMenuScene');
    }
  }
}
