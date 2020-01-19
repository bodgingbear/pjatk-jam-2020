import { sleep } from "../utils/sleep";

export default class IntroScene extends Phaser.Scene {
  private sprite: Phaser.GameObjects.Sprite

  public constructor() {
    super({
      key: 'IntroScene',
    });
  }

  private setupGunAnimation(scene: Phaser.Scene): void {
    const gunAnimConfig: Phaser.Types.Animations.Animation = {
      key: 'story-gun-open',
      frames: [
        { key: 'story-gun-open-0', frame: null },
        { key: 'story-gun-open-1', frame: null },
      ],
      frameRate: 6,
      repeat: -1,
    };

    const gunAnimErrorConfig: Phaser.Types.Animations.Animation = {
      key: 'story-gun-open-error',
      frames: [
        { key: 'story-gun-error-0', frame: null },
        { key: 'story-gun-error-1', frame: null },
        { key: 'story-gun-error-2', frame: null },
        { key: 'story-gun-error-3', frame: null },
        { key: 'story-gun-error-4', frame: null },
        { key: 'story-gun-error-5', frame: null },
        { key: 'story-gun-error-6', frame: null },
        { key: 'story-gun-error-7', frame: null },
        { key: 'story-gun-error-8', frame: null },
        { key: 'story-gun-error-9', frame: null },
        { key: 'story-gun-error-10', frame: null },
        { key: 'story-gun-error-11', frame: null },
        { key: 'story-gun-error-12', frame: null },
        { key: 'story-gun-error-13', frame: null },
        { key: 'story-gun-error-14', frame: null },
      ],
      frameRate: 4,
      repeat: 0,
    };

    const gunAnimIdleConfig: Phaser.Types.Animations.Animation = {
      key: 'story-gun-open-idle',
      frames: [
        { key: 'story-gun-error-0', frame: null },
      ],
      frameRate: 1,
      repeat: 0,
    };

    scene.anims.create(gunAnimConfig) as Phaser.Animations.Animation;
    scene.anims.create(gunAnimErrorConfig) as Phaser.Animations.Animation;
    scene.anims.create(gunAnimIdleConfig) as Phaser.Animations.Animation;
  }

  public async create(): Promise<void> {
    this.add.image(1280 / 2, 720 / 2, 'story-gun-closed').setScale(5);
    const open0 = this.add.sprite(1280 / 2, 720 / 2, 'story-gun-open-0').setScale(5);
    this.setupGunAnimation(this);
    open0.anims.play('story-gun-open');
    open0.setAlpha(0);

    this.sound.add('story-voiceover').play();

    await sleep(11000);

    this.tweens.add({
      targets: open0,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
      yoyo: false
    });

    await sleep(5500);

    this.tweens.add({
      targets: this.cameras.main,
      zoom: 2,
      scrollX: 140,
      scrollY: -70,
      ease: 'Cubic.easeInOut',
      duration: 2000,
      repeat: 0,
      yoyo: false
    });

    await sleep(9000);

    open0.anims.stop();
    open0.anims.play('story-gun-open-idle');

    await sleep(2500);

    open0.anims.play('story-gun-open-error');

    await sleep(9000);

    await sleep(1000);

    this.tweens.add({
      targets: this.cameras.main,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      duration: 1000,
      repeat: 0,
      yoyo: false
    });

    this.changeScene();
  }

  private changeScene(): void {
    this.scene.start('GameScene');
    this.scene.start('MainMenuScene');
    this.scene.bringToTop('MainMenuScene');
  }
}
