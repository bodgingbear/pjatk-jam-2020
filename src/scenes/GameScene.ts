import { Wizard } from '../objects/Wizard';
import { Monster } from '../objects/Monster';
import { intersectsInX } from '../utils/intersects';
import { MonstersScheduler } from '../objects/MonstersScheduler';

export default class GameScene extends Phaser.Scene {
  wizard: Wizard

  monsters: Monster[]

  monstersScheduler: MonstersScheduler

  public constructor() {
    super({
      key: 'MainMenuScene',
    });

    this.monsters = [];
  }

  create(): void {
    this.add.image(1280 / 2, 720 / 2, 'bg').setScale(5);

    this.wizard = new Wizard(this);

    this.wizard.setStaffAttackCb(this.wizardTryAttackMonsters);

    this.monstersScheduler = new MonstersScheduler();
    this.monstersScheduler.setSpawnCb(this.spawnMonster);
    this.monstersScheduler.start();
  }

  wizardTryAttackMonsters = (): void => {
    let monsterToKill = null;
    for (let i = 0; i < this.monsters.length; i += 1) {
      monsterToKill = this.monsters[i];
      if (intersectsInX(this.wizard.staffRangeCollider, monsterToKill.sprite) && this.wizard.isFacing(monsterToKill.sprite)) {
        this.monsters.splice(i, 1);
        break;
      }
    }

    if (monsterToKill) {
      monsterToKill.kill();
    }
  }

  spawnMonster = (): void => {
    const monster = new Monster(this, this.wizard.sprite);
    this.monsters.push(monster);
    // COLL this.physics.add.overlap(monster.sprite, this.wizard.sprite, this.onMonsterCollision);
  }

  // COLL onMonsterCollision = (monsterSprite, otherBodySprite): void => {
  //   console.log('collision');
  //   if (otherBodySprite === this.wizard.sprite) {
  //     this.wizard.kill();
  //   }
  // }

  update(): void {
    this.wizard.update();

    this.monsters.forEach((monster) => {
      monster.update();

      if (intersectsInX(monster.sprite, this.wizard.sprite)) {
        this.wizard.kill();
      }
    });
  }
}
