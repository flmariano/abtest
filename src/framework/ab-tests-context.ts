import { AbTimer } from "./ab-timer";

export class AbTestsContext {
    public timers?: Map<string, AbTimer>;

    constructor(
        public version: string,
        public scope: string,
        public loadTime?: number,
        public deviceType?: string,
        public weight?: number) {
            this.timers = new Map<string, AbTimer>();
        }
         
}