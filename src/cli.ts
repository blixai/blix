const store = require('./store')
import { logTaskStatus } from './logger'
import { eventsBus } from './events'
const debug = require('debug')(`blix:task`) // TODO figure out how to attach to each instance to further namespace by task name


export class Task {
    readonly name: string;
    readonly symbol: string = '';
    successEvents: number = 0;
    errorEvents: number = 0;
    receivedEvents: object[] = [];

    constructor(
        name: string, 
        symbol?: string
    ) {

        this.name = name
        if (symbol) {
            this.symbol = symbol
        }

        this.init()
    }

    init() {
        if (store['tasks']) {
            store.tasks.push(this.name)
        } else {
            store.tasks = [this.name]
        }
        eventsBus.addListener(this.name, this._taskListener.bind(this)) // make sure to bind this or context is lost
    }

    start() {
        // could probably accept args like show spinner, hide console, ....
        store.currentTask = this.name
    }

    finished() { // TODO make a boolean param of show debugged or clearConsole
        store.currentTask = ''
        eventsBus.removeAllListeners(this.name)
        // calculete success vs failures
        if (this.successEvents > this.errorEvents) {
            logTaskStatus(this.name, 'success') 
        } else if (this.successEvents < this.errorEvents) {
            logTaskStatus(this.name, 'error')
        } else {
            logTaskStatus(this.name, 'warning')
        }
        debug(`Total actions received by %s : %d`, this.name, this.receivedEvents.length)
    }

    private _taskListener(event: any) {
        debug('incoming event %o', event)

        // if status is an error count it, basically count errors, successes, at the end tally them for a percentage
        if (event && event.status && event.status === 'success') {
            this.successEvents += 1
        } else if (event && event.status && event.status === 'error') {
            this.errorEvents += 1
        }
        this.receivedEvents.push(event)
    }

}