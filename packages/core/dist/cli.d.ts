export declare class Task {
    readonly name: string;
    readonly symbol: string;
    successEvents: number;
    errorEvents: number;
    receivedEvents: any[];
    constructor(name: string, symbol?: string);
    init(): void;
    start(): void;
    finished(): void;
    private _taskListener;
}
