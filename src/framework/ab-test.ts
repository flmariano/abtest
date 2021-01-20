import { AbTestsContext } from "./ab-tests-context";
import { AbTestsCount, AbTestsCounterMetric, AbTestsMetric, AbTestsTimespanMetric, MetricType } from "./ab-tests-metric";
import { AbTestsConfig } from "./ab-tests.module";

export class AbTest {

    private metrics = new Map<string, AbTestsMetric>();

    constructor(
        public testName: string,
        public version: string,
        public context: AbTestsContext,
        public config: AbTestsConfig
    ) { }


    addMetric(metricName: string, type: MetricType) {
        if (type == "counter") {
            this.metrics[metricName] = new AbTestsCounterMetric(metricName);
        } else {
            this.metrics[metricName] = new AbTestsTimespanMetric(metricName);
        }
    }

    getMetric(metricName: string): AbTestsCounterMetric {
        return this.metrics[metricName];
    }

    getMetrics(): Map<string, AbTestsMetric> {
        return this.metrics;
    }

    addCount(metricName: string, name?: string) {
        let m = this.metrics[metricName];

        if (m) {
            // let prevTimes: AbTestsCounter = m.content[m.content.length - 1];

            // if (prevTimes && prevTimes.timeInterval) {
            //   this._defaultAbTest.metrics[metricName].content.push(new AbTestsCount(name ? name : undefined, performance.now() - prevTimes.timeInterval));
            // } else {
            //   this._defaultAbTest.metrics[metricName].content.push(new AbTestsCount(name ? name : undefined, performance.now()));
            // }
            this.metrics[metricName].content.push(new AbTestsCount(name ? name : undefined, performance.now()));
        } else {
            throw Error("no counter of that name");
        }
    }
    


}