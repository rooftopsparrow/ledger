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
  // Form values
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signUpError, setSignUpError] = useState<SignupError>(null)
  // submit handler 
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    // const form = event.currentTarget
    try {
      const result = await signUp({ fullName, email, password, confirm })
      // TODO: do something
      return result
    } catch (error) {
      setSignUpError(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  // 
  return (
    <section id="create-account">
      <header>
        <h1>Ledger</h1>
        <p>
          Integrate envelope budgeting into your existing bank.
        </p>
      </header>
      <form id="signup" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Sign Up for an Account</legend>
          <label htmlFor="fullName">Name</label>
          <input type="text" id="fullName" name="fullName" value={fullName} autoCorrect="off" autoComplete="off" autoCapitalize="off" onChange={ e => setFullName(e.target.value) } required />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" autoComplete="email" autoCorrect="off" value={email} onChange={ e => setEmail(e.target.value)} required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={ e => setPassword(e.target.value) } required />
          <label htmlFor="confirm">Confirm Password</label>
          <input type="password" id="confirm" name="confirm" value={confirm} onChange={ e => setConfirm(e.target.value) } required />
        </fieldset>
        <button id="signup_submit" type="submit" disabled={isSubmitting}>
          { isSubmitting ? 'Signing up...' : 'Create Account' }
        </button>
        {
            signUpError
          ? 
            <label form="signup">
              <em>{signUpError.message}</em>
            </label>
          : null
        }
      </form>
    </section>
  )
}