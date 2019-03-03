"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
var Name_1 = require("./Name");
var mapStateToProps = function (state) {
    return state;
};
exports.default = react_redux_1.connect(mapStateToProps, null)(Name_1.default);
