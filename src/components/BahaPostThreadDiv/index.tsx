import React, { useCallback, useState } from 'react'
import useBahaPost from '../../hooks/useBahaPost'
import BahaCommentDiv from '../BahaCommentDiv'
import BahaCommentTextarea from '../BahaCommentTextarea'
import BahaPostDiv from '../BahaPostDiv'
import Scroller, { useScroller } from '../common/Scroller'

export type BahaPostThreadProps = {
  gsn: string
  sn: string
}

const BahaPostThreadDiv = ({ gsn, sn }: BahaPostThreadProps) => {
  const [isCollapsedPost, setIsCollapsedPost] = useState<boolean>(false)
  const [refreshIntervalInSecond, setRefreshIntervalInSecond] =
    useState<number>(0)
  const { controller: scrollerController, scrollToLast: commentsScrollToLast } =
    useScroller()

  const handleSuccessLoadComments = useCallback(() => {
    setTimeout(() => {
      commentsScrollToLast()
    }, 10)
  }, [commentsScrollToLast])

  const { bahaPost, bahaCommentChunks, isLoading, sendComment } = useBahaPost(
    { gsn, sn },
    {
      refreshInterval: refreshIntervalInSecond * 1000,
      onSuccessLoadComments: handleSuccessLoadComments,
    }
  )

  const handleClickCollapsePost = useCallback(() => {
    setIsCollapsedPost((prev) => !prev)
  }, [])

  const handleSubmitNewComment = useCallback(
    (newComment: string) => sendComment(newComment as string),
    [sendComment]
  )

  const handleClickRefreshInterval = useCallback(() => {
    setRefreshIntervalInSecond((prev) => {
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

  if (isLoading) {
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
    <div className="mx-auto max-w-screen-sm flex flex-col h-full gap-y-4 min-w-[41em]">
      <div className={isCollapsedPost ? 'hidden' : ''}>
        <BahaPostDiv post={bahaPost} />
      </div>

      <div className="flex justify-end gap-x-1">
        <div>
          <button
            onClick={handleClickRefreshInterval}
            className={refreshIntervalInSecond > 0 ? 'bg-green-400' : ''}
          >
            <i className="ri-time-line" />
            {refreshIntervalInSecond > 0
              ? `自動更新: ${refreshIntervalInSecond}秒`
              : '自動更新: 關閉'}
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
        <Scroller
          className="h-full overflow-x-hidden"
          controller={scrollerController}
        >
          <div className="space-y-2">
            {bahaCommentChunks.map((bahaCommentChunk, chunkI) => (
              <React.Fragment key={chunkI}>
                {bahaCommentChunk.map((bahaComment) => (
                  <BahaCommentDiv key={bahaComment.id} comment={bahaComment} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </Scroller>
      </div>
      <div className="pl-10">
        <BahaCommentTextarea onSubmit={handleSubmitNewComment} />
      </div>
    </div>
  )
}

export default BahaPostThreadDiv
