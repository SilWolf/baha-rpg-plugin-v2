import React, { useCallback, useRef, useState } from 'react'
import useBahaPost from '../../hooks/useBahaPost'
import BahaCommentDiv from '../BahaCommentDiv'
import BahaCommentTextarea from '../BahaCommentTextarea'
import BahaPostDiv from '../BahaPostDiv'

export type BahaPostThreadProps = {
  gsn: string
  sn: string
}

const BahaPostThreadDiv = ({ gsn, sn }: BahaPostThreadProps) => {
  const {
    bahaPost,
    bahaCommentChunks,
    isLoadingPost,
    isLoadingComments,
    sendComment,
  } = useBahaPost({ gsn, sn })

  const [isCollapsedPost, setIsCollapsedPost] = useState<boolean>(false)
  const [refreshInterval, setRefreshInterval] = useState<number>(0)

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

  const handleClickRefreshInterval = useCallback(() => {
    setRefreshInterval((prev) => {
      switch (prev) {
        case 0:
          return 2
        case 2:
          return 5
        case 5:
          return 10
        case 10:
          return 15
        case 15:
          return 20
        case 20:
          return 30
        case 30:
          return 60
        case 60:
          return 120
        case 120:
          return 0
      }
    })
  }, [])

  const commentsScrollerRef = useRef<HTMLDivElement>()

  if (isLoadingPost || isLoadingComments) {
    return <div className="mx-auto max-w-screen-sm">讀取中……</div>
  }

  if (!bahaPost || !bahaCommentChunks) {
    return (
      <div className="mx-auto max-w-screen-sm">
        <p className="text-red-600">無法讀取內容！</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-sm flex flex-col h-full gap-y-4">
      <div className={isCollapsedPost ? 'hidden' : ''}>
        <BahaPostDiv post={bahaPost} />
      </div>

      <div className="flex justify-end gap-x-1">
        <div>
          <button onClick={handleClickRefreshInterval}>
            <i className="ri-time-line" />
            {refreshInterval}s
          </button>
        </div>
        <div>
          <button onClick={handleClickCollapsePost}>
            <i className="ri-arrow-up-s-fill" />
            {isCollapsedPost ? '展開串頭' : '收起串頭'}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-scroll" ref={commentsScrollerRef}>
          <div className="space-y-2">
            {bahaCommentChunks.map((bahaCommentChunk, chunkI) => (
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
