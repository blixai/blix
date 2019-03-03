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
require("./App.css");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    App.prototype.render = function () {
        return (<div className="App">
        <div className="App-header">
          <img src="https://s3.us-east-2.amazonaws.com/blix/logo.png" alt="blix" className="logo-small"/>
          <h1 className="App-title">Welcome to Blix</h1>
            <p className="App-intro">
            <a href="https://blixjs.com/" target="_blank" rel="noopener noreferrer">Automate all-the-things</a>
            </p>
        </div>
        <img src="https://s3.us-east-2.amazonaws.com/blix/gear.svg" className="App-logo" alt="logo"/>
      </div>);
    };
    return App;
}(react_1.Component));
exports.default = App;
