
import React, { ReactElement, useCallback } from 'react'
import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link'

type PlaidLinkProps = { token: string }
export default function PlaidLink (opts: PlaidLinkProps): ReactElement {
  const onSuccess = useCallback(
    (token, metadata) => console.log('plaid: onSuccess', token, metadata),
    []
  )
  const onEvent = useCallback(
    (eventName, metadata) => console.log('plaid: onEvent', eventName, metadata),
    []
  )
  const onExit = useCallback(
    (err, metadata) => console.log('plaid: onExit', err, metadata),
    []
  )
  const config: PlaidLinkOptions = {
    token: opts.token,
    onSuccess,
    onEvent,
    onExit,
  }
  const { open, ready, error } = usePlaidLink(config)
  return (
    <div className="text-center">
      <button
        type="button"
        className="px-36 py-3 mt-4 bg-purple-800 hover:bg-purple-600 text-yellow-200 shadow-lg rounded-md"
        onClick={() => open()}
        disabled={!ready || error != null}>
        Link Account
      </button>
      <p className="pt-2">
        To begin, link your bank account to Ledger using <a className="text-gray-900 font-semibold underline" href="https://plaid.com">Plaid</a>.
      </p>
    </div>
  )
}
