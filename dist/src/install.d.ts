export declare function canUseYarn(): boolean;
export declare function yarn(): Promise<void>;
export declare function checkScriptsFolderExist(): void;
export declare function checkIfScriptIsTaken(scriptName: string): boolean;
export declare function installAllPackages(): void;
export declare function addScriptToPackageJSON(command: string, script: string): void;
export declare function installDependencies(packages: string, type?: string): void;
/**
 *
 * @param {string} deps - string of space separated packages to install
 * @param type - string of any kind, usually 'dev' to indicate to add as a devDependency
 */
export declare function addDependenciesToStore(deps: string, type?: string): void;
