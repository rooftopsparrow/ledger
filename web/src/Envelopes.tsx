import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from './Accounts'
import { Envelope } from './PlaidApi'
import { Money } from './Money'
import Loading from './Loading'

export default function Envelopes () {
  const {envelopes, loadEnvelopes, appendEnvelope, removeEnvelope, updateEnvelope} = useAccount()
  const [editing, setEditing] = useState<Envelope|null>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const templates: Array<Envelope> = [
    { name: '🏠 Rent', notes: 'Have funds ready for your rent', balance: 0 },
    { name: '🏖️ Vacation', notes: 'Start saving for that trip', balance: 0 },
    { name: '💻 New Computer', notes: 'Get that new Macbook', balance: 0 }
  ]
  useEffect(() => {
    setLoading(true)
    loadEnvelopes()
      .then(() => {
        setTimeout(() => setLoading(false), 100)
      })
      .catch(err => {
        setTimeout(() => {
          setLoading(false)
          setError(err)
        }, 500)
      })
  }, [])
  const handleEnvelope = useCallback(
    (envelope: Envelope) => {
      appendEnvelope(envelope)
      setEditing(null)
    },
    []
  )
  return (
    <div className="grid grid-cols-9">
      <div className="col-span-6 gap-x-2">
        <div id="envelopes-listing" className="flex flex-col">
        {
          loading
          ? <Loading spinnerClass="text-yellow-600" />
          : <>
              {
                !envelopes.length
                ? (
                  <div className="mx-10 text-center my-5">
                    <p>- No envelopes -</p>
                    <p>Create an envelope and start budgeting! Here are some envelope ideas to get you started:</p>
                  </div>
                )
                : null
              }
              <ol>
              {
                (envelopes.length ? envelopes : templates).map((e, i) => {
                  return (
                    <li key={i} className="border border-gray-400 px-4 py-5 hover:bg-purple-300 cursor-pointer" onClick={() => setEditing(e)}>
                      <div className="flex justify-between">
                        <span className="font-bold text-large col-span-3">
                          {e.name} <span className="font-light col-auto text-left">
                            {e.notes}
                          </span>
                        </span>
                        <span className="text-right bg-green-500 px-4 py-2 rounded-md">
                          <Money value={e.balance} />
                        </span>
                      </div>
                    </li>
                  )
                })
              }
              </ol>
            </>
          }
        </div>
      </div>
      <div className="col-span-3 px-5">
        {
          editing
          ? <EditEnvelope
              key={editing.name}
              envelope={editing}
              onCancel={() => setEditing(null)}
              onCreate={handleEnvelope}
              onDelete={() => {
                removeEnvelope(editing)
                setEditing(null)
              }}
              onUpdate={(e: Envelope) => {
                updateEnvelope(e)
                setEditing(null)
              }}
            />
          : (
            <span className="flex flex-col">
              <button
                type="button"
                className="bg-purple-500 hover:bg-purple-400 rounded-sm py-1 ml border border-transparent shadow hover:shadow-md text-white"
                onClick={() => setEditing({ name: '', balance: 0, notes: '' })}
              >
                Create Envelope
              </button>
            </span>
          )
        }
      </div>
    </div>
  )
}

function EditEnvelope (props: { envelope: Envelope, onCancel: () => void, onCreate: (e: Envelope) => void, onDelete: () => void, onUpdate: (e: Envelope) => void }) {
  const [name, setName] = useState<string>(props.envelope.name)
  const [balance, setBalance] = useState<string>(props.envelope.balance.toFixed(2))
  const [writing, setWriting] = useState(false)
  const isNew = useMemo(() => props.envelope.id == null, [])
  const handleReset = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      props.onCancel()
    },
    []
  )
  const handleDelete = useCallback(
    () => props.onDelete(),
    []
  )
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      isNew ? handleCreate() : handleUpdate()
    },
    [name, balance]
  )
  // FIXME: we are simulating balance transfer
  const handleUpdate = useCallback(
    async () => {
      setWriting(true)
      console.log("Attempting to update envelope", name, balance)
      setTimeout(() => {
        props.onUpdate({
          id: props.envelope.id,
          name,
          balance: parseFloat(balance),
          notes: ''
        })
      }, 300)
    },
    [name, balance]
  )
  // FIXME: we are currently abusing the envelope create 
  // API to simulate moving money into an envelope
  const handleCreate = useCallback(
    async () => {
      setWriting(true)
      console.log("Attempting to create envelope", name, balance)
      const form = new FormData()
      form.append("name", name)
      form.append("target_balance", balance)
      const response = await fetch('/api/envelopes', {
        method: 'POST',
        body: form
      })
      if (!response.ok) {
        const detail = await response.json()
        const message = detail?.message || response.statusText
        throw new Error(message)
      }
      const envelopeResponse = await response.json()
      const { Name, TargetAmount } = envelopeResponse 
      // https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-148.php
      const Id = Name.split('').reduce((hashCode: number, ch: string) =>
        (hashCode = ch.charCodeAt(0) + (hashCode << 6) + (hashCode << 16) - hashCode),
        0
      )
      console.debug('created envelope', Id)
      const newEnvelope = {
        id: Id,
        name: Name,
        notes: '',
        balance: TargetAmount
      }
      setWriting(false)
      props.onCreate(newEnvelope)
    },
    [name, balance]
  )
  return (
    <aside>
      <header className="bg-purple-400 text-white flex flex-inline py-2 align-middle">
        <button
          type="button"
          className="px-3"
          onClick={() => props.onCancel()}
        >
          ⇽
        </button>
        <h3 className="text-lg font-semibold">
          { isNew ? "New Envelope" : "Envelope" }
        </h3>
      </header>
      <form id="edit-envelope" onSubmit={handleSubmit} onReset={handleReset}>
        <div className="my-3">
          <label htmlFor="envelope-name" className="block mb-2 text-sm text-gray-400">
            Name
          </label>
          <input id="envelope-name" type="text" name="name" required readOnly={!isNew}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-yellow-100"
                value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="initial-balance" className="block mb-2 text-sm text-gray-400">
            { isNew ? "Initial Balance" : "Balance" }
          </label>
          <input id="initial-balance" type="text" name="initial_balance" required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-yellow-100"
                value={balance} onChange={e => setBalance(e.target.value)} />
        </div>
        <div className="mt-3">
          <button type="submit" id="edit-envelope-submit" form="edit-envelope"
            className="bg-green-500 text-white w-full px-3 py-2 hover:bg-yellow-300"
            disabled={writing}
          >
           { isNew ? "Create" : "Update" } 
          </button>
          {
            !isNew &&
            <button type="button" id="edit-envelope-delete" form="edit-envelope"
              className="bg-red-500 text-white w-full px-3 py-2 hover:bg-red-400"
              disabled={writing}
              onClick={handleDelete}
            >
             Delete 
            </button>  
          }
          <button
            type="reset" id="edit-envelope-reset" form="edit-envelope"
            className="bg-gray-200 w-full px-3 py-2 hover:bg-gray-300"
            disabled={writing}
          >
              Cancel
          </button>
        </div>

      </form>
    </aside>
  )
}

