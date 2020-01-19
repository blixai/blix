import Debug from 'debug'

const getDebug = Debug('blix:core:store:get')
const setDebug = Debug('blix:core:store:set')
const storeDebug = Debug('blix:core:store')

const rootNamespace = 'blix:*'

const storeDefaults = {
  backend: '',
  backendType: '',
  blixFailedToCheckForUpdates: false,
  blixNeedsUpdate: false,
  database: '',
  dependencies: '',
  devDependencies: '',
  e2e: '',
  frontend: '',
  linter: '',
  name: '',
  reactCSS: '',
  reactTesting: '',
  reactType: '',
  serverTesting: '',
  tasks: [],
  useYarn: '',
  vueTesting: '',
}

function checkIfEnvChange(key: string, value: string) {
  if (key === 'env' && value === 'development') {
    Debug.enable(rootNamespace)
    storeDebug('\nStore debugging enabled')
  } else if (key === 'env' && value !== 'development') {
    if (Debug.enabled(rootNamespace)) {
      storeDebug('Store debugging disabled.')
    }
    Debug.disable()
  }
}

const handler = {
  get(target: any, key: string) {
    const result = Reflect.get(target, key)
    if (Debug.enabled(rootNamespace)) {
      getDebug('get %o. Current value is: %o', key, result)
    }
    return result
  },
  set(_: object, key: string, value: any) {
    checkIfEnvChange(key, value)
    if (Debug.enabled(rootNamespace)) {
      setDebug('set %o to %o', key, value)
    }
    return Reflect.set(_, key, value)
  },
}

module.exports = new Proxy(storeDefaults, handler)
