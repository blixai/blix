import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from '../Home/HomeContainer'


class App extends Component {


  render() {
    return(
      <section>
        <Switch>
          <Route path='/' render={(history) => { 
            return <Home history={ history }/>
          }}/>
        </Switch>
      </section>
    )
  }
}

export default App