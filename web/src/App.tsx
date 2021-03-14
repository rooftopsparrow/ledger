import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import Signup from './Signup'
import Home from './Home'
import { ProvideAuth } from './User'

function App () {
  return (
    <ProvideAuth>
      <main id="ledger" className="bg-green-400 w-full h-screen">
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
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
