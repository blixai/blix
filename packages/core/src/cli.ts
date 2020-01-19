import * as Debug from 'debug'
import { eventsBus } from './events'
import { logTaskStatus } from './logger'
const store = require('./store')

const debug = Debug(`blix:core:cli:task`) // TODO figure out how to attach to each instance to further namespace by task name

export class Task {
  public readonly name: string
  public readonly symbol: string = ''
  public successEvents: number = 0
  public errorEvents: number = 0
  public receivedEvents: any[] = []

  constructor(name: string, symbol?: string) {
    this.name = name
    if (symbol) {
      this.symbol = symbol
    }

    this.init()
  }

  public init() {
    eventsBus.addListener(this.name, this._taskListener.bind(this)) // make sure to bind this or context is lost
  }

  public start() {
    // could probably accept args like show spinner, hide console, ....
    store.currentTask = this.name
  }

  public finished() {
    // TODO make a boolean param of show debugged or clearConsole
    store.currentTask = ''
    eventsBus.removeAllListeners(this.name)
    // calculete success vs failures
    if (this.successEvents > this.errorEvents) {
      logTaskStatus(this.name, 'success', this.symbol)
    } else if (this.successEvents < this.errorEvents) {
      logTaskStatus(this.name, 'error')
    } else {
      logTaskStatus(this.name, 'warning')
    }
    debug(
      `Total actions received by %s : %d`,
      this.name,
      this.receivedEvents.length,
    )
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
