"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var inquirer_1 = require("inquirer");
var store = require('./store');
var Mustache = require('mustache');
var utils_1 = require("./utils");
var logger_1 = require("./logger");
var events_1 = require("./events");
function writeFile(filePath, file) {
    try {
        filePath = store.name ? "./" + store.name + "/" + filePath : './' + filePath;
        var filePathLog = utils_1.prettyPath(filePath);
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
        utils_1._logCaughtError("Couldn't create file " + filePath, err);
    }
}
exports.writeFile = writeFile;
function mkdirSync(folderPath) {
    if (!folderPath && !store.name) {
        return logger_1.logError("Unable to create folder");
    }
    else if (!folderPath) {
        folderPath = '';
    }
    try {
        folderPath = store.name ? "./" + store.name + "/" + folderPath : './' + folderPath;
        var folderPathLog = utils_1.prettyPath(folderPath);
        fs.mkdirSync(folderPath);
        logger_1.logCreate(folderPathLog);
        events_1.emit({ status: 'success', action: 'make folder', folder: folderPath });
    }
    catch (err) {
        events_1.emit({ status: 'error', action: 'make folder', folder: folderPath });
        utils_1._logCaughtError("Error making directory " + folderPath, err);
    }
}
exports.mkdirSync = mkdirSync;
function rename(oldName, newName) {
    try {
        fs.renameSync(oldName, newName);
        oldName = utils_1.prettyPath(oldName);
        newName = utils_1.prettyPath(newName);
        logger_1.logWarning("move   " + oldName + " into " + newName);
        events_1.emit({ status: 'success', action: 'rename' });
    }
    catch (err) {
        events_1.emit({ status: 'error', action: 'rename' });
        utils_1._logCaughtError("Error renaming " + oldName, err);
    }
}
exports.rename = rename;
function insert(fileToInsertInto, whatToInsert, lineToInsertAt) {
    return __awaiter(this, void 0, void 0, function () {
        var fileToInsertIntoLog, filePrompt, file, lineToInsertAfter, indexToFind, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fileToInsertInto) {
                        return [2 /*return*/, logger_1.logError("No file specified.")];
                    }
                    else if (!whatToInsert) {
                        return [2 /*return*/, logger_1.logError('No string to insert specified.')];
                    }
                    fileToInsertIntoLog = utils_1.prettyPath(fileToInsertInto);
                    filePrompt = { type: 'list', name: 'lineNumber', message: 'Select a line to insert below', choices: [] };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    file = fs.readFileSync(fileToInsertInto, 'utf8').toString().split('\n');
                    if (!(lineToInsertAt === undefined)) return [3 /*break*/, 3];
                    filePrompt.choices = file;
                    return [4 /*yield*/, inquirer_1.prompt([filePrompt])];
                case 2:
                    lineToInsertAfter = _a.sent();
                    lineToInsertAt = file.indexOf(lineToInsertAfter) + 1;
                    return [3 /*break*/, 4];
                case 3:
                    if (isNaN(Number(lineToInsertAt))) {
                        indexToFind = file.indexOf(lineToInsertAt);
                        if (indexToFind !== -1) {
                            lineToInsertAt = indexToFind + 1;
                        }
                        else {
                            lineToInsertAt = file.length + 1;
                        }
                    }
                    _a.label = 4;
                case 4:
                    file.splice(lineToInsertAt, 0, whatToInsert);
                    file = file.join('\n');
                    fs.writeFileSync(fileToInsertInto, file);
                    logger_1.logInsert(fileToInsertIntoLog);
                    events_1.emit({ status: 'success', action: 'insert' });
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    events_1.emit({ status: 'errror', action: 'insert' });
                    utils_1._logCaughtError("Failed to insert into " + fileToInsertIntoLog, err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.insert = insert;
function appendFile(file, stringToAppend) {
    if (!file) {
        return logger_1.logError("File not provided.");
    }
    else if (!stringToAppend) {
        return logger_1.logError("No string to append provided.");
    }
    try {
        file = store.name ? "./" + store.name + "/" + file : './' + file;
        fs.appendFileSync(file, stringToAppend);
        file = utils_1.prettyPath(file);
        logger_1.logAppend(file);
        events_1.emit({ status: 'success', action: 'appendFile' });
    }
    catch (err) {
        utils_1._logCaughtError("Failed to append " + file + ".", err);
    }
}
exports.appendFile = appendFile;
function moveAllFilesInDir(dirToSearch, dirToMoveTo) {
    try {
        fs.readdirSync(dirToSearch).forEach(function (file) {
            if (file === 'actions' || file === 'components' || file === 'store' || file === 'api') {
                return;
            }
            try {
                rename(dirToSearch + '/' + file, dirToMoveTo + '/' + file);
            }
            catch (err) {
                utils_1._logCaughtError("Error: Couldn't move " + file + " from " + dirToSearch + " into " + dirToMoveTo, err);
            }
        });
    }
    catch (err) {
        utils_1._logCaughtError("Failed to read directory", err);
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
        utils_1._logCaughtError("Failed to delete " + dirToSearch + ".", err);
    }
}
exports.moveAllFilesInDir = moveAllFilesInDir;
function loadFile(file, folderPath) {
    if (!folderPath) {
        folderPath = store.mode === 'cli' ? '/src/files/' : '/scripts/templates/';
    }
    file = utils_1.prettyPath(file);
    try {
        file = fs.readFileSync(process.cwd() + folderPath + file, 'utf8');
        if (!file) {
            throw "File " + file + " not found!";
        }
        return file;
    }
    catch (err) {
        utils_1._logCaughtError("Failed to load file " + file, err);
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
            throw "JSON file " + file + " not found!";
        }
        return JSON.parse(file);
    }
    catch (err) {
        utils_1._logCaughtError("Failed to load json file " + file, err);
        return "";
    }
}
exports.loadJSONFile = loadJSONFile;
function writeJSONFile(filePath, file) {
    try {
        var fileString = JSON.stringify(file, null, 2);
        filePath = store.name ? "./" + store.name + "/" + filePath : './' + filePath;
        var filePathLog = utils_1.prettyPath(filePath);
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
        utils_1._logCaughtError("Failed to write to file " + filePath, err);
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
            throw "JSON file " + file + " not found!";
        }
        return JSON.parse(file);
    }
    catch (err) {
        utils_1._logCaughtError("Failed to load json file " + file, err);
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
            throw "File " + file + " not found!";
        }
        var renderedFile = Mustache.render(file, options);
        return renderedFile;
    }
    catch (err) {
        utils_1._logCaughtError("Failed to load template " + file, err);
        return "";
    }
}
exports.loadTemplate = loadTemplate;
/**
* @param { string[] } dirs - strings of directories to create, sync, in order
*/
function createMultipleFolders(dirs) {
    dirs.forEach(function (directory) {
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
    var fileKeys = Object.keys(filesAndFolderObject);
    fileKeys.forEach(function (key) {
        var currentPath = filePath + '/' + key;
        if (typeof filesAndFolderObject[key] === 'string') {
            writeFile(currentPath, filesAndFolderObject[key]);
        }
        else if (typeof filesAndFolderObject[key] === 'object') {
            var pathToCheck = store.name ? "./" + store.name + "/" + currentPath : currentPath;
            if (!fs.existsSync(pathToCheck)) {
                mkdirSync(currentPath);
            }
            createFilesAndFolders(currentPath, filesAndFolderObject[key]);
        }
    });
}
exports.createFilesAndFolders = createFilesAndFolders;
