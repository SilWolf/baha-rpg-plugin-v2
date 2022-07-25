import React from 'react'
import TextRenderer from '../../components/TextRenderer'
import useBahaPost from '../../hooks/useBahaPost'
import MasterLayout from '../../layouts/master.layout'

const PostDetailPage = () => {
  const { bahaPost, bahaComments, isLoadingPost, isLoadingComments } =
    useBahaPost()

  console.log(bahaComments)

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
      <div className="mx-auto max-w-screen-sm">
        <div>{bahaPost.content}</div>
        <div className="h-px bg-gray-300 my-4"></div>
        <div className="space-y-2">
          {bahaComments.map((comment) => (
            <div key={comment.id}>
              <TextRenderer>{comment.text}</TextRenderer>
            </div>
          ))}
        </div>
      </div>
    </MasterLayout>
  )
}

export default PostDetailPage
