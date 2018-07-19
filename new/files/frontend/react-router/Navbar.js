import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="navbar">
        <h3>
          <NavLink to="/">Home</NavLink>
        </h3>
        <ul>
          <li className="navbar-links">
            <NavLink to="/about">About</NavLink>
          </li>
          <li className="navbar-links">
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default Navbar;
