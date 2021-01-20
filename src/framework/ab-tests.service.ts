import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { AbTest } from "./ab-test";
import { AbTestsContext } from "./ab-tests-context";
import { CONFIG } from "./ab-tests-injection-token";
import { AbTestsConfig } from "./ab-tests.module";
import { LocalStorageHandler } from "./local-storage-handler";
import { uuid } from "./utilities";

const AB_SERVER_URL = "http://localhost:3000/";
const AB_SERVER_HEADERS = { headers: { "Access-Control-Allow-Origin": "*" } };

@Injectable()
export class AbTestsService {
    private _sessionId: string;

    private _abTests: AbTest[] = [];

    constructor(
        @Inject(CONFIG) configs: AbTestsConfig[],
        private _localStorageHandler: LocalStorageHandler,
        private _httpClient: HttpClient,
        private _deviceDetector: DeviceDetectorService
    ) {
        this._sessionId = uuid();

        if (configs[0] == undefined) {
            console.error("configs[0] is undefined");
        }

        this.generateTests(configs);
    }

    getAbTest(name: string): AbTest {
        let res = this._abTests.find((t) => {
            if (t.testName == name) return t;
        });
        return res;
    }

    save(test: AbTest): string {
        let s = this.serializeTest(test);

        // console.log(s);

        
        // this._httpClient.post(AB_SERVER_URL + "measurements/", s, AB_SERVER_HEADERS).subscribe(
        //     x => {
        //         console.log("response: " + x);
        //     })

        return s;
    }

    private serializeTest(test: AbTest): string {
        return JSON.stringify({
            sessionId: this._sessionId,
            testName: test.testName,
            version: test.version,
            context: test.context,
            metrics: test.getMetrics()
        });

    }

    private generateTests(configs: AbTestsConfig[]): void {
        for (let config of configs) {
            let testName = config.testName;
            let ver = "";

            // let storage = this._localStorageHandler.get(testName);
            let storage = false;
            if (storage) {
                ver = storage;
            } else {
                ver = this.selectVersion(config);
                this._localStorageHandler.set(testName, ver);
            }

            let context = new AbTestsContext(/* ver, testName, */ this._deviceDetector.deviceType);
            let test = new AbTest(testName, ver, context, config);
            this._abTests.push(test);
        }
    }

    private selectVersion(config: AbTestsConfig): string {
        let sumOfWeights = 0;
        let numOfWeightless = 0;

        for (let c in config.versions) {
            let weight = config.versions[c].weight;
            if (weight) {
                sumOfWeights += weight;
            } else {
                numOfWeightless++;
            }
        }

        if (sumOfWeights > 100) {
            throw new Error("sum of weights exceeds 100 before filling");
        }

        for (let c in config.versions) {
            if (!config.versions[c].weight) {
                if (numOfWeightless === 0) break;

                let newWeight = (100 - sumOfWeights) / numOfWeightless;
                config.versions[c].weight = newWeight;

                sumOfWeights += newWeight;
                numOfWeightless--;
            }
        }

        if (Math.abs(100 - sumOfWeights) > 0.01) { // sumOfWeights should always be exactly 100 but there might be an unexpected error
            if (sumOfWeights > 100) {
                throw new Error("sum of weights exceeds 100 after filling");
            } else if (sumOfWeights < 100) {
                throw new Error("sum of weights still below 100 after filling");
            }
        }

        const r = Math.random() * 100;
        let sum = 0, c;
        for (c in config.versions) {
            sum += config.versions[c].weight;
            if (r < sum) break;
        }

        return config.versions[c].name;
    }

    public sendArrivalData(test: AbTest): void {
        let body = {
            sessionId: this._sessionId,
            testName: test.testName,
            version: test.version,
            context: test.context,
            arrivalTime: Date.now()
        }

        // this._httpClient.post(AB_SERVER_URL + "arrivals/", body).subscribe(
        //     x => {
        //         console.log("response: " + x);
        //     })
    }

    // private _context: AbTestsContext;

    // constructor(
    //     @Inject(CONFIG) configs: AbTestsOptions[],
    //     private _localStorageHandler: LocalStorageHandler,
    //     private _httpClient: HttpClient,
    //     deviceDetector: DeviceDetectorService
    // ) {
    //     if (configs[0] == undefined) {
    //         console.error("configs[0] is undefined");
    //     }
    //     this._config = configs[0];  // change to be able have multiple

    //     this._context = this.getRandomContext(this._config);
    //     this._sessionId = uuid();

    //     let ver = this.getVersion();
    //     // if (!ver) {
    //     if (true) { // testcode
    //         this.setVersion(this._context.name);
    //     } else {
    //         this._context.name = ver.toString();
    //     }

    //     this._context.deviceType = deviceDetector.deviceType;
    //     this.setLoadTime(performance.now());
    //     this.sendArrivalData();
    // }

    // // ngOnDestroy(): void {
    // //     this.saveMeasurements();
    // // }

    // public getVersion(): string {
    //     let name = this._localStorageHandler.get("name");
    //     return name;
    // }

