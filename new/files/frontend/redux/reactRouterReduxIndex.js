import React from "react";
import ReactDOM from "react-dom";
import Router from "./Router";
import { BrowserRouter, Route } from "react-router-dom";
import { configureStore } from "./configStore";
import { Provider } from "react-redux";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={Router} />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
