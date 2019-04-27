"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const store = require('./store');
// child_process exec sync wrapper 
function execute(command, showOutput) {
    return new Promise((resolve, reject) => {
        let child;
        if (showOutput || store.env === 'development') {
            child = child_process_1.spawn(command, { stdio: [0, 1, 2], shell: true });
        }
        else {
            child = child_process_1.spawn(command, { stdio: 'ignore', shell: true });
        }
        if (child.stderr && child.stdout) {
            child.stderr.on('data', (data) => {
                console.log(`child stdout:\n${data}`);
            });
            child.stderr.on('data', (data) => {
                console.log(`child stdout:\n${data}`);
            });
        }
        child.on('close', code => {
            if (code !== 0) {
                reject(`Execute failed: ${command}`);
                return;
            }
            resolve();
        });
    });
}
exports.execute = execute;
// TODO function to safely change process directory
