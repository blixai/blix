import React from "react";
import ReactDOM from "react-dom";
import Router from "./Router";
import { BrowserRouter, Route } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

const history = createHistory();

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={Router} />
  </BrowserRouter>,
  document.getElementById("root")
);
