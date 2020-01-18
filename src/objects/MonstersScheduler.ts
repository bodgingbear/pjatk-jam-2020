export class MonstersScheduler {
    onSpawnCb: () => void

    monstersScheduled: number

    timeoutRef: NodeJS.Timeout

    constructor() {
      this.monstersScheduled = 0;
    }

    setSpawnCb(cb: () => void): void {
      this.onSpawnCb = cb;
    }

    start = (): void => {
      this.onSpawnCb();
      this.monstersScheduled += 1;
      const nextTime = this.getNextSchedulingTime();

      this.timeoutRef = setTimeout(this.start, nextTime);
    }

    getNextSchedulingTime(): number {
      return 3000 + Math.max((10 - this.monstersScheduled) / 10, 0) * 3000;
    }
}
