"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const inquirer_1 = require("inquirer");
const store = require('./store');
const utils_1 = require("./utils");
const logger_1 = require("./logger");
const events_1 = require("./events");
const { _loadFile } = require('@blixai/files');
function writeFile(filePath, file) {
    try {
        filePath = store.name ? `./${store.name}/` + filePath : './' + filePath;
        let filePathLog = utils_1.prettyPath(filePath);
        if (fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, file);
            logger_1.logMutate(filePathLog);
        }
        else {
            fs.writeFileSync(filePath, file);
            logger_1.logCreate(filePathLog);
        }
        events_1.emit({ status: 'success', action: 'write file', file: filePath });
    }
    catch (err) {
        events_1.emit({ status: 'error', action: 'write file', file: filePath });
        utils_1._logCaughtError(`Couldn't create file ${filePath}`, err);
    }
}
exports.writeFile = writeFile;
function mkdirSync(folderPath) {
    if (!folderPath && !store.name) {
        return logger_1.logError(`Unable to create folder`);
    }
    else if (!folderPath) {
        folderPath = '';
    }
    try {
        folderPath = store.name ? `./${store.name}/` + folderPath : './' + folderPath;
        let folderPathLog = utils_1.prettyPath(folderPath);
        fs.mkdirSync(folderPath);
        logger_1.logCreate(folderPathLog);
        events_1.emit({ status: 'success', action: 'make folder', folder: folderPath });
    }
    catch (err) {
        events_1.emit({ status: 'error', action: 'make folder', folder: folderPath });
        utils_1._logCaughtError(`Error making directory ${folderPath}`, err);
    }
}
exports.mkdirSync = mkdirSync;
function rename(oldName, newName) {
    try {
        fs.renameSync(oldName, newName);
        oldName = utils_1.prettyPath(oldName);
        newName = utils_1.prettyPath(newName);
        logger_1.logWarning(`move   ${oldName} into ${newName}`);
        events_1.emit({ status: 'success', action: 'rename' });
    }
    catch (err) {
        events_1.emit({ status: 'error', action: 'rename' });
        utils_1._logCaughtError(`Error renaming ${oldName}`, err);
    }
}
exports.rename = rename;
function insert(fileToInsertInto, whatToInsert, lineToInsertAt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fileToInsertInto) {
            return logger_1.logError(`No file specified.`);
        }
        else if (!whatToInsert) {
            return logger_1.logError('No string to insert specified.');
        }
        // this needs to get extracted into its own helper
        let fileToInsertIntoLog = utils_1.prettyPath(fileToInsertInto);
        let filePrompt = { type: 'list', name: 'lineNumber', message: 'Select a line to insert below', choices: [] };
        // if no lineToInsertAt then readfile and pass to inquirer prompt
        try {
            let file = fs.readFileSync(fileToInsertInto, 'utf8').toString().split('\n');
            if (lineToInsertAt === undefined) {
                filePrompt.choices = file;
                let lineToInsertAfter = yield inquirer_1.prompt([filePrompt]);
                lineToInsertAt = file.indexOf(lineToInsertAfter) + 1;
            }
            else if (isNaN(Number(lineToInsertAt))) {
                let indexToFind = file.indexOf(lineToInsertAt);
                if (indexToFind !== -1) {
                    lineToInsertAt = indexToFind + 1;
                }
                else {
                    lineToInsertAt = file.length + 1;
                }
            }
            file.splice(lineToInsertAt, 0, whatToInsert);
            file = file.join('\n');
            fs.writeFileSync(fileToInsertInto, file);
            logger_1.logInsert(fileToInsertIntoLog);
            events_1.emit({ status: 'success', action: 'insert' });
        }
        catch (err) {
            events_1.emit({ status: 'errror', action: 'insert' });
            utils_1._logCaughtError(`Failed to insert into ${fileToInsertIntoLog}`, err);
        }
    });
}
exports.insert = insert;
function appendFile(file, stringToAppend) {
    if (!file) {
        return logger_1.logError(`File not provided.`);
    }
    else if (!stringToAppend) {
        return logger_1.logError(`No string to append provided.`);
    }
    try {
        file = store.name ? `./${store.name}/` + file : './' + file;
        fs.appendFileSync(file, stringToAppend);
        file = utils_1.prettyPath(file);
        logger_1.logAppend(file);
        events_1.emit({ status: 'success', action: 'appendFile' });
    }
    catch (err) {
        utils_1._logCaughtError(`Failed to append ${file}.`, err);
    }
}
exports.appendFile = appendFile;
function moveAllFilesInDir(dirToSearch, dirToMoveTo) {
    try {
        fs.readdirSync(dirToSearch).forEach((file) => {
            if (file === 'actions' || file === 'components' || file === 'store' || file === 'api') {
                return;
            }
            try {
                rename(dirToSearch + '/' + file, dirToMoveTo + '/' + file);
            }
            catch (err) {
                utils_1._logCaughtError(`Error: Couldn't move ${file} from ${dirToSearch} into ${dirToMoveTo}`, err);
            }
        });
    }
    catch (err) {
        utils_1._logCaughtError(`Failed to read directory`, err);
        return;
    }
    try {
        fs.rmdirSync(dirToSearch);
        dirToSearch = utils_1.prettyPath(dirToSearch);
        logger_1.logDeleted(dirToSearch);
        events_1.emit({ status: 'success', action: 'moveAllFilesInDir' });
    }
    catch (err) {
        events_1.emit({ status: 'error', action: 'moveAllFilesInDir' });
        utils_1._logCaughtError(`Failed to delete ${dirToSearch}.`, err);
    }
}
exports.moveAllFilesInDir = moveAllFilesInDir;
function loadFile(file, folderPath) {
    if (!folderPath) {
        folderPath = '/scripts/templates/';
    }
    file = utils_1.prettyPath(file);
    try {
        if (store.mode === "cli") {
            file = _loadFile(file);
        }
        else {
            file = fs.readFileSync(process.cwd() + folderPath + file, 'utf8');
        }
        if (!file) {
            throw `File ${file} not found!`;
        }
        return file;
    }
    catch (err) {
        utils_1._logCaughtError(`Failed to load file ${file}`, err);
        return "";
    }
}
exports.loadFile = loadFile;
function loadJSONFile(file, folderPath) {
    // TODO ensure the file type is .json
    if (!folderPath) {
        folderPath = store.mode === 'cli' ? '../../cli/files/' : '/scripts/templates';
    }
    file = utils_1.prettyPath(file);
    try {
        if (store.mode === 'cli') {
            file = fs.readFileSync(path.resolve(__dirname, folderPath + file), 'utf8');
        }
        else {
            file = fs.readFileSync(process.cwd() + folderPath + file, 'utf8');
        }
        if (!file) {
            throw `JSON file ${file} not found!`;
        }
        return JSON.parse(file);
    }
    catch (err) {
        utils_1._logCaughtError(`Failed to load json file ${file}`, err);
        return "";
    }
}
exports.loadJSONFile = loadJSONFile;
function writeJSONFile(filePath, file) {
    try {
        let fileString = JSON.stringify(file, null, 2);
        filePath = store.name ? `./${store.name}/` + filePath : './' + filePath;
        let filePathLog = utils_1.prettyPath(filePath);
        if (fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, fileString);
            logger_1.logMutate(filePathLog);
        }
        else {
            fs.writeFileSync(filePath, fileString);
            logger_1.logCreate(filePathLog);
        }
    }
    catch (err) {
        utils_1._logCaughtError(`Failed to write to file ${filePath}`, err);
    }
}
exports.writeJSONFile = writeJSONFile;
/**
 * @description load a package.json from the cli user directly, often used for package.json checks/file manipulation
 * @param file
 */
