import { Physics, GameObjects } from 'phaser';
import { Monster } from './Monster';

export class Wizard {
    scene: Phaser.Scene

    sprite: Phaser.GameObjects.Sprite

    keyLeft: Phaser.Input.Keyboard.Key

    keyRight: Phaser.Input.Keyboard.Key

    onStaffAttackCb: () => void

    body: Phaser.Physics.Arcade.Body

    staffRangeCollider: Phaser.GameObjects.Rectangle

    facing: string

    killed: boolean

    constructor(scene: Phaser.Scene) {
      this.scene = scene;
      this.sprite = this.scene.add.sprite(640, 720 - 120, 'wizard-0');
      this.sprite.setScale(5);
      this.scene.physics.world.enable(this.sprite);

      this.sprite.setOrigin(0.5);

      this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
      this.body.setCollideWorldBounds(true);

      this.keyLeft = this.scene.input.keyboard.addKey('A');
      this.keyRight = this.scene.input.keyboard.addKey('D');

      this.scene.input.keyboard.on('keydown-SPACE', this.onStaffAttack);

      this.staffRangeCollider = this.scene.add.rectangle(
        this.sprite.x, this.sprite.y, 200, 100, 0x669966, 0,
      );
      this.staffRangeCollider.body = this.staffRangeCollider.body as Physics.Arcade.Body;

      this.setupAnimations();

      this.killed = false;
    }

    setupAnimations(): void {
      const wizardWalkAnimConfig: Phaser.Types.Animations.Animation = {
        key: 'wizard-walk',
        frames: [
          { key: 'wizard-0', frame: null },
          { key: 'wizard-1', frame: null },
        ],
        frameRate: 8,
        repeat: -1,
      };

      this.scene.anims.create(wizardWalkAnimConfig);
      this.sprite.anims.play('wizard-walk');
    }

    setStaffAttackCb(cb: () => void): void {
      this.onStaffAttackCb = cb;
    }

    onStaffAttack = (): void => {
      // play animation
      // throttle
      this.onStaffAttackCb();
    }

    handleMovement(): void {
      let velocityX = 0;
      const speed = 150;

      if (this.keyLeft.isDown) {
        velocityX -= speed;
      }

      if (this.keyRight.isDown) {
        velocityX += speed;
      }

      // if (this.sprite.x - this.sprite.width / 2 <= 0) {
      //   velocityX = Math.max(velocityX, 0);
      // }

      // if (this.sprite.x + this.sprite.width / 2 >= 1280) {
      //   velocityX = Math.min(velocityX, 0);
      // }

      if (velocityX > 0) {
        this.facing = 'right';
        this.sprite.scaleX = -Math.abs(this.sprite.scaleX);
      } else if (velocityX < 0) {
        this.facing = 'left';
        this.sprite.scaleX = Math.abs(this.sprite.scaleX);
      }

      // if (velocityX !== 0) {
      //   this.sprite.anims.play('wizard-walk', true);
      // } else {
      //   this.sprite.anims.stop();
      // }

      this.body.velocity.x = velocityX;
    }

    isFacing(sprite: GameObjects.Sprite): boolean {
      if (sprite.x > this.sprite.x && this.facing === 'right') {
        return true;
      }
      if (sprite.x < this.sprite.x && this.facing === 'left') {
        return true;
      }

      return false;
    }

    update(): void {
      if (this.killed === true) {
        return;
      }

      this.handleMovement();

      this.staffRangeCollider.setPosition(this.sprite.x, this.sprite.y);
    }

    kill() {
      this.sprite.destroy();
      this.staffRangeCollider.destroy();
      this.killed = true;
    }
}
