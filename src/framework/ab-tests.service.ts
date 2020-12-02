import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { AbTestsContext } from "./ab-tests-context";
import { CONFIG } from "./ab-tests-injection-token";
import { AbTestsOptions } from "./ab-tests.module";
import { AbTimer } from "./ab-timer";
import { LocalStorageHandler } from "./local-storage-handler";

const AB_SERVER_URL = "http://localhost:3000/";

@Injectable()
export class AbTestsService {
    private _config: AbTestsOptions;
    private _context: AbTestsContext;

    constructor(
        @Inject(CONFIG) configs: AbTestsOptions[],
        private _localStorageHandler: LocalStorageHandler,
        private _httpClient: HttpClient,
        deviceDetector: DeviceDetectorService
    ) {
        if (configs[0] == undefined) {
            console.error("configs[0] is undefined");
        }
        this._config = configs[0];  // change to be able have multiple

        this._context = this.getRandomContext(this._config);

        let ver = this.getVersion();
        // if (!ver) {
        if (true) { // testcode
            this.setVersion(this._context.version);
        } else {
            this._context.version = ver.toString();
        }

        this._context.deviceType = deviceDetector.deviceType;
        this.setLoadTime(performance.now());
        this.sendArrivalData();
    }

    // ngOnDestroy(): void {
    //     this.saveMeasurements();
    // }

    public getVersion(): string {
        let version = this._localStorageHandler.get("version");
        return version;
    }

    public setVersion(version: string) {
        this._localStorageHandler.set("version", version);
        var h = this._localStorageHandler.get("verhistory");
        this._localStorageHandler.set("verhistory", (h ? (h + ", ") : "") + version);
        return;
    }

    public startTimer(timerName: string) {
        if (this._context.timers.has(timerName)) {
            this._context.timers.get(timerName).reset();
        } else {
            let timer = new AbTimer();
            this._context.timers.set(timerName, timer);
        }
    }

    public getTimerValue(timerName: string): number {
        if (this._context.timers.has(timerName)) {
            return this._context.timers.get(timerName).getTime();
        } else {
            // console.error("getTimerValue failed: timer " + timerName + " doesn't exist");
            return 0;
        }
    }

    public getTimerStartTime(timerName: string): number {
        if (this._context.timers.has(timerName)) {
            return this._context.timers.get(timerName).getStartTime();
        } else {
            throw Error("getTimerStartTime failed: timer " + timerName + " doesn't exist");
        }
    }

    public saveMeasurements(timerNames?: string[]): void {
        let times = new Map<string, number>();

        if (timerNames) {
            for (let i in timerNames) {
                let timerName = timerNames[i];

                if (!this._context.timers.has(timerName)) {
                    throw Error("saveMeasurement failed: timer " + timerName + " doesn't exist");
                }

                let timer = this._context.timers.get(timerName);
                times.set(timerName, timer.getTime());
            }
        } else {
            for (let i in this._context.timers) {
                times.set(i, this._context.timers.get(i).getTime());
            }
        }


        // let oldString = this._localStorageHandler.get("measurements");
        // this._localStorageHandler.set("measurements", oldString ? oldString + ", " + time : time.toString());

        this.sendMeasurement(times);
    }

    private sendMeasurement(times: Map<string, number>): void {
        let measurements = {};

        times.forEach((value, key) => (measurements[key] = value));

        let body = {
            version: this._context.version,
            scope: this._context.scope,
            measurements: measurements,
            loadTime: this._context.loadTime,
        }

        this._httpClient.post(AB_SERVER_URL + "measurements/", body).subscribe(
            x => {
                console.log("response: " + x);
            })
    }

    private sendArrivalData(): void {
        let body = {
            version: this._context.version,
            scope: this._context.scope,
            loadTime: this._context.loadTime,
            deviceType: this._context.deviceType,
            arrivalTime: Date.now()
        }

        this._httpClient.post(AB_SERVER_URL + "arrivals/", body).subscribe(
            x => {
                console.log("response: " + x);
            })
    }

    public shouldRender(versions: string[]): boolean {
        return versions.indexOf(this._context.version) > -1;
    }

    private getRandomContext(config: AbTestsOptions): AbTestsContext {
        let sumOfWeights = 0;
        let numOfWeightless = 0;
        let versions = [];

        for (let context in config.contexts) versions.push(config.contexts[context].version);
        config = this.filterWeights(versions, config);

        for (let i = 0; i < versions.length; i++) {
            let weight = config.weights[versions[i]];
            if (weight) {
                sumOfWeights += weight;
            } else {
                numOfWeightless++;
            }
        }

        if (sumOfWeights > 100) {
            // console.error("sum of weights exceeds 100 before filling");
            throw new Error("sum of weights exceeds 100 before filling");
        }

        for (let i = 0; i < versions.length; i++) {
            if (!config.weights[versions[i]]) {
                if (numOfWeightless === 0) break;

                let newWeight = (100 - sumOfWeights) / numOfWeightless;
                config.weights[versions[i]] = newWeight;

                sumOfWeights += newWeight;
                numOfWeightless--;
            }
        }

        if (Math.abs(100 - sumOfWeights) > 0.01) { // sumOfWeights should always be exactly 100 but there might be a rounding error
            if (sumOfWeights > 100) {
                // console.error("sum of weights exceeds 100 after filling");
                throw new Error("sum of weights exceeds 100 after filling");
            } else if (sumOfWeights < 100) {
                // console.error("sum of weights still below 100 after filling");
                throw new Error("sum of weights still below 100 after filling");
            }
        }

        const r = Math.random() * 100;
        let sum = 0, i;
        for (i in config.weights) {
            sum += config.weights[i];
            if (r < sum) break;
        }

        for (let c in config.contexts) {
            let context = config.contexts[c];
            if (context.version == i) {
                return new AbTestsContext(context.version, context.scope);
            }
        }

        throw Error("no context selected");
    }

    private filterWeights(versions: string[], config: AbTestsOptions): AbTestsOptions {
        for (let i in config.weights) {
            if (!versions.includes(i)) delete config.weights[i]; // removes extraneous element
        }
        return config;
    }

    public getContextInfo(version?: string): AbTestsContext {
        if (version == this._context.version || !version) return this._context;
        else {
            for (let i in this._config.contexts) {
                let c = this._config.contexts[i];
                if (c.version == version) return c;
            }
        }
    }

    public setLoadTime(time: number): void {
        this._context.loadTime = time;
    }

    public getLoadTime(): number {
        return this._context.loadTime;
    }

    // device des users
    // allgemein mehr kontext
    // conversion rate   
    // pfad des mauszeigers evtl.

    // done-ish:
    // mehrere measurements auf einmal
    // dauer des renderns einer komponente und wie das den kunden beeinflusst
}