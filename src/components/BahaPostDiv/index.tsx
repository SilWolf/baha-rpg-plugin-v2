import React from 'react'
import { RawBahaPost } from '../../types/bahaPost.type'
import Avatar from '../common/Avatar'
import TextRenderer from '../TextRenderer'

type Props = {
  post: RawBahaPost
}

const BahaPostDiv = ({ post }: Props) => {
  return (
    <div className="bahaRpgPluginV2App-bahaPost space-y-2">
      <div className="flex gap-x-2 items-center">
        <div>
          <Avatar src={post.publisher.propic} alt={post.publisher.id} />
        </div>
        <div className="flex-1 font-bold">{post.publisher.name}</div>
      </div>
      <div>
        <TextRenderer>{post.content}</TextRenderer>
      </div>
    </div>
  )
}

export default BahaPostDiv
