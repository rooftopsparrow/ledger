import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { createLinkToken, createAccessToken } from './Api'
// import PlaidLink from './PlaidLink'
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'

function Loading () {
  return (
    <span className="inline-flex items-center text-base">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg> Loading...
    </span>
  )
}

type Plaid = {
  ready: boolean,
  error: ErrorEvent | Error | null,
  open: Function
}

type SetupProps = {
  linkToken: string,
}

export default function Setup (props: SetupProps): ReactElement { 

  const onSuccess = useCallback(
    (publicToken, metadata) => {
      console.debug('plaid: onSuccess', publicToken, metadata)
    },
    []
  )

  const onEvent = useCallback(
    (eventName, metadata) => {
      console.debug('plaid: onEvent', eventName, metadata)
    },
    []
  )

  const options: PlaidLinkOptions = {
    token: props.linkToken,
    onSuccess,
    onEvent
  }

  const { open, ready, error } = usePlaidLink(options)
  // useEffect(() => {
  //   if (key) {
  //     createAccessToken(key)
  //       .then(() => {
  //         console.log('access token')
  //       })
  //       .catch((error) => {
  //         console.error(error)
  //         setError(error)
  //       })
  //   }
  // }, [key])

  return (
    <section className="min-h-screen py-6 flex flex-col justify-center">
      <div className="relative px-4 py-10 bg-white shadow-lg">
        <div className="mx-auto text-center">
          <header>
            <h3 className="text-purple-800 font-serif font-extrabold text-5xl">Welcome to Ledger</h3>
          </header>
          <div className="text-base leading-6 text-gray-700">
          <button
            className="px-36 py-3 mt-4 bg-purple-800 hover:bg-purple-600 text-yellow-200 shadow-lg rounded-md"
            disabled={!ready}
          >
            { ready ? "Link Account" : <Loading /> }
          </button>
          {
            (error != null)
            ? <p>
                { error.message }
              </p>
            : null
          }
          </div>
        </div>
      </div>
    </section>
  )
}