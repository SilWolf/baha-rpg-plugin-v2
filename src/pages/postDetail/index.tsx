import React, { useCallback } from 'react'
import BahaCommentDiv from '../../components/BahaCommentDiv'
import BahaCommentTextarea from '../../components/BahaCommentTextarea'
import BahaPostDiv from '../../components/BahaPostDiv'
import useBahaPost from '../../hooks/useBahaPost'
import MasterLayout from '../../layouts/master.layout'

const PostDetailPage = () => {
  const {
    bahaPost,
    bahaComments,
    isLoadingPost,
    isLoadingComments,
    isSendingComment,
    sendComment,
  } = useBahaPost()

  const handleSubmitNewComment = useCallback(
    (newComment: string) => sendComment(newComment as string),
    [sendComment]
  )

  if (isLoadingPost || isLoadingComments) {
    return (
      <MasterLayout>
        <div className="mx-auto max-w-screen-sm">讀取中……</div>
      </MasterLayout>
    )
  }

  if (!bahaPost || !bahaComments) {
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
      <div className="px-8 flex items-stretch gap-x-2 min-h-0 h-full">
        <div>
          <div className="mx-auto max-w-screen-sm flex flex-col h-full">
            <div className="pb-4 mb-4 border-b border-gray-300">
              <BahaPostDiv post={bahaPost} />
            </div>
            <div className="flex-1 min-h-0">
              <div className="h-full overflow-y-scroll">
                <div className="space-y-2">
                  {bahaComments.map((bahaComment) => (
                    <BahaCommentDiv
                      key={bahaComment.id}
                      comment={bahaComment}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            <div>
              <BahaCommentTextarea
                onSubmit={handleSubmitNewComment}
                disabled={isSendingComment}
                loading={isSendingComment}
              />
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  )
}

export default PostDetailPage
