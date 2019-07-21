"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var store = require('./store');
// child_process exec sync wrapper 
function execute(command, showOutput) {
    return new Promise(function (resolve, reject) {
        var child;
        if (showOutput || store.env === 'development') {
            child = child_process_1.spawn(command, { stdio: [0, 1, 2], shell: true });
        }
        else {
            child = child_process_1.spawn(command, { stdio: 'ignore', shell: true });
        }
        if (child.stderr && child.stdout) {
            child.stderr.on('data', function (data) {
                console.log("child stdout:\n" + data);
            });
            child.stderr.on('data', function (data) {
                console.log("child stdout:\n" + data);
            });
        }
        child.on('close', function (code) {
            if (code !== 0) {
                reject("Execute failed: " + command);
                return;
            }
            resolve();
        });
    });
}
exports.execute = execute;
// TODO function to safely change process directory
