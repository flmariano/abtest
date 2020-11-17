import { Injectable, OnDestroy } from "@angular/core";
import { version } from "punycode";
import { LocalStorageHandler } from "./data-handlers";

@Injectable()
export class AbTestsService implements OnDestroy {
    private _version: string;

    private time: number;
    private timeDiff: number;
    private running: boolean;

    private intervalId;

    constructor(private _localStorageHandler: LocalStorageHandler) {
        var versions = ['old', 'new'];
        this._version = versions[Math.floor(Math.random() * 100) % 2];
        this._version = 'old';
    }

    ngOnDestroy() {
        if (this.intervalId)
            clearInterval(this.intervalId);
    }

    public getVersion(): string | boolean {
        var version = this._localStorageHandler.get("version");
        return version || false;
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

    public stopMeasurement(version: string) {
        if (this.running) {
            this.running = false;
            this.saveMeasurement(version);
        } else {
            console.warn("not running")
        }
    }

    public saveMeasurement(version: string) {
        var oldString = this._localStorageHandler.get("measurements");

        this._localStorageHandler.set("measurements", oldString ? oldString + ", " + this.timeDiff : this.timeDiff.toString());
        this._localStorageHandler.set("version", version);
    }

    public shouldRender(versions: string[]): boolean {
        if (versions.includes(this._version)) {
            return true;
        }
        return false;
    }

}