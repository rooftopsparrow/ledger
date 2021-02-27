import React, { useState } from 'react'

import './Login.css'

function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  function handleSubmit (event) {
    event.preventDefault()
    console.log("User attempting to log in", email, password)
  }
  return (
    <div id="login">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" autocomplete="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
