"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var App_vue_1 = require("./App.vue");
vue_1.default.config.productionTip = false;
new vue_1.default({
    render: function (h) { return h(App_vue_1.default); },
}).$mount('#root');
