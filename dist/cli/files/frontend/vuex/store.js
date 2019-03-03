"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vuex_1 = require("vuex");
vue_1.default.use(vuex_1.default);
exports.default = new vuex_1.default.Store({
    strict: process.env.NODE_ENV !== "production",
    modules: {}
});
