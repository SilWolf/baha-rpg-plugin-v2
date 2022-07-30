import { createRoot } from 'react-dom/client'
import React from 'react'

import App from './App'

import 'simplebar-react/dist/simplebar.min.css'

GM.getResourceText('REMIXICON').then((src) => {
  src = src.replace(
    /remixicon\./g,
    'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.'
  )
  GM.addStyle(src)
})

const container = document.createElement('div')
container.setAttribute('id', 'bahaRpgPluginV2App')

document.body.prepend(container)

const root = createRoot(container!)
root.render(<App />)
