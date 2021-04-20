import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { createLinkToken, createAccessToken } from './Api'
import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link'
import { Redirect } from 'react-router'

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

export default function Setup (): ReactElement { 

  const [linkToken, setLinkToken] = useState<string>('')
  const [publicToken, setPublicToken] = useState<string>()
  const [complete, setComplete] = useState(false)
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const onLoad = useCallback(
    (...args) => console.debug('plaid: onLoad', args),
    []
  )

  const onSuccess = useCallback(
    (publicToken, metadata) => {
      console.debug('plaid: onSuccess', publicToken, metadata)
      setPublicToken(publicToken)
    },
    []
  )

  const onEvent = useCallback(
    (eventName, metadata) => {
      console.debug('plaid: onEvent', eventName, metadata)
      switch (eventName) {
        case 'HANDOFF':
          setComplete(true)
      }
    },
    []
  )

  const onExit = useCallback(
    (err, metadata) => {
      console.debug('plaid: onExit', err, metadata)
    },
    []
  )

  useEffect(() => {
    createLinkToken().then((token) => {
      console.log('created link token', token)
      setLinkToken(token)
    }).catch((error) => {
      console.error('error creating linkToken', error)
    })
  }, [])

  useEffect(() => {
    if (publicToken) {
      createAccessToken(publicToken).then((...args) => {
        console.debug('created access token', ...args)
      }).catch(error => {
        console.error('error creating access token')
      })
    }
  }, [publicToken])

  const config = {
    token: linkToken,
    onLoad,
    onEvent,
    onSuccess,
    onExit
  }
  const { open, ready, error } = usePlaidLink(config)

  if (complete) return (<Redirect to="/activity" />)

  return (
    <section className="min-h-screen py-6 flex flex-col justify-center">
      <div className="px-16">
        <div className="py-10 bg-white shadow-lg text-center">
          <header>
            <h3 className="text-purple-800 font-serif font-extrabold text-5xl">Welcome to Ledger</h3>
          </header>
          <div>
            <p className="text-2xl font-thin text-black pt-5">
              <span>①</span> Link Ledger to your bank account using Plaid.
            </p>
            <p className="text-2xl font-thin text-gray-400 pt-1">
              <span>②</span> Sync account balances and transactions.
            </p>
            <p className="text-2xl font-thin text-gray-400 pt-1">
              <span>③</span> Enjoy a simpler budgeting experience.
            </p>
          </div>
          <div className="text-base leading-6 text-gray-700">
          { !complete
            ?
              <button
                disabled={!ready}
                onClick={() => open()}
                className="px-36 py-3 mt-4 bg-purple-800 hover:bg-purple-600 text-yellow-200 shadow-lg rounded-md">
                { ready ? "Link Account" : <Loading /> }
              </button>
            : null
          }
          {
            complete ? 
            <span>
              Link Completed
            </span>
            : 
            null
          }
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