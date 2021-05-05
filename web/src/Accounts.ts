import { createElement, createContext, useContext, useCallback, useState } from 'react'
import { Transaction, Account, Balances, Envelope, TransactionsResponse } from './PlaidApi'

interface AccountContext {
  account: Account|null
  transactions: Array<Transaction>
  envelopes: Array<Envelope>
  loadAccount: () => Promise<void>
  loadBalance: () => Promise<void>
  loadEnvelopes: () => Promise<void>
  appendEnvelope: (e: Envelope) => void
  removeEnvelope: (e: Envelope) => void
  updateEnvelope: (e: Envelope) => void
  spendFromEnvelope: (e: Envelope, trx: Transaction) => void
  error: Error|null
}

export async function getTransactions (): Promise<TransactionsResponse> {
  const response = await fetch('/api/get_transactions', { method: 'POST' })
  if (response.ok) {
    // TODO: Assert json is of type TransactionsResponse
    const data = await response.json() as TransactionsResponse
    // data.transactions = data.transactions.slice(0, 11)
    return data
  }
  throw new Error(response.statusText)
}

export async function getBalances(): Promise<any> {
  const response = await fetch('/api/get_account_balances', { method: 'POST' })
  if (response.ok) {
    const data = await response.json()
    return data
  }
  throw new Error(response.statusText)
}

export async function getEnvelopes(): Promise<Array<Envelope>> {
  const response = await fetch('/api/get_envelopes', { method: 'POST' })
  if (response.ok) {
    const data = await response.json()
    return data as Array<Envelope>
  }
  throw new Error(response.statusText)
}

function useAccountState(): AccountContext {
  const [account, setAccount] = useState<Account|null>(null)
  const [balance, setBalance] = useState<Balances|null>(null)
  const [transactions, setTransactions] = useState<Array<Transaction>>([])
  const [envelopes, setEnvelopes] = useState<Array<Envelope>>([])
  const [error, setError] = useState<Error|null>(null)

  async function loadAccount () {
    const {transactions, accounts} = await getTransactions()
    // TODO: Protected envelopes are actually savings accounts.
    const account = accounts.find((a: Account) => {
      return a.type === "depository" && a.subtype === "checking"
    })
    if (!account) {
      return setError(new Error('No Checking Account!'))
    }
    const accntTransacitons = transactions.filter(t => {
      return t.account_id === account.account_id
    })
    setAccount(account)
    setTransactions(accntTransacitons)
  }
  async function loadBalance () {
    getBalances().then()
  }
  async function loadEnvelopes () {
    const envelopes = await getEnvelopes()
    setEnvelopes(envelopes)
  }
  const appendEnvelope = useCallback((e: Envelope) => {
    setEnvelopes(current => [...current, e])
  }, [])
  const removeEnvelope = useCallback((e: Envelope) => {
    setEnvelopes(current => {
      return current.filter(c => c.id != e.id)
    })
  }, [])
  const updateEnvelope = useCallback((e: Envelope) => {
    setEnvelopes(current => {
      return current.map((c) => {
        if (c.id == e.id) return {...c, ...e}
        return c
      })
    })
  }, [])
  const spendFromEnvelope = useCallback((e: Envelope, trx: Transaction) => {
    setTransactions(current => {
      return current.map(c => {
        if (c.transaction_id == trx.transaction_id) {
          return {...c, envelope_id: e.id }
        }
        return c
      })
    })
    setEnvelopes(current => {
      return current.map((c) => {
        if (c.id == e.id) {
          return {...c, balance: (c.balance - Math.min(c.balance, trx.amount)) }
        }
        return c
      })
    }) 
  }, [envelopes, transactions])
  return {
    account,
    transactions,
    envelopes,
    loadAccount,
    loadBalance,
    loadEnvelopes,
    appendEnvelope,
    removeEnvelope,
    updateEnvelope,
    spendFromEnvelope,
    error
  }
}

const noop = async () => {
  throw new Error('Invalid Context! This state is being used out of the provider') 
}

const accountContext = createContext<AccountContext>({
  account: null,
  transactions: [],
  envelopes: [],
  loadAccount: noop,
  loadBalance: noop,
  loadEnvelopes: noop,
  appendEnvelope: noop,
  removeEnvelope: noop,
  updateEnvelope: noop,
  spendFromEnvelope: noop,
  error: new Error('Invalid Context! This is used out of context')
})

// React component for hydrating the context of the tree
export function ProvideAccount(props: { children?: React.ReactNode }) {
  const account = useAccountState()
  return createElement(accountContext.Provider, { value: account }, props.children)
}

export function useAccount() {
  return useContext(accountContext)
}
