import React, { useState } from 'react'
import { Redirect, Link } from "react-router-dom"
import { useAuth } from './User'

type SignupError = Error | null

export default function Signup () {
  // Form values
  const { user, signup } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signUpError, setSignUpError] = useState<SignupError>(null)
  // submit handler, bubble up the new user 
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await signup({ fullName, email, password, confirm })
    } catch (error) {
      setSignUpError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (user) {
    return <Redirect to="/home" />
  }

  return (
    <section className="flex items-center max-h-screen">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto m-10 bg-white p-5 rounded-sm shadow-lg">
          <header className="text-center">
            <h1 className="text-7xl font-serif text-green-500 hover:text-yellow-300 font-semibold">
              <Link to="/">Ledger</Link>
            </h1>
            <p className="font-thin text-md p-2">
              Integrated envelope budgeting for your existing bank
            </p>
          </header>
          <form id="signup" onSubmit={handleSubmit} className="m-7">
            <fieldset>
              <legend className="text-sm font-thin pb-3">
                Create an Account
              </legend>
              <div className="mb-3">
                <label htmlFor="fullName" className="block mb-2 text-sm text-gray-400">
                  Name
                </label>
                <input type="text" id="fullName" name="fullName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-yellow-100"
                      value={fullName} autoCorrect="off" autoComplete="off" autoCapitalize="off"
                      onChange={ e => setFullName(e.target.value) } required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="block mb-2 text-sm text-gray-400">
                  Email
                </label>
                <input type="email" id="email" name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-yellow-100"
                      autoComplete="email" autoCorrect="off" value={email}
                      onChange={ e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="block mb-2 text-sm text-gray-400">
                  Password
                </label>
                <input type="password" id="password" name="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-yellow-100"
                      value={password} onChange={ e => setPassword(e.target.value) } required />
              </div>
              <div className="mb-3">
                <label htmlFor="confirm" className="block mb-2 text-sm text-gray-400">
                  Confirm Password
                </label>
                <input type="password" id="confirm" name="confirm"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-yellow-100"
                       value={confirm} onChange={ e => setConfirm(e.target.value) } required />
              </div>
            </fieldset>
            <div className="mt-3">
              <button form="signup" id="signup_submit" type="submit"
                      className="bg-green-500 text-white w-full px-3 py-2 hover:bg-yellow-300"
                      disabled={isSubmitting}>
                { isSubmitting ? 'Creating Account...' : 'Create Account' }
              </button>
              <p className="text-center font-thin text-sm m-3">Already have an account? <Link to="/login" className="text-green-600 px-1">
                  Log In
                </Link>
              </p>
            </div>
            {
                signUpError
              ? 
                <label form="signup">
                  <em>{signUpError.message}</em>
                </label>
              : null
            }
          </form>
        </div>
      </div>
    </section>
  )
}