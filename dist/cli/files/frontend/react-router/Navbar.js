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
var react_router_dom_1 = require("react-router-dom");
require("./Navbar.css");
var Navbar = /** @class */ (function (_super) {
    __extends(Navbar, _super);
    function Navbar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    Navbar.prototype.render = function () {
        return (<div id="navbar">
        <h3>
          <react_router_dom_1.NavLink to="/">Home</react_router_dom_1.NavLink>
        </h3>
        <ul>
          <li className="navbar-links">
            <react_router_dom_1.NavLink to="/about">About</react_router_dom_1.NavLink>
          </li>
          <li className="navbar-links">
            <react_router_dom_1.NavLink to="/contact">Contact</react_router_dom_1.NavLink>
          </li>
        </ul>
      </div>);
    };
    return Navbar;
}(react_1.Component));
exports.default = Navbar;
