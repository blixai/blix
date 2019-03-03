"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var Home_vue_1 = require("./views/Home.vue");
vue_1.default.use(vue_router_1.default);
exports.default = new vue_router_1.default({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home_vue_1.default
        }
    ]
});
