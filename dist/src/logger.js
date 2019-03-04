"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
function logError(msg) {
    console.error(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{red ", "}"], ["{red ", "}"])), msg));
}
exports.logError = logError;
function logWarning(msg) {
    console.warn(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{yellow ", "}"], ["{yellow ", "}"])), msg));
}
exports.logWarning = logWarning;
function log() {
}
exports.log = log;
var templateObject_1, templateObject_2;
