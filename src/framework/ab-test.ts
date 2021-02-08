import { AbTestsContext } from "./ab-tests-context";
import { AbTestsCounterMetric, AbTestsMetric, AbTestsTimespanMetric, MetricType } from "./ab-tests-metric";
import { AbTestsConfig } from "./ab-tests.module";

export class AbTest {

    private metrics = new Map<string, AbTestsMetric>(); // maybe make list

    constructor(
        public readonly testName: string,
        public readonly version: string,
        public readonly context: AbTestsContext,
        public readonly config: AbTestsConfig
    ) { }


    addTimerMetric(metricName: string, time: number) {
        this.metrics[metricName] = new AbTestsTimespanMetric(metricName, Math.round(time));
    }

    addCounterMetric(metricName: string, initialCount?: number) {
        this.metrics[metricName] = new AbTestsCounterMetric(metricName, Math.round(initialCount));
    }

    getMetric(metricName: string): AbTestsCounterMetric {
        return this.metrics[metricName];
    }

    getMetrics(): Map<string, AbTestsMetric> {
        return this.metrics;
    }

    incrementCounter(metricName: string) {
        let m = this.metrics[metricName];

        // test if countermetric
        if (m) {
            this.metrics[metricName].content += 1;
        } else {
            throw Error("no counter of that name");
        }
    }

    // use other way
    // public serialize(serializer: IAbTestSerializer): any {

    // }
    
    // serialize method that implements serializer

}