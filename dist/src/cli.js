"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store = require('./store');
var logger_1 = require("./logger");
var events_1 = require("./events");
var debug = require('debug')("blix:task"); // TODO figure out how to attach to each instance to further namespace by task name
var Task = /** @class */ (function () {
    // TODO figure out how to work with interfaces so we can capture each event for debugging
    function Task(name, subtasks, symbol) {
        this.name = '';
        this.subtasks = [];
        this.symbol = '';
        this.successEvents = 0;
        this.errorEvents = 0;
        this.receivedEvents = [];
        this.name = name;
        if (subtasks) {
            this.subtasks = subtasks;
        }
        if (symbol) {
            this.symbol = symbol;
        }
        this.init();
    }
    Task.prototype.init = function () {
        if (store['tasks']) {
            store.tasks.push(this.name);
        }
        else {
            store.tasks = [this.name];
        }
        events_1.eventsBus.addListener(this.name, this.taskListener.bind(this)); // make sure to bind this or context is lost
    };
    Task.prototype.start = function () {
        // could probably accept args like show spinner, hide console, ....
        store.currentTask = this.name;
    };
    Task.prototype.finished = function () {
        store.currentTask = '';
        events_1.eventsBus.removeAllListeners(this.name);
        // calculete success vs failures
        if (this.successEvents > this.errorEvents) {
            logger_1.logTaskStatus(this.name, 'success');
        }
        else if (this.successEvents < this.errorEvents) {
            logger_1.logTaskStatus(this.name, 'error');
        }
        else {
            logger_1.logTaskStatus(this.name, 'warning');
        }
        debug("Total actions received by %s : %d", this.name, this.receivedEvents.length);
    };
    Task.prototype.taskListener = function (event) {
        debug('incoming event %o', event);
        // if status is an error count it, basically count errors, successes, at the end tally them for a percentage
        if (event && event.status && event.status === 'success') {
            this.successEvents += 1;
        }
        else if (event && event.status && event.status === 'error') {
            this.errorEvents += 1;
        }
        this.receivedEvents.push(event);
    };
    return Task;
}());
exports.Task = Task;
