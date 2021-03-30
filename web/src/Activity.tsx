import React, { useEffect } from 'react'
import { useAuth } from './User'

export default function Account() {
  const { user } = useAuth()
  return (
    <div id="activity-overview" className="flex flex-col justify-center">
      <section className="container mx-auto px-3 h-screen bg-white">
        <div className="py-3">
          <h2 className="font-bold text-xl">
            $258.43 <span className="font-light text-base text-gray-600 align-text-top">
              Safe-to-Spend
            </span>
          </h2>
          <ul className="inline-flex space-2">
            <li id="available-balance" className="text-sm">
              <h3>$568.21 <span className="font-light text-xs text-gray-600">
                  available balance
                </span>
              </h3>
            </li>
            <li id="scheduled-activity" className="text-sm">
              <h3>$20.00 <span className="font-light text-xs text-gray-600">
                  scheduled activity
                </span>
                </h3></li>
            <li><p>$309.78 <span>in envelopes</span></p></li>
          </ul>
        </div>
        <div>
          {/* Search
            <form>
            <span>x</span>
            <input type="search" className="" />
            <button type="submit">
              Search
            </button>
            <div>
              <span>Current Filters:</span>
              <ol>
                <li><span>Last months</span></li>
              </ol>
            </div>
          </form> */}
          {/* Alerts/notificatons */}
          <div className="grid grid-cols-9">
            <div className="col-span-6 gap-x-2">
              <h3>Transactions</h3>
              <ol>
                <li>
                  <div className="grid grid-cols-5 gap-x-5 row-">
                    <span className="vendor-name font-bold col-span-3">
                      Bottemless
                    </span>
                    <span className="col-span-2 text-right">
                      -$31.24
                    </span>
                    <span className="col-span-3">
                      Spent from: Safe-to-Spend
                    </span>
                    <span className="col-span-2 text-right">Coffee & Tea</span>
                  </div>
                </li>
                <li>
                  <div className="grid grid-cols-5 gap-x-5 row-">
                    <span className="vendor-name font-bold col-span-3">
                      Bottemless
                    </span>
                    <span className="col-span-2 text-right">
                      -$31.24
                    </span>
                    <span className="col-span-3">
                      Spent from: Safe-to-Spend
                    </span>
                    <span className="col-span-2 text-right">Coffee & Tea</span>
                  </div>
                </li>
              </ol>
            </div>
            <div className="col-span-3">
              <aside>
                <h3>Posted Transaction</h3>
                <p>Wednesday, March 17th 2021 at 5:41 pm</p>
                <div>
                  <em>$31.24</em>
                </div>
                <div>
                  <dl>
                    <dt>Name</dt>
                    <dd>Bottomless</dd>

                    <dt>Category</dt>
                    <dd>Coffee & Tea</dd>

                    <dt>Spent From</dt>
                    <dd>Safe-to-Spend</dd>

                    <dt>Memo</dt>
                    <dd>Add notes, #hashtags, and 🥳</dd>
                  </dl>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}