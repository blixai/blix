import React, { Component } from "react";
import AppContainer from "../components/App/AppContainer";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <AppContainer />
      </div>
    );
  }
}

export default Home;