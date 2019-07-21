const EventEmitter = require('events')
const store = require('./store')
const debug = require('debug')('blix:events')

export const eventsBus = new EventEmitter()


export function emit(data: object) {
    debug('emit called with %o', data) 
    if (store['currentTask']) {
        eventsBus.emit(store.currentTask, data)
    }
}
