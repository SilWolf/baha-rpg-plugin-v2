import React from 'react'
import { parseCommentToItems } from '../utils/bahaComment.util'

const TextRendererMention = ({ label }: { label: string }) => (
  <a className="inline-block" href="#" target="_blank" rel="noreferrer">
    {label}
  </a>
)

const TextRendererImage = ({ url }: { url: string }) => (
  <a className="inline-block" href={url} target="_blank" rel="noreferrer">
    <img src={url} />
  </a>
)
const TextRendererUrl = ({ url }: { url: string }) => (
  <a className="inline" href={url} target="_blank" rel="noreferrer">
    {url}
  </a>
)

const TextRenderer = ({ children }: { children: string }) => {
  const lines = parseCommentToItems(children).map((line) =>
    line.map((item) => {
      if (typeof item === 'string') {
        return item
      }

      switch (item.type) {
        case 'mention':
          return <TextRendererMention label={item.label} />
        case 'url':
          return <TextRendererUrl url={item.url} />
        case 'image':
          return <TextRendererImage url={item.url} />
      }
    })
  )

  return (
    <p>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i !== lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  )
}

export default React.memo(TextRenderer)
