import { AbTestsContext } from "./ab-tests-context";
import { AbTestsCounterMetric, AbTestsMetric, AbTestsTimespanMetric, MetricType } from "./ab-tests-metric";
import { AbTestsConfig } from "./ab-tests.module";

export class AbTest {

    private metrics = new Map<string, AbTestsMetric>();

    constructor(
        public testName: string,
        public version: string,
        public context: AbTestsContext,
        public config: AbTestsConfig
    ) { }


    addMetric(metricName: string, type: MetricType, content: number) {
        if (type === "counter") {
            this.metrics[metricName] = new AbTestsCounterMetric(metricName, Math.round(content));
        } else if (type === "timespan") {
            this.metrics[metricName] = new AbTestsTimespanMetric(metricName, Math.round(content));
        } else {
            throw Error("metric type doesn't exist.");
        }
    }

    getMetric(metricName: string): AbTestsCounterMetric {
        return this.metrics[metricName];
    }

    getMetrics(): Map<string, AbTestsMetric> {
        return this.metrics;
    }

    incrementCounter(metricName: string) {
        let m = this.metrics[metricName];

        if (m) {
            this.metrics[metricName].content += 1;
        } else {
            throw Error("no counter of that name");
        }
    }
    


}