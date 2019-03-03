"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var name = function (state, action) {
    if (state === void 0) { state = null; }
    switch (action.type) {
        case 'NAME':
            return action.payload;
        default:
            return state;
    }
};
exports.default = name;
