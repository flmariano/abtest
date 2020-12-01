import { AbTimer } from "./ab-timer";

export class AbTestsContext {
    public timers?: Map<string, AbTimer>;

    constructor(
        public version: string,
        public scope: string,
        public loadTime?: number,
        public device?: string,
        public timeOnPage?: number) {
            this.timers = new Map<string, AbTimer>();
        }
         
}