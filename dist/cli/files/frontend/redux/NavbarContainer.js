"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
var Navbar_1 = require("./Navbar");
var mapStateToProps = function (state) {
    return state;
};
exports.default = react_redux_1.connect(mapStateToProps, null)(Navbar_1.default);
