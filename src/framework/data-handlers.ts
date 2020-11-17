export class LocalStorageHandler {
    constructor() {

    }
    
    public get(name: string) : string {
        return localStorage.getItem(name);
    }

    public set(name: string, value: string): boolean {
        try {
            localStorage.setItem(name, value);
        } catch (error) {
            return false;
        }
        return true;
    }
}