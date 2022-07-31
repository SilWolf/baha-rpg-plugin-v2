type Item =
  | {
      type: 'mention'
      id: string
      label: string
    }
  | {
      type: 'image'
      url: string
    }
  | {
      type: 'url'
      url: string
    }

export const parseCommentToItems = (value: string): (string | Item)[][] => {
  const lines = value.split('\n').map((line) => {
    const items: (string | Item)[] = [line]

    let i = 0
    while (i < items.length) {
      let item = items[i]
      let match: RegExpMatchArray
      let hasUpdated = false

      if (typeof item === 'string') {
        match = item.match(/!?\[([^\]]*)\]\(([^)]+)\)/)
        if (match) {
          const url = match[2] as string
          const component: Item = {
            type: match[0][0] === '!' ? 'image' : 'url',
            url,
          }

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
          const id = match[1] as string
          const label = match[2] as string
          const component: Item = {
            type: 'mention',
            id,
            label,
          }

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

  return lines
}
