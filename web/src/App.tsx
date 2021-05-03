import React from 'react'
import { Switch, Route, Link, NavLink, Redirect, RouteProps } from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import Signup from './Signup'
import Setup from './Setup'
import Activity from './Activity'
import { ProvideAuth, useAuth } from './User'
import Nav from './Nav'
import { ProvideAccount } from './Accounts'
import Envelopes from './Envelopes'

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
          <PrivateRoute path="/link">
            <Setup />
          </PrivateRoute>
          <PrivateRoute>
            <ProvideAccount>
              <div className="flex flex-col justify-center">
                <div className="container mx-auto px-3 h-screen bg-white">
                  <Nav />
                  <PrivateRoute path="/activity">
                    <Activity />
                  </PrivateRoute>
                  <PrivateRoute path="/envelopes">
                    <Envelopes />
                  </PrivateRoute>
                  <PrivateRoute path="/envelopes">
                    <h1>Hello Envelopes</h1>
                  </PrivateRoute>
                </div>
              </div>
            </ProvideAccount>
          </PrivateRoute>
        </Switch>
      </main>
    </ProvideAuth>
  )
}

export default App
