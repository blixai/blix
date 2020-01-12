"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var readline = require('readline');
var store = require('./store');
var logSymbols = require('log-symbols');
var createDebug = require("debug")("blix:core:fs:create");
var deleteDebug = require("debug")("blix:core:fs:delete");
var mutateDebug = require("debug")("blix:core:fs:mutate");
var insertDebug = require("debug")("blix:core:fs:insert");
var appendDebug = require("debug")("blix:core:fs:append");
var invokeDebug = require("debug")("blix:core:fs:invoke");
function logError(msg) {
    console.error(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{red ", "}"], ["{red ", "}"])), msg));
}
exports.logError = logError;
function logWarning(msg) {
    console.warn(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{yellow ", "}"], ["{yellow ", "}"])), msg));
}
exports.logWarning = logWarning;
function logTaskStatus(task, status, symbol) {
    var stringToStore = '';
    if (symbol) {
        stringToStore = symbol + " " + task;
    }
    else {
        stringToStore = (logSymbols[status] ? logSymbols[status] : logSymbols.success) + "  " + task;
    }
    store.tasks.push(stringToStore);
    if (store.env !== "development") {
        clearConsole();
    }
    store.tasks.forEach(function (task) {
        console.log(task);
    });
}
exports.logTaskStatus = logTaskStatus;
// logger action methods
function logCreate(msg) {
    if (store.env === 'development') {
        createDebug('create %s', msg);
    }
}
exports.logCreate = logCreate;
function logDeleted(msg) {
    if (store.env === 'development') {
        deleteDebug('delete %s', msg);
    }
}
exports.logDeleted = logDeleted;
function logMutate(msg) {
    if (store.env === 'development') {
        mutateDebug('mutate %s', msg);
    }
}
exports.logMutate = logMutate;
function logInsert(msg) {
    if (store.env === 'development') {
        insertDebug('insert %s', msg);
    }
}
exports.logInsert = logInsert;
function logAppend(msg) {
    if (store.env === 'development') {
        appendDebug('append %s', msg);
    }
}
exports.logAppend = logAppend;
function logInvoke(msg) {
    if (store.env === 'development') {
        invokeDebug('invoke %s', msg);
        console.log(chalk_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{blue invoke} ", ""], ["{blue invoke} ", ""])), msg));
    }
}
exports.logInvoke = logInvoke;
function _basicConsoleHeader(blixVersion) {
    return chalk_1.default.bold.cyan("Blix v" + blixVersion);
}
function clearConsole(title) {
    if (process.stdout.isTTY) {
        // @ts-ignore
        var blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.log(chalk_1.default.bold.cyan(title));
        }
        else if (store.mode === 'cli' && store.blixNeedsUpdate) {
            console.log(_basicConsoleHeader(store.blixVersion));
            console.log();
            console.log(chalk_1.default.bold.red("Blix update available. Please update to the latest version" + (store.blixLatestVersion ? ': ' + store.blixLatestVersion : '')));
            console.log();
        }
        else if (store.mode === 'cli') {
            console.log(_basicConsoleHeader(store.blixVersion));
            console.log();
        }
    }
}
exports.clearConsole = clearConsole;
var templateObject_1, templateObject_2, templateObject_3;
