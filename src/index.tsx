import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './scss/styles.scss'
import './scss/theme.less'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
