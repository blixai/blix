"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
// child_process exec sync wrapper 
function execute(command) {
    child_process_1.execSync(command, { stdio: [0, 1, 2] });
}
exports.execute = execute;
