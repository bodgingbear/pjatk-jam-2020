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
      return 3000 + Math.max((10 - this.monstersScheduled) / 10, 0) * 3000;
    }

    stop(): void {
      this.stopped = true;

      for (let i = 0; i < this.timeoutRefs.length; i += 1) {
        console.log(this.timeoutRefs[i]);
        clearTimeout(this.timeoutRefs[i]);
      }
      this.timeoutRefs = [];
    }
}
