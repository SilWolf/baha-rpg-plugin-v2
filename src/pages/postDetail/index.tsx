import React, { useCallback } from 'react'
import BahaCommentDiv from '../../components/BahaCommentDiv'
import BahaCommentEditor from '../../components/BahaCommentEditor'
import BahaPostDiv from '../../components/BahaPostDiv'
import useBahaPost from '../../hooks/useBahaPost'
import MasterLayout from '../../layouts/master.layout'

const PostDetailPage = () => {
  const { bahaPost, bahaComments, isLoadingPost, isLoadingComments } =
    useBahaPost()

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    console.log(form.elements)
  }, [])

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
      <div className="px-8 flex items-stretch gap-x-2 min-h-0">
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div>
                <BahaCommentEditor />
              </div>
              <div>
                <button type="submit">發送</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MasterLayout>
  )
}

export default PostDetailPage
