import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { CONFIG } from "./ab-tests-injection-token";
import { AbTestsOptions } from "./ab-tests.module";
import { LocalStorageHandler } from "./local-storage-handler";

@Injectable()
export class AbTestsService implements OnDestroy {
    private _version: string;   // this field is kind of a problem
    private _serverUrl = "http://localhost:3000/";

    private time: number;
    private timeDiff: number;
    private running: boolean;

    private intervalId;

    constructor(
        @Inject(CONFIG) configs: AbTestsOptions[],
        private _localStorageHandler: LocalStorageHandler,
        private _httpClient: HttpClient
        ) {
        // console.log("AbTestsService constructor: " + performance.now() + " ms");

        let versions = ["old", "new"];

        if (configs[0] != undefined){
            versions = configs[0].versions;
        } else {
            console.error("configs[0] is undefined");
        }
        // this._version = versions[Math.floor(Math.random() * 100) % versions.length];
        this._version = this.getRandomVersion(configs[0]);

        let ver = this.getVersion();
        // if (!ver) {
        if (true) { // testcode
            this.setVersion(this._version);
        } else {
            this._version = ver.toString();
        }
    }

    ngOnDestroy() {
        if (this.intervalId) clearInterval(this.intervalId);
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
        this.time = Date.now();
        this.timeDiff = 0;
        this.running = true;

        this.intervalId = setInterval(() => this.updateTimeDiff(), 1);
    }

    public updateTimeDiff() {
        if (this.running)
            this.timeDiff = Date.now() - this.time;
    }

    public getTimeDiff() {
        return this.timeDiff;
    }

    public stopMeasurement() { // start und stop reicht nicht
        if (this.running) {
            this.running = false;
            this.saveMeasurement();
        } else {
            console.warn("not running")
        }
    }

    public saveMeasurement() {
        if (this.timeDiff == undefined) {
            console.error("can't save measurement before starting timer");
            return;
        }

        let oldString = this._localStorageHandler.get("measurements");

        this._localStorageHandler.set("measurements", oldString ? oldString + ", " + this.timeDiff : this.timeDiff.toString());
        this.sendMeasurement();
    }

    public sendMeasurement(): boolean {
        if (this.timeDiff == undefined) return false;

        let body = {
            version: this._version,
            data: this.timeDiff
        }

        this._httpClient.post(this._serverUrl + "data/", body).subscribe(
            x => {
                console.warn("response: " + x);
        })
        
        return true;
    }
    
    public shouldRender(versions: string[]): boolean {
        return versions.indexOf(this._version) > -1;
    }

    private getRandomVersion(config: AbTestsOptions): string {
        let sumOfWeights = 0;
        let numOfWeightless = 0;

        config = this.filterWeights(config);

        for (let i = 0; i < config.versions.length; i++) {
            let weight = config.weights[config.versions[i]];
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

        for (let i = 0; i < config.versions.length; i++) {
            if (!config.weights[config.versions[i]]) {
                if(numOfWeightless === 0) break;

                let newWeight = (100 - sumOfWeights) / numOfWeightless;
                config.weights[config.versions[i]] = newWeight;

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
            if (r < sum) return i;
        }
        return i; // if none were chosen (because it doesn't add up to 100) return the last
    }

    private filterWeights(config: AbTestsOptions): AbTestsOptions {
        for(let i in config.weights) {
            if (!config.versions.includes(i)) delete config.weights[i]; // removes extraneous element
        }
        return config;
    }

    getConfigInfo(version: string) {

    }

    //dauer des renderns einer komponente und wie das den kunden beeinflusst

    // allgemein mehr kontext

    // pfad des mauszeigers evtl.

    // device des users

    // mehrere measurements auf einmal


    // conversion rate
    
}