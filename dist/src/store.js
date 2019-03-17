"use strict";
var debug = require('debug');
var storeDebug = require('debug')('blix:store');
var getDebug = require('debug')('blix:store:get');
var setDebug = require('debug')('blix:store:set');
var store = {
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
    linter: ''
};
function checkIfEnvChange(key, value) {
    if (key === 'env' && value === 'development') {
        debug.enable('blix:*');
        debug('Store debugging enabled');
    }
    else if (key === 'env' && value !== 'development') {
        if (debug.enabled) {
            storeDebug('Store debugging disabled.');
        }
        debug.disable();
    }
}
var handler = {
    get: function (target, key) {
        var result = Reflect.get(target, key);
        if (debug.enabled) {
            getDebug('get %o. Current value is: %o', key, result);
        }
        return result;
    },
    set: function (_, key, value) {
        checkIfEnvChange(key, value);
        if (debug.enabled) {
            setDebug('set %o to %o', key, value);
        }
        return Reflect.set.apply(Reflect, arguments);
    }
};
store = new Proxy(store, handler);
module.exports = store;
