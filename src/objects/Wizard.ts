import { Physics, GameObjects } from 'phaser';

enum WizardWeapon {
  Staff,
  Fire,
  Hole
}

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

    staffHitDur: number

    isDuringAttack: boolean

    chosenWeapon: WizardWeapon

    firAnimDur: number

    onFireAttackCb: () => void

    fire: Phaser.GameObjects.Sprite

    isFireAvailable: boolean

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

      this.scene.input.keyboard.on('keydown-SPACE', this.onActionBtnPress);
      this.scene.input.keyboard.on('keydown-ONE', () => this.chooseWeapon(WizardWeapon.Staff));
      this.scene.input.keyboard.on('keydown-TWO', () => this.chooseWeapon(WizardWeapon.Fire));


      this.staffRangeCollider = this.scene.add.rectangle(
        this.sprite.x, this.sprite.y, 200, 100, 0x669966, 0,
      );
      this.staffRangeCollider.body = this.staffRangeCollider.body as Physics.Arcade.Body;

      this.setupAnimations();

      this.killed = false;
      this.isDuringAttack = false;

      this.chosenWeapon = WizardWeapon.Staff;
      this.facing = 'left';

      this.isFireAvailable = false;
      setTimeout(() => {
        this.isFireAvailable = true;
      }, 10000);
    }

    setupAnimations(): void {
      const wizardWalkAnimConfig: Phaser.Types.Animations.Animation = {
        key: 'wizard-walk',
        frames: [
          { key: 'wizard-11', frame: null },
          { key: 'wizard-12', frame: null },
        ],
        frameRate: 8,
        repeat: -1,
      };

      this.scene.anims.create(wizardWalkAnimConfig);
      this.sprite.anims.play('wizard-walk');

      const staffHitAnimConfig: Phaser.Types.Animations.Animation = {
        key: 'staff-hit',
        frames: [
          { key: 'wizard-0', frame: null },
          { key: 'wizard-1', frame: null },
          { key: 'wizard-2', frame: null },
          { key: 'wizard-3', frame: null },
          { key: 'wizard-4', frame: null },
          { key: 'wizard-5', frame: null },
          { key: 'wizard-6', frame: null },
          { key: 'wizard-7', frame: null },
          { key: 'wizard-8', frame: null },
          { key: 'wizard-9', frame: null },
          { key: 'wizard-10', frame: null },
        ],
        frameRate: 24,
      };
      this.staffHitDur = (this.scene.anims.create(staffHitAnimConfig) as Phaser.Animations.Animation).duration;

      const fireAnimConfig: Phaser.Types.Animations.Animation = {
        key: 'fire-hit',
        frames: [
          { key: 'fire-0', frame: null },
          { key: 'fire-1', frame: null },
          { key: 'fire-2', frame: null },
          { key: 'fire-3', frame: null },
          { key: 'fire-4', frame: null },
          { key: 'fire-5', frame: null },
          { key: 'fire-6', frame: null },
          { key: 'fire-7', frame: null },
          { key: 'fire-8', frame: null },
          { key: 'fire-9', frame: null },
          { key: 'fire-10', frame: null },
        ],
        yoyo: true,
        frameRate: 18,
      };
      this.firAnimDur = (this.scene.anims.create(fireAnimConfig) as Phaser.Animations.Animation).duration;

      const wizardFireAnimConfig: Phaser.Types.Animations.Animation = {
        key: 'fire-wizard',
        frames: [
          { key: 'wizard-0', frame: null },
          { key: 'wizard-1', frame: null },
          { key: 'wizard-2', frame: null },
          { key: 'wizard-3', frame: null },
          { key: 'wizard-4', frame: null },
          { key: 'wizard-5', frame: null },
          { key: 'wizard-6', frame: null },
          { key: 'wizard-5', frame: null },
          { key: 'wizard-6', frame: null },
          { key: 'wizard-5', frame: null },
          { key: 'wizard-6', frame: null },
          { key: 'wizard-5', frame: null },
          { key: 'wizard-6', frame: null },
          { key: 'wizard-5', frame: null },
          { key: 'wizard-6', frame: null },
        ],
        yoyo: true,
        frameRate: 18,
      };
      this.scene.anims.create(wizardFireAnimConfig);
    }

    setStaffAttackCb(cb: () => void): void {
      this.onStaffAttackCb = cb;
    }

    setFireAttackCb(cb: () => void): void {
      this.onFireAttackCb = cb;
    }

    chooseWeapon = (weaponType: WizardWeapon): void => {
      if (weaponType === WizardWeapon.Fire && this.isFireAvailable) {
        this.chosenWeapon = weaponType;
        this.isFireAvailable = false;
        setTimeout(() => { this.isFireAvailable = true; }, 10000);
      } else if (weaponType === WizardWeapon.Staff) {
        this.chosenWeapon = weaponType;
      }
    }

    onActionBtnPress = (): void => {
      if (this.killed || this.isDuringAttack) {
        return;
      }

      if (this.chosenWeapon === WizardWeapon.Fire) {
        this.onFireAttack();
      } else if (this.chosenWeapon === WizardWeapon.Staff) {
        this.onStaffAttack();
      }
    }

    onFireAttack(): void {
      this.isDuringAttack = true;

      this.sprite.anims.play('fire-wizard');

      setTimeout(() => {
        this.fire = this.scene.add.sprite(0, this.sprite.y + 35, 'fire-5');
        if (this.facing === 'right') {
          this.fire.setScale(-5);
          this.fire.setX(this.sprite.x + 70 + this.fire.displayWidth / 2);
        } else if (this.facing === 'left') {
          this.fire.setScale(5);
          this.fire.setX(this.sprite.x - 70 - this.fire.displayWidth / 2);
        }
        this.fire.anims.play('fire-hit');

        setTimeout(() => {
          this.onFireAttackCb();
        }, this.firAnimDur);

        setTimeout(() => {
          this.fire.destroy();
          this.sprite.anims.play('wizard-walk');
          this.isDuringAttack = false;
          this.chooseWeapon(WizardWeapon.Staff);
        }, this.firAnimDur * 2);
      }, 500);
    }

    onStaffAttack = (): void => {
      this.isDuringAttack = true;
      this.sprite.anims.play('staff-hit');
      setTimeout(() => {
        this.isDuringAttack = false;
        this.sprite.anims.play('wizard-walk');
      }, this.staffHitDur);

      this.onStaffAttackCb();
    }

    handleMovement(): void {
      let velocityX = 0;
      const speed = 150;

      if (this.isDuringAttack) {
        this.body.velocity.x = 0;
        return;
      }

      if (this.keyLeft.isDown) {
        velocityX -= speed;
      }

      if (this.keyRight.isDown) {
        velocityX += speed;
      }

      if (velocityX > 0) {
        this.facing = 'right';
        this.sprite.scaleX = -Math.abs(this.sprite.scaleX);
      } else if (velocityX < 0) {
        this.facing = 'left';
        this.sprite.scaleX = Math.abs(this.sprite.scaleX);
      }

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

    kill(): void {
      this.sprite.destroy();
      this.staffRangeCollider.destroy();
      this.killed = true;
    }
}
