import { GameObjects } from 'phaser';

type Bodyish = GameObjects.Sprite | GameObjects.Rectangle

export function intersectsInX(spriteA: Bodyish, spriteB: Bodyish, customWidth?: number): boolean {
  return spriteA.x + spriteA.displayWidth / 2 >= spriteB.x - (customWidth || spriteB.displayWidth) / 2
        && spriteA.x - spriteA.displayWidth / 2 <= spriteB.x + (customWidth || spriteB.displayWidth) / 2;
}

export function intersectsInY(spriteA: Bodyish, spriteB: Bodyish): boolean {
  return spriteA.y + spriteA.displayHeight / 2 >= spriteB.y - spriteB.displayHeight / 2
    && spriteA.y - spriteA.displayHeight / 2 <= spriteB.y + spriteB.displayHeight / 2;
}

export function intersects(spriteA: Bodyish, spriteB: Bodyish, customWidth?: number): boolean {
  return intersectsInX(spriteA, spriteB, customWidth) && intersectsInY(spriteA, spriteB);
}
