"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var store = require('../store');
var chalk = require('chalk');
var logger_1 = require("../src/logger");
var process_1 = require("../src/process");
function _loadFile(filePath) {
    var filePathStartCharacters = filePath.slice(0, 2);
    var folderPath = './new/files/';
    if (filePathStartCharacters === './') {
        filePath = filePath.slice(1);
    }
    try {
        var file = fs.readFileSync(path.resolve(__dirname, folderPath + filePath), 'utf8');
        if (!file) {
            throw "File " + file + " not found!";
        }
        if (store.env === 'development') {
            console.log(chalk(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{cyan load} file ", ""], ["{cyan load} file ", ""])), filePath));
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
            process.chdir("./" + store.name);
        }
        if (store.useYarn) {
            var command = type === 'dev' ? "yarn add " + packages + " --dev" : "yarn add " + packages;
            process_1.execute(command);
        }
        else {
            var command = type === 'dev' ? "npm install --save-dev " + packages : "npm install --save " + packages;
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
        logger_1.logError(message + ". Error: " + err);
    }
    else {
        logger_1.logError(message);
    }
}
exports._logCaughtError = _logCaughtError;
var templateObject_1;
