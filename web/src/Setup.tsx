import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { createLinkToken, createAccessToken } from './Api'
import PlaidLink from './PlaidLink'

export default function Setup (): ReactElement { 

  const [token, setToken] = useState<string|null>("foo")

  useEffect(() => {
    createLinkToken()
      .then(setToken)
      .catch(console.error)
  }, [])

  return (
    <section className="min-h-screen py-6 flex flex-col justify-center">
      <div className="relative px-4 py-10 bg-white shadow-lg">
        <div className="mx-auto text-center">
          <header>
            <h3 className="text-purple-800 font-serif font-extrabold text-5xl">Welcome to Ledger</h3>
          </header>
          <div className="text-base leading-6 text-gray-700">
          {
            (token == null)
            ? <p className="">
                Loading...
              </p>
            : <PlaidLink token={token} />
          }
          </div>
        </div>
      </div>
    </section>
  )
}