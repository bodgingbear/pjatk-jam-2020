import { shouldSkipStory } from '../utils/shouldSkipStory';

export default class IntroScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'IdleScene',
    });
  }

  public async create(): Promise<void> {
    const video = this.add.video(1280 / 2, 720 / 2, 'idle-video') as Phaser.GameObjects.Video;

    video.play(true);

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
