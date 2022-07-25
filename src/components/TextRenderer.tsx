import React from 'react'

const TextRenderer = ({ children }: { children: string }) => {
  const lines = children.split('\n')

  return (
    <>
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </>
  )
}

export default React.memo(TextRenderer)
