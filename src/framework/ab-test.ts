import { AbTestsContext } from "./ab-tests-context";
import { AbTestsMetric } from "./ab-tests-metric";
import { AbTestsConfig } from "./ab-tests.module";

export class AbTest {
    // public name: string;
    // public version: string;

    public metrics: AbTestsMetric[];
    // public context: AbTestsContext;
    // public config: AbTestsOptions;

    constructor(
        public testName: string,
        public version: string,
        public context: AbTestsContext,
        public config: AbTestsConfig
    ) {}


}