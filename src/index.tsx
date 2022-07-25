import * as ReactDOM from 'react-dom'
import React from 'react'

import helloWorld from './examplePlain.js'
import getSomeValueFromGM from './exampleTypedGM'
import SomeList from './exampleReact'

const root = document.createElement('div')
root.setAttribute('id', 'bahaRpgPluginV2')

document.body.prepend(root)

ReactDOM.render(<SomeList name={helloWorld} />, root)

getSomeValueFromGM().then(function (s) {
  ReactDOM.render(<SomeList name={s} />, root)
})
