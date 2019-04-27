"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const inquirer_1 = require("inquirer");
const store = require('./store');
const Mustache = require('mustache');
const blixInternal_1 = require("../.internal/blixInternal");
const utils_1 = require("./utils");
const logger_1 = require("./logger");
const events_1 = require("./events");
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
        blixInternal_1._logCaughtError(`Couldn't create file ${filePath}`, err);
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
        blixInternal_1._logCaughtError(`Error making directory ${folderPath}`, err);
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
        blixInternal_1._logCaughtError(`Error renaming ${oldName}`, err);
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
            blixInternal_1._logCaughtError(`Failed to insert into ${fileToInsertIntoLog}`, err);
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
        blixInternal_1._logCaughtError(`Failed to append ${file}.`, err);
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
                blixInternal_1._logCaughtError(`Error: Couldn't move ${file} from ${dirToSearch} into ${dirToMoveTo}`, err);
            }
        });
    }
    catch (err) {
        blixInternal_1._logCaughtError(`Failed to read directory`, err);
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
        blixInternal_1._logCaughtError(`Failed to delete ${dirToSearch}.`, err);
    }
}
exports.moveAllFilesInDir = moveAllFilesInDir;
function loadFile(file, folderPath) {
    if (!folderPath) {
        folderPath = store.mode === 'cli' ? '../../cli/files/' : '/scripts/templates/';
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
            throw `File ${file} not found!`;
        }
        return file;
    }
    catch (err) {
        blixInternal_1._logCaughtError(`Failed to load file ${file}`, err);
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
        blixInternal_1._logCaughtError(`Failed to load json file ${file}`, err);
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
        blixInternal_1._logCaughtError(`Failed to write to file ${filePath}`, err);
    }
}
exports.writeJSONFile = writeJSONFile;
/**
 * load a package.json from the cli user directly, often used for package.json checks/file manipulation
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
        blixInternal_1._logCaughtError(`Failed to load json file ${file}`, err);
        return "";
    }
}
exports.loadUserJSONFile = loadUserJSONFile;
function loadTemplate(file, options, folderPath) {
    if (!folderPath) {
        folderPath = store.mode === 'cli' ? '../../cli/files/' : '/scripts/templates/';
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
            throw `File ${file} not found!`;
        }
        let renderedFile = Mustache.render(file, options);
        return renderedFile;
    }
    catch (err) {
        blixInternal_1._logCaughtError(`Failed to load template ${file}`, err);
        return "";
    }
}
exports.loadTemplate = loadTemplate;
/**
* @param { string[] } dirs - strings of directories to create, sync, in order
*/
function createMultipleFolders(dirs) {
    dirs.forEach(directory => {
        mkdirSync(directory);
    });
}
exports.createMultipleFolders = createMultipleFolders;
function createMultipleFiles() {
}
exports.createMultipleFiles = createMultipleFiles;
function createFilesAndFolders() {
    // TODO if typeof of string then mkdir, if typeof object then mkfiles
}
exports.createFilesAndFolders = createFilesAndFolders;
// TODO function that stores references to load multiple files, and then executes write files / dirs on it's own.
//      similiar to how we load all the packages to install and then execute at one time. 
/*
// TODO create a function that creates files and folders by just the structure
// eg pass as a arg

startFolderPath: {
    folder: {
        file
    },
    file,
    file,
    folder: {
        folder: {
            folder: {
                file
            }
        },
        file
    }
};

*/ 
