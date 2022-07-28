import React, { useCallback, useRef, useState } from 'react'
import { RawBahaComment } from '../../types/bahaComment.type'
import { RawBahaPost } from '../../types/bahaPost.type'
import BahaCommentDiv from '../BahaCommentDiv'
import BahaCommentTextarea from '../BahaCommentTextarea'
import BahaPostDiv from '../BahaPostDiv'

type Props = {
  post: RawBahaPost
  commentChunks: RawBahaComment[][]
  sendComment?: (content: string) => Promise<void>
}

const BahaPostThreadDiv = ({ post, commentChunks, sendComment }: Props) => {
  const [isCollapsedPost, setIsCollapsedPost] = useState<boolean>(false)
  const handleClickCollapsePost = useCallback(() => {
    setIsCollapsedPost((prev) => !prev)
  }, [])

  const handleSubmitNewComment = useCallback(
    (newComment: string) =>
      sendComment(newComment as string).then(() => {
        setTimeout(() => {
          if (commentsScrollerRef.current) {
            commentsScrollerRef.current.scrollTo({
              top: commentsScrollerRef.current.scrollHeight,
              behavior: 'smooth',
            })
          }
        }, 0)
      }),
    [sendComment]
  )

  const commentsScrollerRef = useRef<HTMLDivElement>()

  return (
    <div className="mx-auto max-w-screen-sm flex flex-col h-full gap-y-4">
      <div className="flex">
        <div className="flex-1">
          <div className={isCollapsedPost ? 'hidden' : ''}>
            <BahaPostDiv post={post} />
          </div>
        </div>
        <div>
          <button onClick={handleClickCollapsePost}>
            {isCollapsedPost ? '展開串頭' : '收起串頭'}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-scroll" ref={commentsScrollerRef}>
          <div className="space-y-2">
            {commentChunks.map((bahaCommentChunk, chunkI) => (
              <React.Fragment key={chunkI}>
                {bahaCommentChunk.map((bahaComment) => (
                  <BahaCommentDiv key={bahaComment.id} comment={bahaComment} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div>
        <BahaCommentTextarea onSubmit={handleSubmitNewComment} />
      </div>
    </div>
  )
}

export default BahaPostThreadDiv
