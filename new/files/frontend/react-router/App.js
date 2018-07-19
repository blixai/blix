import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from './views/Home'

class App extends Component {
  render() {
    return (
      <section>
        <Switch>
          <Route exact path='/' render={(history) => {
            return <Home history={history}/>
          }}/>
        </Switch>
      </section>
    )
  }
}

export default App