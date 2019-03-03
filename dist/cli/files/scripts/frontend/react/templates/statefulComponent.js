"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
require("./Name.css");
var Name = /** @class */ (function (_super) {
    __extends(Name, _super);
    function Name(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    Name.prototype.render = function () {
        return (<div>
        Hello Name
      </div>);
    };
    return Name;
}(react_1.Component));
exports.default = Name;
