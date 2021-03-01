import React, { useState } from 'react'

export default function Signup () {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  function handleSubmit(event) {
    event.preventDefault()
    // fetch("/signup", { method: "POST",  })
    console.debug(fullName, email, password, confirm)
  }
  return (
    <section>
      <header>
        <h1>Sign Up</h1>
        <p>
          Integrate envelope budgeting into your existing bank.
        </p>
      </header>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" name="fullName" value={fullName} autoCorrect="off" autoComplete="off" autoCapitalize="off" onChange={e => setFullName(e.target.value)} />
        </label>
        <label>
          Email
          <input type="email" name="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <label>
          Confirm Password
          <input type="password" name="confirm" value={confirm} onChange={e => setConfirm(e.target.value) } />
        </label>
        <button type="submit">
          Create Account
        </button>
      </form>
    </section>
  )
}
