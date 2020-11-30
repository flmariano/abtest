export class AbTestsContext {

    constructor(
        public version: string,
        public scope: string,
        public loadTime?: number,
        public device?: string,
        public timeOnPage?: number) { }
}