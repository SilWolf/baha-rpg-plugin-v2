import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  getRawCommentChunkWithPagination,
  getRawComments,
  getRawPostDetail,
  postComment,
} from '../services/api.service'
import { RawBahaComment } from '../types/bahaComment.type'
import { RawBahaPost } from '../types/bahaPost.type'

type PostContextProps = {
  bahaPost?: RawBahaPost
  bahaCommentChunks?: RawBahaComment[][]
  gsn?: string
  sn?: string
  isLoadingPost?: boolean
  isLoadingComments?: boolean

  sendComment: (content: string) => Promise<unknown>
  loadLatestComments: () => Promise<unknown>
}

const PostContext = React.createContext<PostContextProps>({
  sendComment: async () => {
    console.log('bug')
  },
  loadLatestComments: async () => {},
})

export const PostContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [gsn, setGsn] = useState<string>()
  const [sn, setSn] = useState<string>()

  const [bahaPost, setBahaPost] = useState<RawBahaPost>()
  const [bahaCommentChunks, setBahaCommentChunks] = useState<
    RawBahaComment[][]
  >([])
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(false)
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false)

  const sendComment = useCallback(
    (content: string) => {
      return postComment({
        gsn,
        sn,
        content,
      })
    },
    [gsn, sn]
  )

  const loadLatestComments = useCallback(async () => {
    const { comments: rawCommentChunk, nextPage: currentChunkIndex } =
      await getRawCommentChunkWithPagination(gsn, sn)
    if (
      !bahaCommentChunks[currentChunkIndex] ||
      bahaCommentChunks[currentChunkIndex].length !== rawCommentChunk.length
    ) {
      const newBahaCommentChunks = [...bahaCommentChunks]
      newBahaCommentChunks[currentChunkIndex] = rawCommentChunk

      let nextChunkIndex = currentChunkIndex - 1
      while (nextChunkIndex > 0 && currentChunkIndex - nextChunkIndex > 1) {
        newBahaCommentChunks[nextChunkIndex] =
          await getRawCommentChunkWithPagination(
            gsn,
            sn,
            nextChunkIndex + 1
          ).then((res) => res.comments)
        nextChunkIndex--
      }

      setBahaCommentChunks(newBahaCommentChunks)
    }
  }, [bahaCommentChunks, gsn, sn])

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    setGsn(queryParams.get('gsn') ?? undefined)
    setSn(queryParams.get('sn') ?? undefined)
  }, [])

  useEffect(() => {
    if (gsn && sn) {
      setIsLoadingPost(true)
      getRawPostDetail(gsn, sn)
        .then((_post) => {
          setBahaPost(_post)
        })
        .finally(() => {
          setIsLoadingPost(false)
        })

      setIsLoadingComments(true)
      getRawComments(gsn, sn)
        .then((_comments) => {
          const newBahaCommentChunks = []
          for (let i = 0; i < _comments.length; i += 15)
            newBahaCommentChunks.push(_comments.slice(i, i + 15))
          setBahaCommentChunks(newBahaCommentChunks)
        })
        .finally(() => {
          setIsLoadingComments(false)
        })
    }
  }, [gsn, sn])

  const value = useMemo<PostContextProps>(
    () => ({
      bahaPost,
      bahaCommentChunks,
      gsn,
      sn,
      isLoadingPost,
      isLoadingComments,
      sendComment,
      loadLatestComments,
    }),
    [
      bahaPost,
      bahaCommentChunks,
      gsn,
      sn,
      isLoadingPost,
      isLoadingComments,
      sendComment,
      loadLatestComments,
    ]
  )

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}

type UsePostOptions = {
  refreshInterval?: number // in milliseconds
  onSuccessLoadComments?: () => Promise<unknown>
}

const usePost = (options?: UsePostOptions) => {
  const context = useContext(PostContext)

  const loadLatestComments = useCallback(() => {
    return context.loadLatestComments().then(() => {
      options?.onSuccessLoadComments?.()
    })
  }, [context, options])

  const sendComment = useCallback(
    (content: string) => {
      return context.sendComment(content).then(loadLatestComments)
    },
    [context, loadLatestComments]
  )

  useEffect(() => {
    if (
      typeof options?.refreshInterval !== 'undefined' &&
      options.refreshInterval > 1000
    ) {
      let timeoutFn
      const fn = () => {
        loadLatestComments().then(() => {
          timeoutFn = setTimeout(fn, options.refreshInterval)
        })
      }

      timeoutFn = setTimeout(fn, options.refreshInterval)

      return () => {
        clearTimeout(timeoutFn)
      }
    }
  }, [loadLatestComments, options?.refreshInterval])

  return {
    ...context,
    sendComment,
    loadLatestComments,
  }
}

export default usePost
