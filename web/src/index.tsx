import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";

async function main () {

  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  )

  // Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
  // Learn more: https://snowpack.dev/concepts/hot-module-replacement
  if (import.meta.hot) {
    import.meta.hot.accept();
  }

  // Mock out the API for development
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/api.js')
    await worker.start() 
  }

}

main()