function loadUserJSONFile(file) {
    // TODO ensure the file type is .json
    file = utils_1.prettyPath(file);
    try {
        file = fs.readFileSync('./' + file, 'utf8');
        if (!file) {
            throw `JSON file ${file} not found!`;
        }
        return JSON.parse(file);
    }
    catch (err) {
        utils_1._logCaughtError(`Failed to load json file ${file}`, err);
        return "";
    }
}
exports.loadUserJSONFile = loadUserJSONFile;
/**
* @param { string[] } dirs - strings of directories to create, sync, in order
*/
function createMultipleFolders(dirs) {
    dirs.forEach(directory => {
        mkdirSync(directory);
    });
}
exports.createMultipleFolders = createMultipleFolders;
/**
 *
 */
function createMultipleFiles() {
}
exports.createMultipleFiles = createMultipleFiles;
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
function createFilesAndFolders(filePath, filesAndFolderObject) {
    if (filePath && filePath.trim() === '') {
        filePath = './';
    }
    // for each level, recursively call itself and pass the new start path 
    let fileKeys = Object.keys(filesAndFolderObject);
    fileKeys.forEach(key => {
        let currentPath = filePath + '/' + key;
        if (typeof filesAndFolderObject[key] === 'string') {
            writeFile(currentPath, filesAndFolderObject[key]);
        }
        else if (typeof filesAndFolderObject[key] === 'object') {
            let pathToCheck = store.name ? `./${store.name}/${currentPath}` : currentPath;
            if (!fs.existsSync(pathToCheck)) {
                mkdirSync(currentPath);
            }
            createFilesAndFolders(currentPath, filesAndFolderObject[key]);
        }
    });
}
exports.createFilesAndFolders = createFilesAndFolders;
