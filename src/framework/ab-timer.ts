export class AbTimer {
    private start = performance.now();
  
    // constructor(private readonly name: string) {}
  
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