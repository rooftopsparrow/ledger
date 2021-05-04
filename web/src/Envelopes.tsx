import React, { useCallback, useEffect, useState } from 'react'
import { useAccount } from './Accounts'
import { Envelope } from './PlaidApi'
import { Money } from './Money'
import Loading from './Loading'

export default function Envelopes () {
  const { envelopes, loadEnvelopes } = useAccount()
  const [editing, setEditing] = useState<Envelope|null>()
  const [loading, setLoading] = useState<boolean>(false)
  const templates: Array<Envelope> = [
    { name: '🏠 Rent', notes: 'Have funds ready for your rent', balance: 0 },
    { name: '🏖️ Vacation', notes: 'Start saving for that trip', balance: 0 }
  ]
  useEffect(() => {
    setLoading(true)
    loadEnvelopes()
      .then(() => {
        setTimeout(() => setLoading(false), 2000)
      })
      .catch(err => {
        setTimeout(() => setLoading(false), 2000)
      })
  }, [])
  return (
    <div className="grid grid-cols-9">
      <div className="col-span-6 gap-x-2">
        <div id="envelopes-listing" className="flex flex-col justify-center">
          <div className="flex flex-row py-5 items-baseline justify-between">
            <span>
              <h3 className="text-xl">Envelopes</h3>
            </span>
          </div>
          <div>
          {
            loading
            ? <Loading spinnerClass="text-yellow-600" />
            : <>
                <p>No envelopes! Create an envelope and start saving money.</p>
                <p>Get started with some of these envelope ideas:</p>
                <ol>
                {
                  (envelopes.length ? envelopes : templates).map(e => {
                    return (
                      <li className="border border-gray-400 px-4 py-5">
                        <div className="flex justify-between">
                          <span className="font-bold text-large col-span-3">
                            {e.name} <span className="font-light col-auto text-left">
                              {e.notes}
                            </span>
                          </span>
                          <span className="text-right bg-pink-300 px-4 py-2 rounded-md">
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
      </div>
      <div className="col-span-3">
        <span className="inline-flex flex-row-reverse">
          <button
            type="button"
            className="bg-yellow-300 rounded-sm px-4 py-2 ml border border-transparent shadow hover:shadow-md"
            onClick={() => setEditing(!editing)}
          >
            Create Envelope
          </button>
        </span>
        {
          editing
          ? <EditEnvelope />
          : null
        }
      </div>
    </div>
  )
}

}

function EditEnvelope () {
  const [name, setName] = useState('')
  const onSubmit = useCallback(
    () => {
      console.log('submit new envelope call', name)
    },
    [name]
  )
  return (
    <section>
      <form className="px-2 py-2" onSubmit={onSubmit}>
        <div className="">
        <label htmlFor="envelope-name">
          Name
        </label>
          <input type="text" onChange={e => setName(e.target.value)} />
        </div>
      </form>
    </section>
  )
}

