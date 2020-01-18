import { GameObjects } from 'phaser';

type Bodyish = GameObjects.Sprite | GameObjects.Rectangle

export function intersectsInX(spriteA: Bodyish, spriteB: Bodyish): boolean {
  return spriteA.x + spriteA.displayWidth / 2 >= spriteB.x - spriteB.displayWidth / 2
        && spriteA.x - spriteA.displayWidth / 2 <= spriteB.x + spriteB.displayWidth / 2;
}
