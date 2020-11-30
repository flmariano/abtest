class ABTimer {
    readonly start = performance.now();
  
    constructor(private readonly name: string) {}
  
    stop(): number {
      const time = performance.now() - this.start;
      console.log('Timer:', this.name, 'finished in', Math.round(time), 'ms');
      return time;
    }
}