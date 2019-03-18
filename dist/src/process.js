"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var store = require('./store');
// child_process exec sync wrapper 
function execute(command, showOutput) {
    if (showOutput || store.env === 'development') {
        child_process_1.spawnSync(command, { stdio: [0, 1, 2], shell: true });
    }
    else {
        child_process_1.spawnSync(command, { stdio: 'ignore', shell: true });
    }
}
exports.execute = execute;
