import React, { useCallback } from 'react'
import { useAuth }  from './User'
import { NavLink } from 'react-router-dom'

export default function Nav () {
  const { logout } = useAuth()
  const onLogout = useCallback(async () => {
    await logout()
  }, [])
  return (
    <nav className="inline-flex">
      <span className="text-3xl font-serif pr-5">Ledger</span>
      <ul className="inline-flex space-x-1 pb-1">
        <li className="pt-2">
          <NavLink to="/activity" className="px-2 py-1 border-b-2 border-transparent border-b-solid hover:border-purple-800" activeClassName="border-purple-800">
            Activity
          </NavLink>
        </li>
        <li className="pt-2">
          <NavLink to="/envelopes" className="px-2 py-1 border-b-2 border-transparent border-b-solid hover:border-purple-800" activeClassName="border-purple-800">
            Envelopes
          </NavLink>
        </li>
        <li className="pt-2">
          <NavLink to="/settings" className="px-2 py-1 border-b-2 border-transparent border-b-solid hover:border-purple-800" activeClassName="border-purple-800">
            Settings
          </NavLink>
        </li>
        <li className="pt-2">
          <NavLink to="/login" className="px-2 py-1 border-b-2 border-transparent border-b-solid hover:border-red-500" onClick={onLogout}>
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}