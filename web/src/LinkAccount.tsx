import React, { useState, useCallback } from 'react'
import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link';

type PlaidLinkCallback = (token: string, metadata: object) => void

export default function LinkAccount() {
  const [linkToken, setLinkToken] = useState<string|null>(null)
  const onSuccess = useCallback<PlaidLinkCallback>((token, metadata) => {
    console.debug('Plaid: got success', token, metadata)
    setLinkToken(token)
  }, [])
  const config: PlaidLinkOptions = {
    token: 'foobar',
    onSuccess: onSuccess,
    onEvent: (...args: any[]) => console.debug('Plaid: got event', args),
    onExit: (...args: any[]) => console.debug('Plaid: got exit', args),
    onLoad: (...args: any[]) => console.debug('Plaid: got load', args)
  }
  const { open, ready, error } = usePlaidLink(config)
  if (error) {
    return (
      <p>
        There was an error linking your account.
        <pre><code>{ error }</code></pre>
      </p>
    )
  }
  return (
    <section>
      <header>
        <h1>Link Your Account</h1>
      </header>
      <button type="button" onClick={() => open()} disabled={!ready} />
    </section>
  )
}