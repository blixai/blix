"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store = require('./store');
const logger_1 = require("./logger");
const events_1 = require("./events");
const debug = require('debug')(`blix:core:cli:task`); // TODO figure out how to attach to each instance to further namespace by task name
class Task {
    constructor(name, symbol) {
        this.symbol = '';
        this.successEvents = 0;
        this.errorEvents = 0;
        this.receivedEvents = [];
        this.name = name;
        if (symbol) {
            this.symbol = symbol;
        }
        this.init();
    }
    init() {
        events_1.eventsBus.addListener(this.name, this._taskListener.bind(this)); // make sure to bind this or context is lost
    }
    start() {
        // could probably accept args like show spinner, hide console, ....
        store.currentTask = this.name;
    }
    finished() {
        store.currentTask = '';
        events_1.eventsBus.removeAllListeners(this.name);
        // calculete success vs failures
        if (this.successEvents > this.errorEvents) {
            logger_1.logTaskStatus(this.name, 'success', this.symbol);
        }
        else if (this.successEvents < this.errorEvents) {
            logger_1.logTaskStatus(this.name, 'error');
        }
        else {
            logger_1.logTaskStatus(this.name, 'warning');
        }
        debug(`Total actions received by %s : %d`, this.name, this.receivedEvents.length);
    }
    _taskListener(event) {
        debug('incoming event %o', event);
        // if status is an error count it, basically count errors, successes, at the end tally them for a percentage
        if (event && event.status && event.status === 'success') {
            this.successEvents += 1;
        }
        else if (event && event.status && event.status === 'error') {
            this.errorEvents += 1;
        }
        this.receivedEvents.push(event);
    }
}
exports.Task = Task;
