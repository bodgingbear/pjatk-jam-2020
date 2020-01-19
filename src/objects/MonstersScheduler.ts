import { MonsterType } from './Monster';

type SpawnCb = (monsterType: MonsterType) => void

export class MonstersScheduler {
    onSpawnCb: SpawnCb

    monstersScheduled: number

    timeoutRefs: NodeJS.Timeout[]

    stopped: boolean

    constructor() {
      this.monstersScheduled = 0;
      this.stopped = false;
      this.timeoutRefs = [];
    }

    setSpawnCb(cb: SpawnCb): void {
      this.onSpawnCb = cb;
    }

    start = (): void => {
      this.timeoutRefs.shift();

      if (this.stopped) {
        return;
      }
      const monsterType = Math.random() > 0.5 ? MonsterType.Falling : MonsterType.Ground;

      this.onSpawnCb(monsterType);
      this.monstersScheduled += 1;
      const nextTime = this.getNextSchedulingTime();

      this.timeoutRefs.push(setTimeout(this.start, nextTime));
    }

    getNextSchedulingTime(): number {
      let nextTime = 1300;

      if (this.monstersScheduled < 50) {
        nextTime += Math.max((50 - this.monstersScheduled) / 50, 0) * 1200;
      } else {
        nextTime = 800;
        nextTime += Math.max((100 - (this.monstersScheduled - 50)) / 100, 0) * 500;
      }

      return nextTime;
    }

    stop(): void {
      this.stopped = true;

      for (let i = 0; i < this.timeoutRefs.length; i += 1) {
        clearTimeout(this.timeoutRefs[i]);
      }
      this.timeoutRefs = [];
    }
}
