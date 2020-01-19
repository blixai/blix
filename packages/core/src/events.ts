import * as Debug from 'debug'
import * as EventEmitter from 'events'
import store from './store'

const debug = Debug('blix:core:events:emit')

export const eventsBus = new EventEmitter()

export function emit(data: object) {
  debug('emit called with %o', data)
  if (store.currentTask) {
    eventsBus.emit(store.currentTask, data)
  }
}
