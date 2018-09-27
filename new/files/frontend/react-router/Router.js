import React, {Component, Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './views/Home';

class Router extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path='/' component={Home} />
        </Switch>
      </Fragment>
    )
  }
}

export default Router