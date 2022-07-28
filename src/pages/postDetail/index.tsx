import React, { useCallback, useRef } from 'react'
import { useState } from 'react'
import BahaCommentDiv from '../../components/BahaCommentDiv'
import BahaCommentTextarea from '../../components/BahaCommentTextarea'
import BahaPostDiv from '../../components/BahaPostDiv'
import useBahaPost from '../../hooks/useBahaPost'
import MasterLayout from '../../layouts/master.layout'

const PostDetailPage = () => {
  const [isCollapsedPost, setIsCollapsedPost] = useState<boolean>(false)
  const handleClickCollapsePost = useCallback(() => {
    setIsCollapsedPost((prev) => !prev)
  }, [])

  const commentsScrollerRef = useRef<HTMLDivElement>()

  const {
    bahaPost,
    bahaCommentChunks,
    isLoadingPost,
    isLoadingComments,
    sendComment,
  } = useBahaPost()

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

  if (isLoadingPost || isLoadingComments) {
    return (
      <MasterLayout>
        <div className="mx-auto max-w-screen-sm">讀取中……</div>
      </MasterLayout>
    )
  }

  if (!bahaPost || !bahaCommentChunks) {
    return (
      <MasterLayout>
        <div className="mx-auto max-w-screen-sm">
          <p className="text-red-600">無法讀取內容！</p>
        </div>
      </MasterLayout>
    )
  }

  return (
    <MasterLayout>
      <div className="px-8 flex justify-center items-stretch gap-x-2 min-h-0 h-full">
        <div>
          <div className="mx-auto max-w-screen-sm flex flex-col h-full gap-y-4">
            <div className="flex">
              <div className="flex-1">
                <div className={isCollapsedPost ? 'hidden' : ''}>
                  <BahaPostDiv post={bahaPost} />
                </div>
              </div>
              <div>
                <button onClick={handleClickCollapsePost}>
                  {isCollapsedPost ? '展開串頭' : '收起串頭'}
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <div
                className="h-full overflow-y-scroll"
                ref={commentsScrollerRef}
              >
                <div className="space-y-2">
                  {bahaCommentChunks.map((bahaCommentChunk, chunkI) => (
                    <React.Fragment key={chunkI}>
                      {bahaCommentChunk.map((bahaComment) => (
                        <BahaCommentDiv
                          key={bahaComment.id}
                          comment={bahaComment}
                        />
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
        </div>
        {/* <div className="flex-1">
          <div className="space-y-2">
            <div>
              <BahaCommentTextarea
                onSubmit={handleSubmitNewComment}
                disabled={isSendingComment}
                loading={isSendingComment}
              />
            </div>
          </div>
        </div> */}
      </div>
    </MasterLayout>
  )
}

export default PostDetailPage
