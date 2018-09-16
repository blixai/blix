import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./App/AppContainer";
import { configureStore } from "./configStore";
import { Provider } from "react-redux";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
      <AppContainer/>
  </Provider>,
  document.getElementById("root")
);
