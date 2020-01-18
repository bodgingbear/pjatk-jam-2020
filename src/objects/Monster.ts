export class Monster {
    scene: Phaser.Scene

    sprite: Phaser.GameObjects.Sprite

    spriteToFollow: Phaser.GameObjects.Sprite

    body: Phaser.Physics.Arcade.Body

    constructor(scene: Phaser.Scene, spriteToFollow: Phaser.GameObjects.Sprite) {
      this.scene = scene;
      this.sprite = this.scene.add.sprite(1280 - 100, 720 - 90, 'monster-0');
      this.sprite.setScale(5);
      this.scene.physics.world.enable(this.sprite);

      this.body = this.sprite.body as Phaser.Physics.Arcade.Body;

      this.spriteToFollow = spriteToFollow;
      this.setupAnimations();
    }

    setupAnimations(): void {
      const monsterWalkAnimConfig: Phaser.Types.Animations.Animation = {
        key: 'monster-walk',
        frames: [
          { key: 'monster-0', frame: null },
          { key: 'monster-1', frame: null },
        ],
        frameRate: 8,
        repeat: -1,
      };

      this.scene.anims.create(monsterWalkAnimConfig);
      this.sprite.anims.play('monster-walk');
    }

    handleMovement(): void {
      const speed = 60;

      if (Math.abs(this.spriteToFollow.x - this.body.x) < 20) {
        this.body.velocity.x = 0;
      } else if ((this.spriteToFollow.x - this.body.x) < 0) {
        this.body.velocity.x = -speed;
        this.sprite.scaleX = Math.abs(this.sprite.scaleX);
      } else {
        this.body.velocity.x = speed;
        this.sprite.scaleX = -Math.abs(this.sprite.scaleX);
      }
    }

    update(): void {
      this.handleMovement();
    }

    kill(): void {
      // play dead animation
      this.sprite.destroy();
    }
}
