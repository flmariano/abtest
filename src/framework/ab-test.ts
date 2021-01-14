import { AbTestsContext } from "./ab-tests-context";
import { AbTestsMetric } from "./ab-tests-metric";
import { AbTestsConfig } from "./ab-tests.module";

export class AbTest {

    public metrics = new Map<string, AbTestsMetric>();

    constructor(
        public testName: string,
        public version: string,
        public context: AbTestsContext,
        public config: AbTestsConfig
    ) {}


    // addMetric(name: string, ) {

    // }


}