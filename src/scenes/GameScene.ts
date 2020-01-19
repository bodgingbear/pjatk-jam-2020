import { Wizard } from '../objects/Wizard';
import { Monster, MonsterType } from '../objects/Monster';
import { intersects } from '../utils/intersects';
import { MonstersScheduler } from '../objects/MonstersScheduler';
import { Score } from '../objects/Score';

export default class GameScene extends Phaser.Scene {
  wizard: Wizard

  monsters: Monster[]

  monstersScheduler: MonstersScheduler

  score: Score

  overlay: Phaser.GameObjects.Image

  stuffDeathSound: Phaser.Sound.BaseSound[]

  fireSound: Phaser.Sound.BaseSound

  fireDeath: Phaser.Sound.BaseSound

  deathSound: Phaser.Sound.BaseSound


  public constructor() {
    super({
      key: 'GameScene',
    });

    this.monsters = [];
  }

  create(): void {
    this.add.image(1280 / 2, 720 / 2, 'bg').setScale(5);
    this.overlay = this.add.image(1280 / 2, 720 / 2, 'overlay');
    this.overlay.setAlpha(0);
    this.setupMusic();
    this.loadSounds();

    const textStrings = ['Use A/D to move', 'Use Space to fight', 'Use 1/2 to change weapons'];
    const startingY = 70;
    const yStep = 40;

    const texts = textStrings.map((t, i) => {
      const text = this.add.text(
        1280 / 2,
        startingY + yStep * i,
        t,
        {
          fontFamily: 'Pixel miners',
          fontSize: '24px',
          align: 'center',
        },
      );

      text.setX(text.x - text.width / 2);

      return text;
    });

    setTimeout(() => {
      this.tweens.add({
        targets: texts,
        alpha: { from: 1, to: 0 },
        ease: 'Linear',
        duration: 200,
        repeat: 0,
        yoyo: false,
      });
    }, 4000);

    this.wizard = new Wizard(this);

    this.score = new Score(this);

    this.wizard.setStaffAttackCb(this.onWizardStuffAttack);
    this.wizard.setFireAttackCb(this.onWizardFireAttack);

    this.monstersScheduler = new MonstersScheduler();
    this.monstersScheduler.setSpawnCb(this.spawnMonster);
    this.monstersScheduler.start();
  }

  setupMusic(): void {
    const music = this.sound.add('theme');
    const loopMarker = {
      name: 'loop',
      start: 0,
      config: {
        loop: true,
        volume: 0.1,
      },

    };

    music.addMarker(loopMarker);
    music.play('loop');
  }

  loadSounds(): void {
    this.stuffDeathSound = [
      this.sound.add('staff-death-1'),
      this.sound.add('staff-death-2'),
      this.sound.add('staff-death-0'),
    ];

    this.fireSound = this.sound.add('fire-sound');
    this.fireDeath = this.sound.add('fire-death');

    this.deathSound = this.sound.add('wizard-death');
  }

  onWizardStuffAttack = (): void => {
    const wizardX = this.wizard.sprite.x;
    this.monsters.sort((a, b) => Math.abs(b.sprite.x - wizardX) - Math.abs(a.sprite.x - wizardX));

    let monsterToKill = null;
    for (let i = 0; i < this.monsters.length; i += 1) {
      if (intersects(this.wizard.staffRangeCollider, this.monsters[i].sprite) && this.wizard.isFacing(this.monsters[i].sprite)) {
        monsterToKill = this.monsters[i];
        this.monsters.splice(i, 1);
        break;
      }
    }

    if (monsterToKill) {
      monsterToKill.kill();
      this.score.addScore();
      this.stuffDeathSound[Math.floor(Math.random() * this.stuffDeathSound.length)].play();
    }
  }

  onWizardFireAttack = (): void => {
    this.fireSound.play();

    this.monsters = this.monsters.filter((monster) => {
      if (intersects(this.wizard.fire, monster.sprite)) {
        this.fireDeath.play();
        monster.kill();
        this.score.addScore();
        return false;
      }
      return true;
    });
  }

  spawnMonster = (monsterType: MonsterType): void => {
    const monster = new Monster(this, this.wizard.sprite, monsterType, this.monstersScheduler.monstersScheduled > 20 ? 120 : 90);
    this.monsters.push(monster);
  }

  update(): void {
    this.wizard.update();

    for (let i = 0; i < this.monsters.length; i += 1) {
      const monster = this.monsters[i];
      monster.update();

      if (intersects(monster.sprite, this.wizard.sprite, 50)) {
        this.deathSound.play();
        this.endGame();
        break;
      }
    }
  }

  endGame(): void {
    this.wizard.kill();
    this.monstersScheduler.stop();

    this.add.tween({
      targets: this.overlay,
      alpha: 0.7,
      duration: 1500,
      ease: Phaser.Math.Easing.Linear.Linear,
    });

    setTimeout(() => {
      this.monsters.forEach((monster) => monster.kill());
      this.monsters = [];

      this.add.text(
        1280 / 2,
        720 / 2 + 100,
        'Press any key to play again.',
        {
          fontFamily: 'Pixel miners',
          fontSize: '24px',
        },
      )
        .setOrigin(0.5);

      this.input.keyboard.on('keydown', () => {
        window.location.assign('?reload=true');
      });

      this.score.center();
    }, 1500);
  }
}
