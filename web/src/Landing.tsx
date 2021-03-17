import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useAuth } from './User'

export default function Landing() {

  const { user } = useAuth()

  if (user) {
    return <Redirect to="/activity" />
  }

  return(
    <section className="landing">
      <h1>LANDING PAGE 🥳</h1>
      <div>
        <Link to="/signup">Get Started</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
    </section>
  )
}