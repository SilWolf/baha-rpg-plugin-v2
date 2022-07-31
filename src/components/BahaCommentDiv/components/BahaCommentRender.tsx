import React from 'react'

const BahaCommentRenderMention = ({ label }: { label: string }) => (
  <a className="inline-block" href="#" target="_blank" rel="noreferrer">
    {label}
  </a>
)
const BahaCommentRenderImage = ({ url }: { url: string }) => (
  <a className="inline-block" href={url} target="_blank" rel="noreferrer">
    <img src={url} />
  </a>
)
const BahaCommentRenderLink = ({ url }: { url: string }) => (
  <a className="inline" href={url} target="_blank" rel="noreferrer">
    {url}
  </a>
)

const BahaCommentRender = ({ children }: { children: string }) => {
  const lines = children.split('\n').map((line) => {
    const items: React.ReactNode[] = [line]

    let i = 0
    while (i < items.length) {
      let item = items[i]
      let match: RegExpMatchArray
      let hasUpdated = false

      if (typeof item === 'string') {
        match = item.match(/!?\[([^\]]*)\]\(([^)]+)\)/)
        if (match) {
          const url = match[2] as string
          const component =
            match[0][0] === '!' ? (
              <BahaCommentRenderImage key={i} url={url} />
            ) : (
              <BahaCommentRenderLink key={i} url={url} />
            )

          items[i] = item.substring(0, match.index)

          items.splice(
            i + 1,
            0,
            component,
            item.substring(match.index + match[0].length)
          )

          item = item[i]
          hasUpdated = true
        }
      }

      if (typeof item === 'string') {
        match = item.match(/\[(\w+)\:([^\]]+)\]/)
        if (match) {
          // const id = match[1] as string
          const label = match[2] as string
          const component = <BahaCommentRenderMention label={label} />

          items[i] = item.substring(0, match.index)

          items.splice(
            i + 1,
            0,
            component,
            item.substring(match.index + match[0].length)
          )

          item = item[i]
          hasUpdated = true
        }
      }

      if (!hasUpdated) {
        i++
      }
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

export default React.memo(BahaCommentRender)
