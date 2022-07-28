import React from 'react'
import BahaPostThreadDiv from '../../components/BahaPostThreadDiv'
import useBahaPost from '../../hooks/useBahaPost'
import MasterLayout from '../../layouts/master.layout'

const PostDetailPage = () => {
  const {
    bahaPost,
    bahaCommentChunks,
    isLoadingPost,
    isLoadingComments,
    sendComment,
  } = useBahaPost()

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
          <BahaPostThreadDiv
            post={bahaPost}
            commentChunks={bahaCommentChunks}
            sendComment={sendComment}
          />
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
