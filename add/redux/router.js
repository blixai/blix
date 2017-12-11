import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import AppContainer from '../App/AppContainer'

class App extends Component {
  render() {
    return (
      <section>
        <Switch>
          <Route exact path='/' render={(history) => {
            return <AppContainer/>
          }}/>
        </Switch>
      </section>
    )
  }
}

export default App 