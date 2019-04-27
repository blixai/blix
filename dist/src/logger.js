"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const readline = require('readline');
const store = require('./store');
const logSymbols = require('log-symbols');
function logError(msg) {
    console.error(chalk_1.default `{red ${msg}}`);
}
exports.logError = logError;
function logWarning(msg) {
    console.warn(chalk_1.default `{yellow ${msg}}`);
}
exports.logWarning = logWarning;
function logTaskStatus(task, status, symbol) {
    let stringToStore = '';
    if (symbol) {
        stringToStore = `${symbol} ${task}`;
    }
    else {
        stringToStore = `${logSymbols[status] ? logSymbols[status] : logSymbols.success}  ${task}`;
    }
    store.tasks.push(stringToStore);
    clearConsole();
    store.tasks.forEach((task) => {
        console.log(task);
    });
}
exports.logTaskStatus = logTaskStatus;
// logger action methods
function logCreate(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default `{green create} ${msg}`);
    }
}
exports.logCreate = logCreate;
function logDeleted(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default `{red delete} ${msg}`);
    }
}
exports.logDeleted = logDeleted;
function logMutate(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default `{yellow mutate} ${msg}`);
    }
}
exports.logMutate = logMutate;
function logInsert(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default `{cyan insert} ${msg}`);
    }
}
exports.logInsert = logInsert;
function logAppend(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default `{cyan append} ${msg}`);
    }
}
exports.logAppend = logAppend;
function logInvoke(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default `{blue invoke} ${msg}`);
    }
}
exports.logInvoke = logInvoke;
function clearConsole(title) {
    if (process.stdout.isTTY) {
        // @ts-ignore
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.log(chalk_1.default.bold.cyan(title));
        }
        else if (store.mode === 'cli' && store.blixVersion) {
            console.log(chalk_1.default.bold.cyan(`Blix v${store.blixVersion}`));
            console.log();
        }
    }
}
exports.clearConsole = clearConsole;
