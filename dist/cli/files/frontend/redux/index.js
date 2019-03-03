"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var AppContainer_1 = require("./App/AppContainer");
var configStore_1 = require("./configStore");
var react_redux_1 = require("react-redux");
var store = configStore_1.configureStore();
react_dom_1.default.render(<react_redux_1.Provider store={store}>
    <AppContainer_1.default />
  </react_redux_1.Provider>, document.getElementById("root"));
