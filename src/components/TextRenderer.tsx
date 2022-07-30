import React from 'react'

const TextRendererImage = ({ url }: { url: string }) => (
  <a className="inline-block" href={url} target="_blank" rel="noreferrer">
    <img src={url} />
  </a>
)
const TextRendererLink = ({ url }: { url: string }) => (
  <a className="inline" href={url} target="_blank" rel="noreferrer">
    {url}
  </a>
)

const TextRenderer = ({ children }: { children: string }) => {
  const lines = children.split('\n').map((line) => {
    const items: React.ReactNode[] = [line]

    let i = 0
    while (i < items.length) {
      const item = items[i]

      if (typeof item === 'string') {
        const match = item.match(/!?\[([^\]]*)\]\(([^)]+)\)/)
        if (match) {
          const url = match[2] as string
          const component =
            match[0][0] === '!' ? (
              <TextRendererImage key={i} url={url} />
            ) : (
              <TextRendererLink key={i} url={url} />
            )

          items[i] = item.substring(0, match.index)

          items.splice(
            i + 1,
            0,
            component,
            item.substring(match.index + match[0].length)
          )
        }
      }

      i++
    }

    return items
  })

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
