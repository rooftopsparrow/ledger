import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

import 'normalize.css'
import './index.css'

declare global  {
  interface ImportMeta {
    hot: {
      accept(): void
    }
    env: {
      MODE: 'development' | 'production'
    }
  }
}

async function main () {

  // Mock out the API for development
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/api.js')
    await worker.start() 
  }

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )

  // Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
  // Learn more: https://snowpack.dev/concepts/hot-module-replacement
  if (import.meta.hot) {
    import.meta.hot.accept();
  }

}

main()
