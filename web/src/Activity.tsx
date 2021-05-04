import React, { useCallback, useEffect, useState, ReactElement, useMemo } from 'react'
import { useAccount } from './Accounts'
import { Money } from './Money'
import { Transaction } from './PlaidApi'
import { DateTime } from 'luxon'
import { useAuth } from './User'
import { Link } from 'react-router-dom'


export default function Account() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Transaction>()
  const {
    account,
    transactions,
    loadAccount,
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
            transactions.map((transaction, index, arr) => {
              const isSelected = transaction.transaction_id === selected?.transaction_id
              const prev = arr[index - 1]
              const dateDiff = transaction.date !== prev?.date
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
                    category={transaction.category[0]} />
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
              <TransactionDetails transaction={selected} />
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
  from_balance?: string,
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
        Spent from: {props.from_balance || "Safe-to-Spend"}
      </span>
      <span className="col-span-2 text-right">{ props.category }</span>
    </div>
  )
}

type TransactionDetails = {
  transaction: Transaction,
}

function TransactionDetails (props: TransactionDetails) {
  const { transaction } = props
  const isPending = transaction.pending
  const [categoryBroad, categorySpecific] = transaction.category
  const date = DateTime.fromISO(transaction.date)
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
            <dd>Safe-to-Spend</dd>
          </div>
          <div>
            <dt className="font-semibold">Memo</dt>
            <dd>Add notes, #hashtags, and 🥳</dd>
          </div>
        </dl>
      </div>
  )
}
