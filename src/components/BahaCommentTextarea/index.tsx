import React, { useCallback, useState } from 'react'
import {
  createEditor,
  BaseEditor,
  Transforms,
  Editor,
  Range,
  Location,
  Node,
  Text,
  Element,
} from 'slate'
import {
  ReactEditor,
  Slate,
  Editable,
  withReact,
  RenderElementProps,
} from 'slate-react'
import { HistoryEditor, withHistory } from 'slate-history'
import BahaCommentImageSpan, {
  BahaCommentImageElement,
} from './components/BahaCommentImageSpan'
import BahaCommentMentionSpan, {
  BahaCommentMentionElement,
} from './components/BahaCommentMentionSpan'

type CustomText = { text: string }
type CustomElement =
  | { type: 'paragraph'; children: CustomText[] }
  | BahaCommentMentionElement
  | BahaCommentImageElement

declare module 'slate' {
  // eslint-disable-next-line no-unused-vars
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>
}

// Import the Slate components and React plugin.
const initialValue: any[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

const withCustom = (editor: Editor) => {
  const { isInline, isVoid } = editor

  editor.isInline = (element) =>
    ['mention', 'image'].includes(element.type) || isInline(element)
  editor.isVoid = (element) =>
    ['mention', 'image'].includes(element.type) || isVoid(element)

  return editor
}

const serializeNode = (node: Node) => {
  if (Text.isText(node)) {
    return Node.string(node)
  }

  if (Element.isElementType(node, 'mention')) {
    return `${(node as BahaCommentMentionElement).label} `
  }

  if (Element.isElementType(node, 'image')) {
    return `![](${(node as BahaCommentImageElement).url}) `
  }

  return node.children.map((childNode) => serializeNode(childNode)).join('')
}

type Props = {
  onSubmit?: (value: string) => Promise<unknown>
  value?: string
  disabled?: boolean
}

const BahaCommentEditor = ({ onSubmit, value, disabled }: Props) => {
  const [editor] = useState(() =>
    withCustom(withReact(withHistory(createEditor())))
  )
  const [mentionTarget, setMentionTarget] = useState<Location | null>(null)
  const [mentionSearch, setMentionSearch] = useState<string | undefined>()

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'mention':
        return <BahaCommentMentionSpan {...props} />
      case 'image':
        return <BahaCommentImageSpan {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const handleChangeForMention = useCallback(() => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)
      const wordBefore = Editor.before(editor, start, { unit: 'word' })
      const before = wordBefore && Editor.before(editor, wordBefore)
      const beforeRange = before && Editor.range(editor, before, start)
      const beforeText = beforeRange && Editor.string(editor, beforeRange)
      const beforeMatch = beforeText && beforeText.match(/^@([^@\s]+)$/)
      const after = Editor.after(editor, start)
      const afterRange = Editor.range(editor, start, after)
      const afterText = Editor.string(editor, afterRange)
      const afterMatch = afterText.match(/^(\s|$)/)

      if (beforeMatch && afterMatch) {
        setMentionTarget(beforeRange)
        setMentionSearch(beforeMatch[1])
        return
      }
    }

    setMentionTarget(null)

    // if (!editor.selection) {
    //   setMentionSearch(undefined)
    //   return
    // }
    // const start = Range.start(editor.selection)
    // const element = editor.children[start.path[0]] as CustomElement

    // if (element.type !== 'paragraph') {
    //   setMentionSearch(undefined)
    //   return
    // }

    // const matched = (element.children[0].text ?? '')
    //   .substring(0, start.offset)
    //   .match(/(?<!\S)@(\S+)$/)
    // setMentionSearch(matched?.[1])
  }, [editor])

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      const text = editor.children.map((node) => serializeNode(node)).join('\n')
      setIsSubmitting(true)
      onSubmit(text)
        .then(() => {
          Transforms.delete(editor, {
            at: {
              anchor: Editor.start(editor, []),
              focus: Editor.end(editor, []),
            },
          })
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }, [editor, onSubmit])

  const handleChange = useCallback(() => {
    handleChangeForMention()
  }, [handleChangeForMention])

  const handleKeydownForMention = useCallback<
    React.KeyboardEventHandler<HTMLDivElement>
  >(
    (event) => {
      if (mentionSearch && mentionTarget && event.key === 'Enter') {
        event.preventDefault()

        Transforms.select(editor, mentionTarget)
        Transforms.insertNodes(editor, {
          type: 'mention',
          children: [{ text: '' }],
          label: mentionSearch,
        })
        Transforms.move(editor)

        setMentionSearch('')
        setMentionTarget(null)
      }
    },
    [editor, mentionSearch, mentionTarget]
  )

  const handleKeydown = useCallback<React.KeyboardEventHandler<HTMLDivElement>>(
    (event) => {
      if (mentionSearch) {
        handleKeydownForMention(event)
        return
      }

      if (
        event.key === 'Enter' &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey
      ) {
        event.preventDefault()
        handleSubmit()
      }
    },
    [mentionSearch, handleKeydownForMention, handleSubmit]
  )

  const handleBlur = useCallback(() => {
    setMentionSearch(undefined)
  }, [])

  const handleDragOver = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault()
    },
    []
  )

  const handleDrop = useCallback<React.DragEventHandler<HTMLDivElement>>(
    async (e) => {
      console.log('drop files')
      e.preventDefault()

      const files = e.dataTransfer.items
        ? Array.from(e.dataTransfer.items).map((item) =>
            item.kind === 'file' ? item.getAsFile() : undefined
          )
        : e.dataTransfer.files

      for (let i = 0; i < files.length; i++) {
        if (!files[i]) {
          continue
        }
        const file = files[i]
        if (file.type.startsWith('image/')) {
          Transforms.insertNodes(editor, {
            type: 'image',
            children: [{ text: '' }],
            file,
          })
          Transforms.move(editor)
        }
      }
    },
    [editor]
  )

  return (
    <div className="space-y-2">
      <div
        className="bg-gray-100 rounded-md"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Slate editor={editor} value={initialValue} onChange={handleChange}>
          <Editable
            className="p-4 min-h-[192px]"
            renderElement={renderElement}
            onKeyDown={handleKeydown}
            onBlur={handleBlur}
            placeholder="輸入回覆..."
            readOnly={isSubmitting || disabled}
          />
        </Slate>
      </div>
      <div className="text-right">
        <button disabled={isSubmitting || disabled} onClick={handleSubmit}>
          提交
        </button>
      </div>
    </div>
  )
}

export default BahaCommentEditor