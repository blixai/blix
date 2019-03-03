"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var Router_1 = require("./Router");
var react_router_dom_1 = require("react-router-dom");
var configStore_1 = require("./configStore");
var react_redux_1 = require("react-redux");
var store = configStore_1.configureStore();
react_dom_1.default.render(<react_redux_1.Provider store={store}>
    <react_router_dom_1.BrowserRouter>
      <Router_1.default />
    </react_router_dom_1.BrowserRouter>
  </react_redux_1.Provider>, document.getElementById("root"));
