"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = require('events');
var store = require('./store');
var debug = require('debug')('blix:events');
exports.eventsBus = new EventEmitter();
function emit(data) {
    debug('emit called with %o', data);
    if (store['currentTask']) {
        exports.eventsBus.emit(store.currentTask, data);
    }
}
exports.emit = emit;
