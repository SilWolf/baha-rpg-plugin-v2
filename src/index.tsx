import * as ReactDOM from 'react-dom'
import React from 'react'

import App from './App'

const root = document.createElement('div')
root.setAttribute('id', 'bahaRpgPluginV2App')

document.body.prepend(root)

ReactDOM.render(<App />, root)
