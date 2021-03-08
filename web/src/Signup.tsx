import React, { useState } from 'react'

import './Signup.css'

export interface UserForm {
  fullName: string,
  email: string,
  password: string,
  confirm: string,
}

export interface NewUser extends UserForm {
  token: string
}

type SignupError = Error | null

export async function signUp (user: UserForm): Promise<NewUser> {
  const response = await fetch("/signup", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  let data = await response.json()
  if (!response.ok) {
    throw new Error(data.message)
  }
  return data
}


export default function Signup () {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<SignupError>(null)
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await signUp({ fullName, email, password, confirm })
      // TODO: do something
      return result
    } catch (error) {
      setError(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <section id="signup">
      <header>
        <h1>Sign Up</h1>
        <p>
          Integrate envelope budgeting into your existing bank.
        </p>
      </header>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" name="fullName" value={fullName} autoCorrect="off" autoComplete="off" autoCapitalize="off" onChange={e => setFullName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" name="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <label>
          Confirm Password
          <input type="password" name="confirm" value={confirm} onChange={e => setConfirm(e.target.value) } required />
        </label>
        <legend>
          {
            error
            ? <p>{error.message}</p>
            : null
          }
        </legend>
        <button type="submit" disabled={isSubmitting}>
          { isSubmitting ? 'Signing up...' : 'Create Account' }
        </button>
      </form>
    </section>
  )
}