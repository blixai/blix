export declare function writeFile(filePath: string, file: string, message?: string): void;
export declare function mkdirSync(folderPath: string, message?: string): void;
export declare function rename(oldName: string, newName: string): void;
export declare function insert(fileToInsertInto: string, whatToInsert: string, lineToInsertAt?: number): Promise<void>;
export declare function appendFile(file: string, stringToAppend: string): void;
export declare function moveAllFilesInDir(dirToSearch: string, dirToMoveTo: string): void;
export declare function loadFile(file: string, folderPath: string): string;
