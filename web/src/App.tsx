import React from 'react'
import { Switch, Route, Link, NavLink, Redirect, RouteProps } from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import Signup from './Signup'
import Setup from './Setup'
import Activity from './Activity'
import { ProvideAuth, useAuth } from './User'
import Nav from './Nav'

function PrivateRoute({children, ...rest}: RouteProps) {
  const { user } = useAuth()
  return (
    <Route {...rest}>
      {
        user
        ? children
        : <Redirect to='/login' />
      }
    </Route>
  )
}

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
          {/* <PrivateRoute path="/account">
            <Account />
          </PrivateRoute> */}
          <div className="flex flex-col justify-center">
            <div className="container mx-auto px-3 h-screen bg-white">
              <Nav />
              <Route path="/activity">
                <Activity />
              </Route>
              <Route path="/envelopes">
                <h1>Hello Envelopes</h1>
              </Route>
            </div>
          </div>
          <Route path="/link">
            <Setup />
          </Route>
          <Route>
          </Route>
        </Switch>
      </main>
    </ProvideAuth>
  )
}

export default App
