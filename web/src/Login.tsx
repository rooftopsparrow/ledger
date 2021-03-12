import React, { useState } from 'react'

import './Login.css'

function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log("User attempting to log in", email, password)
  }
  return (
    <section id="login">
      <header>
        <h2>Login</h2>
      </header>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">
          Login
        </button>
      </form>
    </section>
  )
}

export default Login
