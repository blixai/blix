"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
var App_1 = require("./App");
var mapStateToProps = function (state) {
    return state;
};
exports.default = react_redux_1.connect(mapStateToProps, null)(App_1.default);
