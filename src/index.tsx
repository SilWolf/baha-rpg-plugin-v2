import { createRoot } from 'react-dom/client'
import React from 'react'

import App from './App'

import 'simplebar-react/dist/simplebar.min.css'

GM.getResourceText('ICON').then((src) => {
  src = src.replace(
    /url\("\./g,
    'url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font'
  )
  GM.addStyle(src)
})

const container = document.createElement('div')
container.setAttribute('id', 'bahaRpgPluginV2App')

document.body.prepend(container)

const root = createRoot(container!)
root.render(<App />)
