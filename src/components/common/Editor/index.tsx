import React, { useCallback, useState } from 'react'

type Props = {
  onChange?: (value: string) => void
  value?: string
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
