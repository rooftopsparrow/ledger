
import React, { ReactElement, useCallback, useState } from 'react'
import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link'

type PlaidLinkProps = {
  token: string,
  o: (publicKey: string, metadata: object) => void
  onSuccess: (plaidState: object) => void
  onError: (error: Error) => void
}
export default function PlaidLink (opts: PlaidLinkProps): ReactElement {
  const [publicToken, setPublicToken] = useState<string|null>(null)
  const onSuccess = useCallback(
    (publicToken, metadata) => {
      console.debug('plaid: onSuccess', publicToken, metadata)
      setPublicToken(publicToken)
      // opts.onPublicKey(key, metadata)
    },
    []
  )
  const onEvent = useCallback(
    (eventName, metadata) => {
      console.debug('plaid: onEvent', eventName, metadata),
      switch (eventName) {
        case 'HANDOFF':
          
      }
    }
    []
  )
  const onExit = useCallback(
    (err, metadata) => {
      console.debug('plaid: onExit', err, metadata)
      if (err) {
        return opts.onError(err)
      } else {
        opts.onSuccess(metadata)
      }
    },
    []
  )
  const config: PlaidLinkOptions = {
    token: opts.token,
    onSuccess,
    onEvent,
    onExit
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
