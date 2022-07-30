import React, { useEffect } from 'react'
import { Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react'
import { postImgurImage } from '../../../services/imgur.service'

export type BahaCommentImageElement = {
  type: 'image'
  children: { text: string }[]
  url?: string
  file?: File
  error?: Error
}

const BahaCommentImageSpan = (props: RenderElementProps) => {
  const { file, url, error } = props.element as BahaCommentImageElement
  const editor = useSlateStatic()

  useEffect(() => {
    if (file && !url && !error) {
      postImgurImage((props.element as BahaCommentImageElement).file)
        .then(({ link }) => {
          const path = ReactEditor.findPath(editor, props.element)
          Transforms.setNodes(
            editor,
            {
              type: 'image',
              url: link,
              children: [{ text: '' }],
            },
            { at: path }
          )
        })
        .catch((e) => {
          const path = ReactEditor.findPath(editor, props.element)
          Transforms.setNodes(
            editor,
            {
              type: 'image',
              error: e,
              children: [{ text: '' }],
            },
            { at: path }
          )
        })
    }
  }, [editor, error, file, props.element, url])

  return (
    <a
      className="bg-rose-400 text-white rounded mr-1 px-1"
      contentEditable={false}
      {...props.attributes}
      href={url ?? '#'}
      target="_blank"
      rel="noreferrer"
    >
      <i className="bi bi-image" />
      {!url && !error && <span>上傳圖片中...</span>}
      {url && <span>{url}</span>}
      {error && <span>{error.message}</span>}
      {props.children}
    </a>
  )
}

export default BahaCommentImageSpan
