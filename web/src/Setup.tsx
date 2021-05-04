import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { Redirect } from 'react-router'
import { Account, createLinkToken, createAccessToken } from './PlaidApi'
import { getTransactions,  } from './Accounts'
import { useAuth } from './User'
import Loading from './Loading'

interface LinkDetails {
  public_token: string
  accounts: Array<Account>
}

type StepProps = {
  onComplete: (error?: ErrorEvent|Error) => void
}

type LinkAccountProps = {
  onLink: (details: LinkDetails) => void,
  linkToken: string,
} & StepProps

function LinkAccount (props: LinkAccountProps) {
  const [handoff, setHandoff] = useState(false)
  const onSuccess = useCallback(
    (_, metadata: LinkDetails) => {
      console.debug('plaid: onSuccess', metadata)
      props.onLink(metadata)
    },
    []
  )
  const onEvent = useCallback(
    (eventName, metadata) => {
      console.debug('plaid: onEvent', eventName, metadata)
      switch (eventName) {
        case 'HANDOFF':
          setHandoff(true)
      }
    },
    []
  )
  const { open, ready, error } = usePlaidLink({
    token: props.linkToken,
    onEvent,
    onSuccess
  })
  useEffect(() => {
    if (error || handoff) {
      error ? props.onComplete(error) : props.onComplete()
    }
  }, [handoff])
  return (
    <button
      disabled={!ready}
      onClick={() => open()}
      className="px-36 py-3 mt-4 bg-purple-800 hover:bg-purple-600 text-yellow-200 shadow-lg rounded-md">
      { ready ? "Link Account" : <Loading />}
    </button>
  )
}

type LoadAccountsProps = StepProps & {
  linkDetails: LinkDetails
}

function LoadAccounts (props: LoadAccountsProps): ReactElement {
  const { user, setAccessToken } = useAuth()
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (confirmed) {
      setLoading(true)
      createAccessToken(props.linkDetails.public_token).then((token: string) => {
        console.debug('created access token', token)
        setAccessToken(token)
        return getTransactions()
      }).then(() => {
        props.onComplete()
      }).catch(error => {
        console.error('error creating access token', error)
        props.onComplete(error)
        setLoading(false)
      })
    }
  }, [confirmed])
  return (
    <div>
      <p>Sync balances and transactions your linked accounts</p>
      <ol>
        {
          props.linkDetails.accounts.map(a => {
            return (
              <li>
                <span>{a.name}</span>
              </li>
            )
          })
        } 
      </ol>
      {
        loading
        ?
        <p><Loading /></p>
        :
        <button
          className="px-36 py-3 mt-4 bg-purple-800 hover:bg-purple-600 text-yellow-200 shadow-lg rounded-md"
          type="button" onClick={() => setConfirmed(true)}>
          Sync Accounts
        </button>
      }
    </div>
  )
}

function Done (props: StepProps) {
  return (
    <button
      onClick={() => props.onComplete()}
    >
      Get to it!
    </button>
  )
}

export default function Setup (): ReactElement {
  // const [accounts, setAccounts] = useState<>()
  const [linkToken, setLinkToken] = useState<string>('')
  const [linkDetails, setLinkDetails] = useState<LinkDetails>()
  const TOTAL_STEPS = 3
  const [step, setStep] = useState(1)
  const [error, setError] = useState<Error>()
  const [complete, setComplete] = useState(false)
  
  const nextStep = useCallback((error) => {
    if (error) return setError(error)
    if (step >= TOTAL_STEPS) {
      return setComplete(true)
    }
    return setStep(step => step + 1)
  }, [step])

  useEffect(() => {
    createLinkToken().then((token) => {
      console.log('created link token', token)
      setLinkToken(token)
    }).catch((error) => {
      console.error('error creating linkToken', error)
    })
  }, [])

  if (complete) return (<Redirect to="/activity" />)
  return (
    <section className="min-h-screen py-6 flex flex-col justify-center">
      <div className="px-16">
        <div className="py-10 bg-white shadow-lg text-center">
          <header>
            <h3 className="text-purple-800 font-serif font-extrabold text-5xl">Welcome to Ledger</h3>
          </header>
          <div className="text-2xl font-thin text-gray-300">
            <p className={`pt-5 ${step >= 1 ? 'text-black' : ''}`}>
              <span>①</span> Link Ledger to your bank account using Plaid
            </p>
            <p className={`${ step >= 2 ? 'text-black' : ''}`}>
              <span>②</span> Sync account balances and transactions
            </p>
            <p className={`${ step >= 3 ? 'text-black' : ''}`}>
              <span>③</span> Enjoy a simpler budgeting experience
            </p>
            <button
              onClick={() => setComplete(true) }
              className="underline font-extralight text-yellow-300 text-xs"
            >
              Skip Setup
            </button>
          </div>
          <div className="text-base pt-5 text-gray-700">
          { linkToken && step === 1 && <LinkAccount
            linkToken={linkToken}
            onLink={setLinkDetails}
            onComplete={nextStep}
            />
          }
          { linkDetails && step === 2 && <LoadAccounts
              linkDetails={linkDetails}
              onComplete={nextStep}
              />
          }
          { step === 3 && <Done onComplete={nextStep} /> }
          { (error != null)
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