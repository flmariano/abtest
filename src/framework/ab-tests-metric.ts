export type AbTestsMetricType = "timespan" | "conversionRate";

export class AbTestsMetric {
    public name: string;
    public type: AbTestsMetricType;
    public content: string | number;

    public serialize(): string {
        let res = "";
        res = JSON.stringify({
            name: this.name,
            type: this.type,
            content: this.content
        });
        return res;
    }
}