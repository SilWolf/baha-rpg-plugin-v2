import React from 'react'
import { RenderElementProps } from 'slate-react'

export type BahaCommentUrlElement = {
  type: 'url'
  children: { text: string }[]
  url: string
}

const BahaCommentUrlSpan = (props: RenderElementProps) => {
  const { url } = props.element as BahaCommentUrlElement

  return (
    <a
      className="bg-teal-400 text-white rounded mr-1 px-1"
      contentEditable={false}
      {...props.attributes}
      href={url ?? '#'}
      target="_blank"
      rel="noreferrer"
    >
      <i className="bi bi-link-45deg" />
      <span>{url}</span>
      {props.children}
    </a>
  )
}

export default BahaCommentUrlSpan
