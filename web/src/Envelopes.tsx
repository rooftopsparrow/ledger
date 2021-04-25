import React, { useCallback, useEffect, useState } from 'react'

export default function Envelopes () {
  const [editing, setEditing] = useState<boolean>(false)
  return (
    <div id="envelopes-listing" className="flex flex-col justify-center">
        <div className="flex flex-row py-5 items-baseline justify-between">
          <span>
          <h3 className="text-xl">Envelopes</h3>
          </span>
          <span className="inline-flex">
            <button
              type="button"
              className="bg-yellow-300 rounded-sm px-4 py-2 ml border border-transparent shadow hover:shadow-md"
              onClick={() => setEditing(!editing)}
            >
            </button>
          </span>
        </div>
        <div>
          <div>
          <ol>
            <li className="border border-gray-400 px-4 py-5">
              <div className="flex justify-between">
                <span className="envelope-name font-bold col-span-3">
                  Coffee
                </span>
                <span className="text-right bg-pink-300 px-4 py-2 rounded-md">
                  $10.00
                </span>
              </div>
            </li>
          </ol>
          </div>
          <div>
            {
              editing
              ? <EditEnvelope />
              : null
            }
          </div>
        </div>
      </div>
  )
}

interface Envelope {
  name: string
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
      <form onSubmit={onSubmit}>
        <label htmlFor="envelope-name">
          Name
        </label>
        <input type="text" onChange={e => setName(e.target.value)} />
      </form>
    </section>
  )
}
