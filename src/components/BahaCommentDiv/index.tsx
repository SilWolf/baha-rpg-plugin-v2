import React from 'react'
import { RawBahaComment } from '../../types/bahaComment.type'
import Avatar from '../common/Avatar'
import TextRenderer from '../TextRenderer'

type Props = {
  comment: RawBahaComment
}

const BahaCommentDiv = ({ comment }: Props) => {
  return (
    <div className="bahaRpgPluginV2App-bahaComment shadow p-4">
      <div className="flex gap-x-2">
        <div>
          <Avatar src={comment.propic} alt={comment.userid} />
        </div>
        <div className="flex-1">
          <div className="flex gap-x-4 mb-1">
            <div className="flex-1 font-bold">{comment.name}</div>
            <div className="text-xs text-gray-400">#{comment.position}</div>
            <div className="text-xs text-gray-400">{comment.ctime}</div>
          </div>
          <div>
            <TextRenderer>{comment.text}</TextRenderer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BahaCommentDiv
