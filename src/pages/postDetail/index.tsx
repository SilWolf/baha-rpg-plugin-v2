import React from 'react'
import useBahaPost from '../../hooks/useBahaPost'
import MasterLayout from '../../layouts/master.layout'

const PostDetailPage = () => {
  const { bahaPost, isLoading } = useBahaPost()

  if (isLoading) {
    return (
      <MasterLayout>
        <div className="mx-auto max-w-screen-sm">讀取中……</div>
      </MasterLayout>
    )
  }

  if (!bahaPost) {
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
      <div className="mx-auto max-w-screen-sm">{bahaPost.content}</div>
    </MasterLayout>
  )
}

export default PostDetailPage
