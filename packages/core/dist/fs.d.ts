export declare function writeFile(filePath: string, file: string): void;
export declare function mkdirSync(folderPath: string): void;
export declare function rename(oldName: string, newName: string): void;
export declare function insert(fileToInsertInto: string, whatToInsert: string, lineToInsertAt?: number): Promise<void>;
export declare function appendFile(file: string, stringToAppend: string): void;
export declare function moveAllFilesInDir(dirToSearch: string, dirToMoveTo: string): void;
export declare function loadFile(file: string, folderPath: string): string;
export declare function loadJSONFile(file: string, folderPath: string): string;
export declare function writeJSONFile(filePath: string, file: object): void;
/**
 * @description load a package.json from the cli user directly, often used for package.json checks/file manipulation
 * @param file
 */
export declare function loadUserJSONFile(file: string): string;
/**
* @param { string[] } dirs - strings of directories to create, sync, in order
*/
export declare function createMultipleFolders(dirs: [string]): void;
/**
 *
 */
export declare function createMultipleFiles(): void;
/**
 * @description creates files and folders by just passing an object with the structure
 * @example
    createFilesAndFolders(startFolderPath, {
        folder: {
            'file.ex'
        },
        'file.js',
        'file.py',
        folder: {
            folder: {
                folder: {
                    'file.md'
                }
            },
            'file.rb'
        }
    });
 *
 * @param filePath - where to start building the new files and folders from
 * @param filesAndFolderObject - object
 */
export declare function createFilesAndFolders(filePath: string, filesAndFolderObject: any): void;
