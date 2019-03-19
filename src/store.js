const debug = require('debug')
const storeDebug = require('debug')('blix:store')
const getDebug = require('debug')('blix:store:get')
const setDebug = require('debug')('blix:store:set')

const store = {
  name: '',
  frontend: '',
  backend: '',
  backendType: '',
  database: '',
  serverTesting: '',
  e2e: '',
  reactTesting: '',
  vueTesting: '',
  reactType: '',
  dependencies: '',
  devDependencies: '',
  useYarn: '',
  reactCSS: '',
  linter: '',
  tasks: [],
}

function checkIfEnvChange (key, value) {
  if (key === 'env' && value === 'development') {
    debug.enable('blix:*')
    storeDebug('Store debugging enabled')
  } else if (key === 'env' && value !== 'development') {
    if (debug.enabled) {
      storeDebug('Store debugging disabled.')
    }
    debug.disable()
  }
}

const handler = {
  get(target, key) {
    let result = Reflect.get(target, key);
    if (debug.enabled) {
      getDebug('get %o. Current value is: %o', key, result);
    }
    return result
  },
  set(_, key, value) {
    checkIfEnvChange(key, value)
    if (debug.enabled) {
      setDebug('set %o to %o', key, value)
    }
    return Reflect.set(...arguments);
  }
}

store = new Proxy(store, handler)

module.exports = store
