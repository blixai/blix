"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCWDName() {
    var rawCWD = process.cwd();
    var cwdArr = rawCWD.split('/');
    var cwdName = cwdArr.pop() || "";
    return cwdName;
}
exports.getCWDName = getCWDName;
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
exports.capitalize = capitalize;
// need a sleep function
