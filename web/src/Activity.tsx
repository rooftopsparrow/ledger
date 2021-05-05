import React, { useCallback, useEffect, useState, ReactElement, useMemo } from 'react'
import { useAccount } from './Accounts'
import { Money } from './Money'
import { Transaction, Envelope } from './PlaidApi'
import { DateTime } from 'luxon'
import { useAuth } from './User'
import Loading from './Loading'

export default function Account() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Transaction>()
  const {
    transactions,
    loadAccount,
    envelopes,
    spendFromEnvelope,
    error: accountError
  } = useAccount()

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        await loadAccount()
      } catch (error) {
        console.error('error loading account', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const onSelect = useCallback((transaction?: Transaction) => {
    if (transaction) {
      setSelected(transaction)
    } else {
      setSelected(undefined)
    }
  }, [selected])

  return (
    <div className="grid grid-cols-9">
      <div className="col-span-6 gap-x-2">
        <ol className="overflow-y-auto" style={{maxHeight: '83vh'}}>
          {
            loading
            ? <Loading spinnerClass="text-purple-600" />
            : transactions.map((transaction, index, arr) => {
              const isSelected = transaction.transaction_id === selected?.transaction_id
              const prev = arr[index - 1]
              const dateDiff = transaction.date !== prev?.date
              const spentFrom = transaction.envelope_id != null
                && envelopes.find(e => e.id == transaction.envelope_id)
              return (
                <>
                {
                  dateDiff
                  ? <li key={transaction.date}
                      className="py-2 text-sm px-2 bg-white">
                      {transaction.date}
                    </li>
                    : null
                }
                <li
                  key={transaction.transaction_id}
                  className={`border border-gray-100 px-2 py-2 hover:bg-purple-50 cursor-pointer ${index % 2 == 1 ? 'bg-gray-50' : 'bg-gray-100'} ${isSelected ? 'bg-purple-100' : ''}`}
                  onClick={onSelect.bind(null, transaction)}
                >
                  <TransactionItem
                    name={transaction.name} 
                    amount={transaction.amount}
                    category={transaction.category[0]}
                    spendFrom={spentFrom ? spentFrom.name : undefined} 
                  />
                </li>
                </>
              )
            })
          }
        </ol>
      </div>
      <div className="col-span-3">
        {
          selected
          ? (
            <aside className="px-5">
              <header className="bg-purple-400 text-white flex flex-inline py-2 align-middle">
                  <button
                    type="button"
                    className="px-3"
                    onClick={() => setSelected(undefined)}>
                      ⇽
                  </button>
                  <h3 className="text-lg font-semibold">
                    Posted Transaction
                  </h3>
              </header>
              <TransactionDetails key={selected.transaction_id} transaction={selected} />
            </aside>
          ) : null
        }
      </div>
    </div>
  )
}


type TransactionItemProps = {
  name: string,
  amount: number,
  spendFrom?: string,
  pending?: string,
  category: string,
}

function TransactionItem (props: TransactionItemProps): ReactElement {
  return (
    <div className="grid grid-cols-5 gap-x-5">
      <span className="vendor-name font-bold col-span-3">
        {props.name}
      </span>
      <span className="col-span-2 text-right">
        <Money value={props.amount} colorized inverted/>
      </span>
      <span className="col-span-3">
        Spent from: {props.spendFrom || "Safe-to-Spend"}
      </span>
      <span className="col-span-2 text-right">{ props.category }</span>
    </div>
  )
}

type TransactionDetails = {
  transaction: Transaction,
}

function TransactionDetails (props: TransactionDetails) {
  const { spendFromEnvelope, envelopes } = useAccount()
  const { transaction } = props
  const [categoryBroad, categorySpecific] = transaction.category
  const spentFrom = useMemo<Envelope|undefined>(() => {
    return transaction.envelope_id != null
      ? envelopes.find(e => e.id == transaction.envelope_id)
      : undefined 
  }, [])
  const [editing, setEditing] = useState(false)
  const [newSpendFrom, setNewSpendFrom] = useState<Envelope>()
  const date = DateTime.fromISO(transaction.date)
  if (editing) {
    return (
      <div className="mt-4">
        <ol>
          <li
            key="default"
            onClick={() => setNewSpendFrom(undefined)}
            className={`py-2 cursor-pointer hover:bg-purple-200 ${newSpendFrom == null ? 'bg-purple-100' : '' }`}>
              <span className="px-2">Safe-To-Spend</span>
          </li>
          {
            envelopes.map(e => {
              return (
                <li
                  key={e.id}
                  onClick={() => setNewSpendFrom(e)}
                  className={`py-2 cursor-pointer  hover:bg-purple-200 ${newSpendFrom?.id == e.id ? 'bg-purple-100' : ''}`}
                >
                  <span className="px-2">{e.name}</span> <span className="px-2 float-right"><Money value={e.balance} /></span>
                </li>
              )
            })
          }
        </ol>
      <div className="flex flex-col">
        <button type="button" onClick={() => {
          newSpendFrom && spendFromEnvelope(newSpendFrom, transaction)
        }}>
          Save
        </button>
        <button type="button" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
      </div>
    )
  }
  return (
      <div>
        <p className="font-thin py-2">{date.toLocaleString()}</p>
        <dl className="flex flex-col space-y-2">
          <div>
            <dt className="font-semibold">{transaction.name}</dt>
            <dd className="font-light">{transaction.merchant_name ? transaction.merchant_name : 'Unknown Merchant'}</dd>
          </div>
          <div>
            <dt className="font-semibold">Amount</dt>
            <dd className=""><Money value={transaction.amount} inverted colorized/></dd>
          </div>
          <div>
            <dt className="font-semibold">Category</dt>
            <dd>
              <span className="block">{categorySpecific || categoryBroad}</span>
              { categorySpecific ? <span className=" block font-thin">{categoryBroad}</span> : null }
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Spent From</dt>
            <dd>
              { spentFrom ? spentFrom.name : "Safe-to-Spend" }
              <span className="float-right">
                <button className="font-light text-sm" onClick={() => setEditing(true)}>
                  edit
                </button>
              </span>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Memo</dt>
            <dd>Add notes, #hashtags, and 🥳</dd>
          </div>
        </dl>
      </div>
  )
}
