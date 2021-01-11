export type AbTestsMetricType = "timespan" | "conversionRate";

export class AbTestsMetric {
    constructor(
        public name: string,
        public type: AbTestsMetricType,
        public content?: string | number
        ) {

    }

    public toString(): string {
        let res = "";
        res = JSON.stringify({
            name: this.name,
            type: this.type,
            content: this.content
        });
        return res;
    }
}