    // public setVersion(name: string) {
    //     this._localStorageHandler.set("name", name);
    //     var h = this._localStorageHandler.get("verhistory");
    //     this._localStorageHandler.set("verhistory", (h ? (h + ", ") : "") + name);
    //     return;
    // }

    // public startTimer(timerName: string) {
    //     if (this._context.timers.has(timerName)) {
    //         this._context.timers.get(timerName).reset();
    //     } else {
    //         let timer = new AbTimer();
    //         this._context.timers.set(timerName, timer);
    //     }
    // }

    // public getTimerValue(timerName: string): number {
    //     if (this._context.timers.has(timerName)) {
    //         return this._context.timers.get(timerName).getTime();
    //     } else {
    //         // console.error("getTimerValue failed: timer " + timerName + " doesn't exist");
    //         return 0;
    //     }
    // }

    // public getTimerStartTime(timerName: string): number {
    //     if (this._context.timers.has(timerName)) {
    //         return this._context.timers.get(timerName).getStartTime();
    //     } else {
    //         throw Error("getTimerStartTime failed: timer " + timerName + " doesn't exist");
    //     }
    // }

    // public saveMeasurements(timerNames?: string[]): void {
    //     let times = new Map<string, number>();

    //     if (timerNames) {
    //         for (let i in timerNames) {
    //             let timerName = timerNames[i];

    //             if (!this._context.timers.has(timerName)) {
    //                 throw Error("saveMeasurement failed: timer " + timerName + " doesn't exist");
    //             }

    //             let timer = this._context.timers.get(timerName);
    //             times.set(timerName, timer.getTime());
    //         }
    //     } else {
    //         for (let i in this._context.timers) {
    //             times.set(i, this._context.timers.get(i).getTime());
    //         }
    //     }


    //     // let oldString = this._localStorageHandler.get("measurements");
    //     // this._localStorageHandler.set("measurements", oldString ? oldString + ", " + time : time.toString());

    //     this.sendMeasurement(times);
    // }

    // private sendMeasurement(times: Map<string, number>): void {
    //     let measurements = {};

    //     times.forEach((value, key) => (measurements[key] = value));

    //     let body = {
    //         sessionId: this._sessionId,
    //         name: this._context.name,
    //         testName: this._context.testName,
    //         measurements: measurements,
    //         loadTime: this._context.loadTime,
    //     }

    //     this._httpClient.post(AB_SERVER_URL + "measurements/", body).subscribe(
    //         x => {
    //             console.log("response: " + x);
    //         })
    // }



    // public shouldRender(versions: string[]): boolean {
    //     return versions.indexOf(this._context.name) > -1;
    // }

    // private getRandomContext(config: AbTestsOptions): AbTestsContext {
    //     let sumOfWeights = 0;
    //     let numOfWeightless = 0;

    //     for (let c in config.versions) {
    //         let weight = config.versions[c].weight;
    //         if (weight) {
    //             sumOfWeights += weight;
    //         } else {
    //             numOfWeightless++;
    //         }
    //     }

    //     if (sumOfWeights > 100) {
    //         throw new Error("sum of weights exceeds 100 before filling");
    //     }

    //     for (let c in config.versions) {
    //         if (!config.versions[c].weight) {
    //             if (numOfWeightless === 0) break;

    //             let newWeight = (100 - sumOfWeights) / numOfWeightless;
    //             config.versions[c].weight = newWeight;

    //             sumOfWeights += newWeight;
    //             numOfWeightless--;
    //         }
    //     }

    //     if (Math.abs(100 - sumOfWeights) > 0.01) { // sumOfWeights should always be exactly 100 but there might be an unexpected error
    //         if (sumOfWeights > 100) {
    //             throw new Error("sum of weights exceeds 100 after filling");
    //         } else if (sumOfWeights < 100) {
    //             throw new Error("sum of weights still below 100 after filling");
    //         }
    //     }

    //     const r = Math.random() * 100;
    //     let sum = 0, c;
    //     for (c in config.versions) {
    //         sum += config.versions[c].weight;
    //         if (r < sum) break;
    //     }

    //     let context = config.versions[c];
    //     return new AbTestsContext(context.name, config.testName);
    // }

    // public getContextInfo(name?: string): AbTestsContext {
    //     if (name == this._context.name || !name) return this._context;
    //     else {
    //         for (let i in this._config.versions) {
    //             let c = this._config.versions[i];
    //             if (c.name == name) return {...c, testName: this._config.testName};
    //         }
    //     }
    // }

    // public setLoadTime(time: number): void {
    //     this._context.loadTime = time;
    // }

    // public getLoadTime(): number {
    //     return this._context.loadTime;
    // }

    // getAbTest


    // restructuring

    // scopes and configs
    // generally more context
    // path of mouse pointer maybe

    // done-ish:
    // multiple measurements at once
    // render duration and how it affects the user
    // device of user
    // conversion rate (can probably just calculate based on arrivals vs measurements)
}