import React from 'react'
import { useAuth } from './User'
import { Profile } from './Profile'

export default function Home() {
  const { user } = useAuth()
  return (
    <div id="home_page">
      <section>
      </section>
    </div>
  )
}