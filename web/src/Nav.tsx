import React, { useCallback } from 'react'
import { useAuth }  from './User'
import { NavLink } from 'react-router-dom'

export default function Nav () {
  const { logout } = useAuth()
  const onLogout = useCallback(async () => {
    await logout()
  }, [])
  return (
    <nav>
      <ul className="inline-flex space-x-1 pb-1">
        <li className="pt-2">
          <NavLink to="/activity" className="px-2 py-1  hover:bg-yellow-200" activeClassName="bg-yellow-300">
            Activity
          </NavLink>
        </li>
        <li className="pt-2">
          <NavLink to="/envelopes" className="px-2 py-1  hover:bg-yellow-200" activeClassName="bg-yellow-300">
            Envelopes
          </NavLink>
        </li>
        <li className="pt-2">
          <NavLink to="/settings" className="px-2 py-1  hover:bg-yellow-200" activeClassName="bg-yellow-300">
            Settings</NavLink></li>
        <li className="pt-2">
          <NavLink to="/login" className="px-2 py-1  hover:bg-yellow-200" activeClassName="bg-yellow-300" onClick={onLogout}>
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}