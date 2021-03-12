import React from 'react'
// import Login from './Login.jsx'
import Signup from './Signup'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App () {
  return (
    <Router>
      <main id="ledger">
        {/* <Login /> */}
          <Switch>
            <Route path="/signup">
              <Signup />
            </Route>
          </Switch>
      </main>
    </Router>
  )
}

export default App
