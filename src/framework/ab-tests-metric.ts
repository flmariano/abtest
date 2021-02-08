export type MetricType = "timespan" | "counter";
 
export class AbTestsMetric {
    public context = new Map<string, any>();

    constructor(public name: string) { }

    // is called on JSON.stringify
    public toJSON(): object {
        return { }
    }
}

export class AbTestsTimespanMetric extends AbTestsMetric {
    public time: number;

    constructor(public name: string, content?: number) {
        super(name);

        this.time = content ? content : 0;
    }

    public toJSON(): object {
        return {
            // name: this.name,
            // context: this.context,
            type: "timespan",
            time: this.time
        }
    }
}

export class AbTestsCounterMetric extends AbTestsMetric {
    public count: number;

    constructor(public name: string, count?: number) {
        super(name);
        this.count = count ? count : 0;
    }

    public toJSON(): object {
        return {
            // name: this.name,
            type: "counter",
            count: this.count
        }
    }
}
