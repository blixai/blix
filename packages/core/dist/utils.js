"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store = require('./store');
const logger_1 = require("./logger");
const process_1 = require("./process");
function getCWDName() {
    let rawCWD = process.cwd();
    let cwdArr = rawCWD.split('/');
    let cwdName = cwdArr.pop() || "";
    return cwdName;
}
exports.getCWDName = getCWDName;
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
exports.capitalize = capitalize;
// TODO need a sleep function
function prettyPath(path) {
    let pathStartCharacters = path.slice(0, 2);
    if (pathStartCharacters === './') {
        path = path.slice(2);
    }
    return path;
}
exports.prettyPath = prettyPath;
function _installDependencies(packages, type) {
    try {
        if (store.name) {
            process.chdir(`./${store.name}`);
        }
        let command;
        if (store.useYarn) {
            command = type === 'dev' ? `yarn add ${packages} --dev` : `yarn add ${packages}`;
        }
        else {
            command = type === 'dev' ? `npm install --save-dev ${packages}` : `npm install --save ${packages}`;
        }
        process_1.execute(command);
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
