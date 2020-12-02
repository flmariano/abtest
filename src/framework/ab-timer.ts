export class AbTimer {
    constructor(private start?: number) {
      this.start = start || performance.now();
    }
  
    public getTime(): number {
      const time = performance.now() - this.start;
      console.log("Timer: ", "[name]", " measured at ", Math.round(time), "ms");
      return time;
    }

    public reset(): void {
      this.start = performance.now();
    }

    public getStartTime(): number {
      return this.start;
    }
}