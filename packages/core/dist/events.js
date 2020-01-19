"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const EventEmitter = require("events");
const store = require('./store');
const debug = Debug('blix:core:events:emit');
exports.eventsBus = new EventEmitter();
function emit(data) {
    debug('emit called with %o', data);
    if (store.currentTask) {
        exports.eventsBus.emit(store.currentTask, data);
    }
}
exports.emit = emit;
