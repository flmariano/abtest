export type MetricType = "timespan" | "counter";
 
export class AbTestsMetric {
    public context = new Map<string, any>();
    public content: any;

    constructor(public name: string) { }

    // is called on JSON.stringify
    public toJSON(): object {
        return { }
    }
}

export class AbTestsTimespanMetric extends AbTestsMetric {
    public content: number;

    constructor(public name: string, content?: number) {
        super(name);

        this.content = content ? content : 0;
    }

    public toJSON(): object {
        return {
            name: this.name,
            context: this.context,
            content: this.content
        }
    }
}

export class AbTestsCounterMetric extends AbTestsMetric {
    public content: AbTestsCount[] = [];

    constructor(public name: string) {
        super(name);
    }

    public toJSON(): object {
        return {
            name: this.name,
            content: this.content
        }
    }

    public addCount(name?: string, timeInterval?: number) {
        let c = new AbTestsCount(name, timeInterval);
        return this.content.push(c);
    }
}

export class AbTestsCount
{
    public name: string = "";
    public timeInterval: number = 0;

    constructor(
        name?: string,
        timeInterval?: number
    ) {
        this.name = name ? name : "";
        this.timeInterval = timeInterval ? timeInterval : 0;
    }
}