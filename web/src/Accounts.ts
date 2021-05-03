import { createElement, createContext, useContext, useState } from 'react'
import { Transaction, Account, Balances, TransactionsResponse } from './PlaidApi'

interface AccountContext {
  account: Account|null
  transactions: Array<Transaction>
  loadAccount: () => Promise<void>
  loadBalance: () => Promise<void>
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

function useAccountState(): AccountContext {
  const [account, setAccount] = useState<Account|null>(null)
  const [balance, setBalance] = useState<Balances|null>(null)
  const [transactions, setTransactions] = useState<Array<Transaction>>([])
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
  return {
    account,
    transactions,
    loadAccount,
    loadBalance,
    error
  }
}

const noop = async () => {
  throw new Error('Invalid Context! This state is being used out of the provider') 
}

const accountContext = createContext<AccountContext>({
  account: null,
  transactions: [],
  loadAccount: noop,
  loadBalance: noop,
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
