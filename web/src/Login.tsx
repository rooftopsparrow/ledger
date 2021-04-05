import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useAuth } from './User'

function Login () {
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState<Error|null>(null)
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoggingIn(true)
    console.log("User attempting to log in", email, password)
    try {
      await login({ email, password })
    } catch (err) {
      setError(err)
    } finally {
      setIsLoggingIn(false)
    }
  }

  if (user) {
    return <Redirect to="/activity" />
  }

  return (
    <section className="flex items-center max-h-screen">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto m-10 bg-white p-5 rounded-sm shadow-lg">
          <header className="text-center">
            <h1 className="text-7xl font-serif text-green-500 hover:text-yellow-300 cursor-pointer font-semibold">
              <Link to="/">Ledger</Link>
            </h1>
            <p className="font-thin p-2">
              Integrated envelope budgeting for your existing bank
            </p>
          </header>
          <form id="login" onSubmit={handleSubmit} className="m-7">
            <fieldset>
              <legend className="text-sm font-thin pb-3">
                Welcome back!
              </legend>
              <div className="mb-3">
                <label htmlFor="email" className="block mb-2 text-sm text-gray-400">
                  Email
                </label>
                <input id="email" type="email" name="email" autoComplete="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-yellow-100"
                      value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="block mb-2 text-sm text-gray-400">
                  Password
                </label>
                <input type="password" name="password" value={password}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-yellow-100"
                      onChange={e => setPassword(e.target.value)} />
              </div>
            </fieldset>
            <div className="mt-3">
              <button type="submit" id="login-submit" form="login"
                      className="bg-green-500 text-white w-full px-3 py-2 hover:bg-yellow-300"
                      disabled={isLoggingIn}>
                { isLoggingIn ? 'Logging In...' : 'Log In' }
              </button>
              <p className="text-center font-thin text-sm m-3">Need an account? <Link to="/signup" className="text-green-500 px-1">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login
