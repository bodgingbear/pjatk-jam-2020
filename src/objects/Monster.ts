export enum MonsterType {
    Ground,
    Falling
}

export class Monster {
    scene: Phaser.Scene

    sprite: Phaser.GameObjects.Sprite

    spriteToFollow: Phaser.GameObjects.Sprite

    body: Phaser.Physics.Arcade.Body

    isReadyToMove: boolean

    speed: number

    constructor(scene: Phaser.Scene, spriteToFollow: Phaser.GameObjects.Sprite, monsterType: MonsterType, speed = 60) {
      this.scene = scene;

      this.sprite = this.scene.add.sprite(0, 0, 'monster-0');

      this.sprite.setScale(5);
      this.scene.physics.world.enable(this.sprite);

      this.body = this.sprite.body as Phaser.Physics.Arcade.Body;

      this.speed = speed;

      this.spriteToFollow = spriteToFollow;
      this.setupAnimations();
      this.handleTypeness(monsterType);
    }

    handleTypeness(monsterType: MonsterType): void {
      let spawnPosX = null;
      let spawnPosY = null;
      if (monsterType === MonsterType.Falling) {
        spawnPosX = 100 + Math.random() * 1080;
        spawnPosY = -60;
        const warn = this.scene.add.sprite(spawnPosX, 100, 'warn').setScale(5);
        setTimeout(() => warn.destroy(), 1200);
        this.isReadyToMove = false;
        this.scene.tweens.add({
          targets: this.sprite,
          y: 720 - 55,
          ease: Phaser.Math.Easing.Quadratic.In,
          duration: 1100,
          repeat: 0,
          yoyo: false,
          delay: 1000,
          onComplete: () => {
            this.isReadyToMove = true;
          },
        });
      } else if (monsterType === MonsterType.Ground) {
        spawnPosX = 1280 + 100;
        spawnPosY = 720 - 100;
        this.isReadyToMove = true;
      }

      this.sprite.setPosition(spawnPosX, spawnPosY);
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
      if (!this.isReadyToMove) {
        return;
      }

      if (!this.spriteToFollow.active) {
        return;
      }

      if (Math.abs(this.spriteToFollow.x - this.body.x) < 20) {
        this.body.velocity.x = 0;
      } else if ((this.spriteToFollow.x - this.body.x) < 0) {
        this.body.velocity.x = -this.speed;
        this.sprite.scaleX = Math.abs(this.sprite.scaleX);
      } else {
        this.body.velocity.x = this.speed;
        this.sprite.scaleX = -Math.abs(this.sprite.scaleX);
      }
    }

    update(): void {
      this.handleMovement();
    }

    kill(): void {
      // play dead animation
      this.sprite.destroy();
      this.body.destroy();
    }
}
