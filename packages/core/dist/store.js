"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const getDebug = debug_1.default('blix:core:store:get');
const setDebug = debug_1.default('blix:core:store:set');
const storeDebug = debug_1.default('blix:core:store');
const rootNamespace = 'blix:*';
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
};
function checkIfEnvChange(key, value) {
    if (key === 'env' && value === 'development') {
        debug_1.default.enable(rootNamespace);
        storeDebug('\nStore debugging enabled');
    }
    else if (key === 'env' && value !== 'development') {
        if (debug_1.default.enabled(rootNamespace)) {
            storeDebug('Store debugging disabled.');
        }
        debug_1.default.disable();
    }
}
const handler = {
    get(target, key) {
        const result = Reflect.get(target, key);
        if (debug_1.default.enabled(rootNamespace)) {
            getDebug('get %o. Current value is: %o', key, result);
        }
        return result;
    },
    set(_, key, value) {
        checkIfEnvChange(key, value);
        if (debug_1.default.enabled(rootNamespace)) {
            setDebug('set %o to %o', key, value);
        }
        return Reflect.set(_, key, value);
    },
};
module.exports = new Proxy(storeDefaults, handler);
