import React, { Component } from "react";
import Navbar from "../components/Navbar/Navbar";
import "../styles/global.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="App">
          <div className="App-header">
            <img src="https://s3.us-east-2.amazonaws.com/blix/logo.png" alt="blix" className="logo-small"/>
            <h1 className="App-title">Welcome to Blix</h1>
              <p className="App-intro">
              <a href="https://blixjs.com/" target="_blank" rel="noopener noreferrer">Automate all-the-things</a>
              </p>
          </div>
          <img src="https://s3.us-east-2.amazonaws.com/blix/gear.svg" className="App-logo" alt="logo"/>
        </div>
      </div>
    );
  }
}

export default Home;
