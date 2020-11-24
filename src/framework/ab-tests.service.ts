import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { CONFIG } from "./ab-tests-injection-token";
import { AbTestsOptions } from "./ab-tests.module";
import { LocalStorageHandler } from "./data-handlers";

@Injectable()
export class AbTestsService implements OnDestroy {
    private _version: string;
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
        var versions = ["old", "new"];

        if (configs[0] != undefined){
            versions = configs[0].versions;
        } else {
            console.error("configs[0] is undefined");
        }
        this._version = versions[Math.floor(Math.random() * 100) % versions.length];

        var ver = this.getVersion();
        if (!ver) {
            this.setVersion(this._version);
        } else {
            this._version = ver.toString();
        }
    }

    ngOnDestroy() {
        if (this.intervalId)
            clearInterval(this.intervalId);
    }

    public getVersion(): string {
        var version = this._localStorageHandler.get("version");
        return version;
    }

    public setVersion(version: string) {
        this._localStorageHandler.set("version", version);
        return;
    }

    public startMeasurement() {
        this.time = Date.now();
        this.timeDiff = 0;
        this.running = true;

        this.intervalId = setInterval(() => this.updateTimeDiff(), 61);
    }

    public updateTimeDiff() {
        if (this.running)
            this.timeDiff = Date.now() - this.time;
    }

    public getTimeDiff() {
        return this.timeDiff;
    }

    public stopMeasurement() {
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

        var oldString = this._localStorageHandler.get("measurements");

        this._localStorageHandler.set("measurements", oldString ? oldString + ", " + this.timeDiff : this.timeDiff.toString());
        this.sendMeasurement();
    }

    public sendMeasurement(): boolean {
        if (this.timeDiff == undefined) return false;

        var body = {
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
        if (versions.indexOf(this._version) > -1) {
            return true;
        }
        return false;
    }

}