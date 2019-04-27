"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const store = require('../src/store');
const chalk = require('chalk');
const logger_1 = require("../src/logger");
const process_1 = require("../src/process");
function _loadFile(filePath) {
    let filePathStartCharacters = filePath.slice(0, 2);
    let folderPath = './new/files/';
    if (filePathStartCharacters === './') {
        filePath = filePath.slice(1);
    }
    try {
        let file = fs.readFileSync(path.resolve(__dirname, folderPath + filePath), 'utf8');
        if (!file) {
            throw `File ${file} not found!`;
        }
        if (store.env === 'development') {
            console.log(chalk `{cyan load} file ${filePath}`);
        }
        return file;
    }
    catch (err) {
        _logCaughtError("Failed to load internal Blix file.", err);
        return "";
    }
}
exports._loadFile = _loadFile;
function _installDependencies(packages, type) {
    try {
        if (store.name) {
            process.chdir(`./${store.name}`);
        }
        if (store.useYarn) {
            let command = type === 'dev' ? `yarn add ${packages} --dev` : `yarn add ${packages}`;
            process_1.execute(command);
        }
        else {
            let command = type === 'dev' ? `npm install --save-dev ${packages}` : `npm install --save ${packages}`;
            process_1.execute(command);
        }
        if (store.name)
            process.chdir('../');
    }
    catch (err) {
        if (store.name)
            process.chdir('../');
        _logCaughtError('Something went wrong installing the packages', err);
    }
}
exports._installDependencies = _installDependencies;
function _logCaughtError(message, err) {
    if (store.env === 'development') {
        logger_1.logError(`${message}. Error: ${err}`);
    }
    else {
        logger_1.logError(message);
    }
}
exports._logCaughtError = _logCaughtError;
