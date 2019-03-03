"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var Router_1 = require("./Router");
var react_router_dom_1 = require("react-router-dom");
react_dom_1.default.render(<react_router_dom_1.BrowserRouter>
    <Router_1.default />
  </react_router_dom_1.BrowserRouter>, document.getElementById("root"));
