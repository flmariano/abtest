import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { AbTestsContext } from "./ab-tests-context";
import { CONFIG } from "./ab-tests-injection-token";
import { AbTestsOptions } from "./ab-tests.module";
import { LocalStorageHandler } from "./local-storage-handler";

const AB_SERVER_URL = "http://localhost:3000/";

@Injectable()
export class AbTestsService implements OnDestroy {
    private _config: AbTestsOptions;
    private _context: AbTestsContext;

    private _time: number;
    private _timeDiff: number;
    private _running: boolean;
    private _intervalId;

    constructor(
        @Inject(CONFIG) configs: AbTestsOptions[],
        private _localStorageHandler: LocalStorageHandler,
        private _httpClient: HttpClient
        ) {
        if (configs[0] == undefined){
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
    }

    ngOnDestroy() {
        if (this._intervalId) clearInterval(this._intervalId);
    }

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

    public startMeasurement() {
        this._time = Date.now();
        this._timeDiff = 0;
        this._running = true;

        this._intervalId = setInterval(() => this.updateTimeDiff(), 1);
    }

    public updateTimeDiff() {
        if (this._running)
            this._timeDiff = Date.now() - this._time;
    }

    public getTimeDiff() {
        return this._timeDiff;
    }

    public stopMeasurement() { // start und stop reicht nicht
        if (this._running) {
            this._running = false;
            this.saveMeasurement();
        } else {
            console.warn("not _running")
        }
    }

    public saveMeasurement() {
        if (this._timeDiff == undefined) {
            console.error("can't save measurement before starting timer");
            return;
        }

        let oldString = this._localStorageHandler.get("measurements");

        this._localStorageHandler.set("measurements", oldString ? oldString + ", " + this._timeDiff : this._timeDiff.toString());
        this.sendMeasurement();
    }

    public sendMeasurement(): boolean {
        if (this._timeDiff == undefined) return false;

        let body = {
            version: this._context.version,
            data: this._timeDiff
        }

        this._httpClient.post(AB_SERVER_URL + "data/", body).subscribe(
            x => {
                console.warn("response: " + x);
        })
        
        return true;
    }
    
    public shouldRender(versions: string[]): boolean {
        return versions.indexOf(this._context.version) > -1;
    }

    private getRandomContext(config: AbTestsOptions): AbTestsContext {
        let sumOfWeights = 0;
        let numOfWeightless = 0;
        let versions = [];

        for(let context in config.contexts) versions.push(config.contexts[context].version);
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
            throw new Error ("sum of weights exceeds 100 before filling");
        }

        for (let i = 0; i < versions.length; i++) {
            if (!config.weights[versions[i]]) {
                if(numOfWeightless === 0) break;

                let newWeight = (100 - sumOfWeights) / numOfWeightless;
                config.weights[versions[i]] = newWeight;

                sumOfWeights += newWeight;
                numOfWeightless--;
            }
        }

        if (Math.abs(100 - sumOfWeights) > 0.01) { // sumOfWeights should always be exactly 100 but there might be a rounding error
            if (sumOfWeights > 100) {
                // console.error("sum of weights exceeds 100 after filling");
                throw new Error ("sum of weights exceeds 100 after filling");
            } else if (sumOfWeights < 100) {
                // console.error("sum of weights still below 100 after filling");
                throw new Error ("sum of weights still below 100 after filling");
            }
        }

        const r = Math.random() * 100;
        let sum = 0, i;
        for(i in config.weights) {
            sum += config.weights[i];
            if (r < sum) break;
        }
        
        for(let c in config.contexts) {
            let context = config.contexts[c];
            if (context.version == i) {
                return context;
            }
        }

        throw Error("no context selected");
    }

    private filterWeights(versions: string[], config: AbTestsOptions): AbTestsOptions {
        for(let i in config.weights) {
            if (!versions.includes(i)) delete config.weights[i]; // removes extraneous element
        }
        return config;
    }

    getContextInfo(version: string): AbTestsContext {
        if (this._context.version == version) return this._context;
        else {
            // return this._config[version];   // need to change config structure
            return null;
        }
    }

    public setLoadTime(time: number): void {
        this._context.loadTime = time;
    }

    //dauer des renderns einer komponente und wie das den kunden beeinflusst

    // allgemein mehr kontext

    // pfad des mauszeigers evtl.

    // device des users

    // mehrere measurements auf einmal


    // conversion rate
    
}