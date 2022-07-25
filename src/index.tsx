import { createRoot } from 'react-dom/client'
import React from 'react'

import App from './App'

const container = document.createElement('div')
container.setAttribute('id', 'bahaRpgPluginV2App')

document.body.prepend(container)

const root = createRoot(container!)
root.render(<App />)
