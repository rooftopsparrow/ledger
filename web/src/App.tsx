import React from 'react'
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import Signup from './Signup'
import Activity from './Activity'
import { ProvideAuth, useAuth } from './User'

function PrivateRoute({children, ...rest}: RouteProps) {
  const { user } = useAuth()
  return (
    <Route {...rest}>
      user
      ? { children }
      : <Redirect to='/login' />
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
          <Route path="/activity">
            <Activity />
          </Route>
        </Switch>
      </main>
    </ProvideAuth>
  )
}

export default App
