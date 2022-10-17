import React, { useCallback, useMemo, useState } from 'react'
import useBahaPost from '../../hooks/useBahaPost'
import useMe from '../../hooks/useMe'
import BahaCommentDiv from '../BahaCommentDiv'
import BahaCommentTextarea from '../BahaCommentTextarea'
import BahaPostDiv from '../BahaPostDiv'
import Scroller, { useScroller } from '../common/Scroller'

export type BahaPostThreadFilter = {
  fromUserIds?: string[]
  toUserIds?: string[]
}

export type BahaPostThreadOptions = {
  hidePost?: boolean
  refreshIntervalInSecond?: number
  sound?: boolean
}

export type BahaPostThreadProps = {
  threadId: string
  gsn: string
  sn: string
  isSlave?: boolean
  onCreateNewThreadByOtherPlayer?: (
    threadId: string,
    filter: BahaPostThreadFilter
  ) => Promise<unknown>
  options?: BahaPostThreadOptions
  filter?: BahaPostThreadFilter
}

const notifyAudio = new Audio(
  'https://github.com/SilWolf/bahamut-guild-v2-toolkit/blob/main/src/plugins/bhgv2-auto-refresh/notify_2.mp3?raw=true'
)

const BahaPostThreadDiv = ({
  threadId,
  gsn,
  sn,
  options,
  filter,
  isSlave,
  onCreateNewThreadByOtherPlayer,
}: BahaPostThreadProps) => {
  const { myUserId } = useMe()

  const [isCollapsedPost, setIsCollapsedPost] = useState<boolean>(false)
  const [refreshIntervalInSecond, setRefreshIntervalInSecond] =
    useState<number>(options?.refreshIntervalInSecond ?? 0)
  const [isEnableSound, setIsEnableSound] = useState<boolean>(
    options?.sound ?? true
  )

  const { controller: scrollerController, scrollToLast: commentsScrollToLast } =
    useScroller()

  const handleSuccessLoad = useCallback(() => {
    setTimeout(() => {
      commentsScrollToLast()
    }, 0)
  }, [commentsScrollToLast])

  const handleSuccessLoadComments = useCallback(
    ({ muted }) => {
      setTimeout(() => {
        commentsScrollToLast()
        if (isEnableSound && !muted) {
          notifyAudio.play()
        }
      }, 0)
    },
    [commentsScrollToLast, isEnableSound]
  )

  const { bahaPost, bahaCommentChunks, isLoading, createComment, editComment } =
    useBahaPost(
      { gsn, sn },
      {
        refreshInterval: refreshIntervalInSecond * 1000,
        onSuccess: handleSuccessLoad,
        onSuccessLoadComments: handleSuccessLoadComments,
      }
    )

  const filteredCommentChunks = useMemo(() => {
    if (!filter) {
      return bahaCommentChunks
    }

    return bahaCommentChunks.map((commentChunk) =>
      commentChunk.filter((comment) => {
        if (filter.fromUserIds) {
          if (filter.fromUserIds.indexOf(comment.authorId) === -1) {
            return false
          }
        }
        if (filter.toUserIds) {
          if (
            filter.toUserIds.findIndex((userId) =>
              comment.mentionedUserIdSet.has(userId)
            ) === -1
          ) {
            return false
          }
        }

        return true
      })
    )
  }, [bahaCommentChunks, filter])

  const handleClickCollapsePost = useCallback(() => {
    setIsCollapsedPost((prev) => !prev)
  }, [])

  const handleForkNewThreadByOtherUserId = useCallback(
    async (userId: string) => {
      onCreateNewThreadByOtherPlayer?.(threadId, {
        fromUserIds: [myUserId, userId],
        toUserIds: [myUserId, userId],
      })
    },
    [myUserId, onCreateNewThreadByOtherPlayer, threadId]
  )

  const handleSubmitNewComment = useCallback(
    (newComment: string) => createComment(newComment as string),
    [createComment]
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

  const handleClickEnableSound = useCallback(() => {
    setIsEnableSound((prev) => !prev)
  }, [])

  const handleEditComment = useCallback(
    (commentId: string, content: string) => {
      return editComment(commentId, content)
    },
    [editComment]
  )

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
    <div className="mx-auto flex flex-col h-full gap-y-4 w-[41em]">
      {!options?.hidePost && !isSlave && (
        <div className={isCollapsedPost ? 'hidden' : ''}>
          <BahaPostDiv post={bahaPost} />
        </div>
      )}

      {!isSlave && (
        <div className="flex justify-end gap-x-1">
          <div>
            <button
              onClick={handleClickRefreshInterval}
              className={refreshIntervalInSecond > 0 ? 'bg-green-400' : ''}
            >
              <i className="bi bi-stopwatch" />{' '}
              <span>
                {refreshIntervalInSecond > 0
                  ? `自動更新: ${refreshIntervalInSecond}秒`
                  : '自動更新: 關閉'}
              </span>
            </button>
          </div>
          <div>
            <button
              onClick={handleClickEnableSound}
              className={isEnableSound ? 'bg-green-400' : ''}
            >
              <i className="bi bi-bell" />{' '}
              <span>聲音通知: {isEnableSound ? '開啟' : '關閉'}</span>
            </button>
          </div>
          <div>
            <button onClick={handleClickCollapsePost}>
              <i
                className={
                  isCollapsedPost
                    ? 'bi bi-chevron-expand'
                    : 'bi bi-chevron-contract'
                }
              />
              {isCollapsedPost ? '展開串頭' : '收起串頭'}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <Scroller
          className="h-full overflow-x-hidden"
          controller={scrollerController}
        >
          <div className="space-y-2">
            {filteredCommentChunks.map((bahaCommentChunk, chunkI) => (
              <React.Fragment key={chunkI}>
                {bahaCommentChunk.map((bahaComment) => (
                  <BahaCommentDiv
                    key={bahaComment.id}
                    comment={bahaComment}
                    onEdit={handleEditComment}
                    onForkNewThreadByOtherUserId={
                      handleForkNewThreadByOtherUserId
                    }
                  />
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
