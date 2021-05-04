import React from 'react'
import { Link } from 'react-router-dom'
import { Money } from './Money'
import { useAccount } from './Accounts'
import { useAuth } from './User'

export default function Balances () {
  const { account } = useAccount()
  const { user } = useAuth()
  return (
    <div className="py-3">
      <h2 className="font-bold text-xl">
        <Money value={account?.balances?.available || 0.00} /> <span className="font-light text-base text-gray-600 align-text-top">
          <span className="">Safe-to-Spend</span>
        </span>
      </h2>
      <ul className="inline-flex space-x-2">
        <li id="available-balance" className="text-sm">
          <h3><Money value={account?.balances?.available || 0.00} /> <span className="font-light text-xs text-gray-600">
              available balance
            </span>
          </h3>
        </li>
        <li id="scheduled-activity" className="text-sm">
          <h3><Money value={0.00} /> <span className="font-light text-xs text-gray-600">
              scheduled activity
            </span>
          </h3>
        </li>
        <li id="envelope-balance" className="text-sm">
          <h3>
            <Money value={0.00} /> <span className="font-light text-xs text-gray-600">
            in envelopes</span>
          </h3>
        </li>
      </ul>
      <div className="py-3">
        {
          user
            && !user.accessToken
            && (
              <p>You have not linked your account!
                <Link
                  className="bg-purple-800 text-yellow-300 ml-3 px-4 py-2 text-center"
                  to="/link"
                >
                  Link Account
                </Link>
              </p>
            )
        }
      </div> 
    </div>
  )
}