declare const debug: any;
declare const storeDebug: any;
declare const getDebug: any;
declare const setDebug: any;
declare const store: {
    name: string;
    frontend: string;
    backend: string;
    backendType: string;
    database: string;
    serverTesting: string;
    e2e: string;
    reactTesting: string;
    vueTesting: string;
    reactType: string;
    dependencies: string;
    devDependencies: string;
    useYarn: string;
    reactCSS: string;
    linter: string;
    tasks: never[];
    blixNeedsUpdate: boolean;
    blixFailedToCheckForUpdates: boolean;
};
declare function checkIfEnvChange(key: string, value: string): void;
declare const handler: {
    get(target: any, key: string): any;
    set(_: object, key: string, value: any): boolean;
};
