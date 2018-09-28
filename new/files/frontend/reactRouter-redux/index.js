import React from "react";
import ReactDOM from "react-dom";
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "../redux/configStore";
import { Provider } from "react-redux";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
