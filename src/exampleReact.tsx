import * as React from 'react'

const SomeList = ({ name }: { name: React.ReactNode }) => {
  return (
    <div className="some-list">
      <h1>This is a list for {name}</h1>
      <ul>
        <li>plain javascript</li>
        <li>typescript</li>
        <li>react</li>
        <li>JSX/TSX</li>
      </ul>
    </div>
  )
}

export default SomeList
