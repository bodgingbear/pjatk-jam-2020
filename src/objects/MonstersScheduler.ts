import { MonsterType } from './Monster';

type SpawnCb = (monsterType: MonsterType) => void

export class MonstersScheduler {
    onSpawnCb: SpawnCb

    monstersScheduled: number

    timeoutRef: NodeJS.Timeout

    constructor() {
      this.monstersScheduled = 0;
    }

    setSpawnCb(cb: SpawnCb): void {
      this.onSpawnCb = cb;
    }

    start = (): void => {
      const monsterType = Math.random() > 0.5 ? MonsterType.Falling : MonsterType.Ground;

      this.onSpawnCb(monsterType);
      this.monstersScheduled += 1;
      const nextTime = this.getNextSchedulingTime();

      this.timeoutRef = setTimeout(this.start, nextTime);
    }

    getNextSchedulingTime(): number {
      return 3000 + Math.max((10 - this.monstersScheduled) / 10, 0) * 3000;
    }
}
