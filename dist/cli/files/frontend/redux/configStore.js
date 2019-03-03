"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var rootReducer_1 = require("./reducers/rootReducer");
var devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
exports.configureStore = function () {
    return redux_1.createStore(rootReducer_1.default, devTools);
};
