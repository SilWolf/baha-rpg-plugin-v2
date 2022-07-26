import React, { useCallback, useState } from 'react'

type Props = {
  onChange?: (value: string) => void
  value?: string
}

const generateTagDiv = () => {
  const newElement = document.createElement('div')
  newElement.setAttribute('contenteditable', 'true')
  newElement.classList.add(
    'name-tag',
    'inline-block',
    'rounded-lg',
    'bg-gray-500',
    'text-white',
    'mx-1',
    'px-2',
    "before:content-['@']"
  )

  newElement.addEventListener('input', (e) => {
    e.stopPropagation()
    console.log(e)
  })

  return newElement
}

const Editor = ({ onChange, value }: Props) => {
  const [text, setText] = useState('')

  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    document.execCommand('insertText', false, e.clipboardData.getData('text'))
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault()
      return
    }

    if (
      (e.key === 'b' || e.key === 'u' || e.key === 'i') &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault()
      return
    }
  }

  const handleInput: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      setText(e.target.innerText)
      onChange?.(e.target.innerText)
    },
    [onChange]
  )

  const handleClickInsert = () => {
    const range = window.getSelection()?.getRangeAt(0)
    if (
      range &&
      (range.startContainer.parentNode as HTMLElement)?.id === 'main'
    ) {
      // delete whatever is on the range
      range.deleteContents()
      // place your span

      const tag = generateTagDiv()

      range.insertNode(tag)
      range.setStartAfter(tag)
      range.collapse(true)
      range.insertNode(document.createTextNode(' '))
      range.collapse(true)
    }
  }

  return (
    <div>
      <div
        className="p-2 bg-gray-100"
        contentEditable
        id="main"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
      />
      <pre>{text}</pre>
    </div>
  )
}

export default Editor
