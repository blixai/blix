import React, { Component } from "react";
import App from "../components/App/App";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <App/>
      </div>
    );
  }
}

export default Home;
