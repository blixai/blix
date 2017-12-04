import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from '../Home/HomeContainer'
import PageNotFound from '../PageNotFound/PageNotFound'

class App extends Component {
  render() {
    return (
      <section>
        <Switch>
          <Route exact path='/' render={(history) => {
            return <Home history={history}/>
          }}/>
          <Route render={() => {
            return <PageNotFound/>
          }}/>
        </Switch>
      </section>
    )
  }
}

export default App