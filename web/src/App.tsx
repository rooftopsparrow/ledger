import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Signup from './Signup'
import Landing from './Landing'
import Home from './Home'
import { ProvideAuth } from './User'

function App () {
  return (
    <ProvideAuth>
      <main id="ledger">
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
        </Switch>
      </main>
    </ProvideAuth>
  )
}

export default App
