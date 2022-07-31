import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  getRawCommentChunkWithPagination,
  getRawCommentChunks,
  getRawPostDetail,
  apiCreateComment,
  apiEditComment,
} from '../services/api.service'
import { RawBahaComment } from '../types/bahaComment.type'
import { RawBahaPost } from '../types/bahaPost.type'

type PostContextProps = {
  setPost: (gsn: string, sn: string, bahaPost: RawBahaPost) => void
  setCommentChunks: (
    gsn: string,
    sn: string,
    bahaCommentChunks: RawBahaComment[][]
  ) => void
  getPost: (gsn: string, sn: string) => RawBahaPost
  getCommentChunks: (gsn: string, sn: string) => RawBahaComment[][]
}

const PostContext = React.createContext<PostContextProps>({
  setPost: () => {},
  setCommentChunks: () => {},
  getPost: () => {
    throw new Error('Not Implemented')
  },
  getCommentChunks: () => {
    throw new Error('Not Implemented')
  },
})

export const PostContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [bahaPostMap, setBahaPostMap] = useState<Record<string, RawBahaPost>>(
    {}
  )
  const [bahaCommentChunksMap, setBahaCommentChunksMap] = useState<
    Record<string, RawBahaComment[][]>
  >({})

  const setPost = useCallback(
    (gsn: string, sn: string, bahaPost: RawBahaPost) => {
      setBahaPostMap((prev) => ({
        ...prev,
        [`${gsn}-${sn}`]: bahaPost,
      }))
    },
    []
  )

  const setCommentChunks = useCallback(
    (gsn: string, sn: string, bahaCommentChunks: RawBahaComment[][]) => {
      setBahaCommentChunksMap((prev) => ({
        ...prev,
        [`${gsn}-${sn}`]: bahaCommentChunks,
      }))
    },
    []
  )

  const getPost = useCallback(
    (gsn: string, sn: string) => bahaPostMap[`${gsn}-${sn}`],
    [bahaPostMap]
  )

  const getCommentChunks = useCallback(
    (gsn: string, sn: string) => bahaCommentChunksMap[`${gsn}-${sn}`],
    [bahaCommentChunksMap]
  )

  const value = useMemo<PostContextProps>(
    () => ({
      setPost,
      setCommentChunks,
      getPost,
      getCommentChunks,
    }),
    [setPost, setCommentChunks, getPost, getCommentChunks]
  )

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}

type UseBahaPostArgs = {
  gsn: string
  sn: string
}

type UseBahaPostOptions = {
  refreshInterval?: number // in milliseconds
  onSuccess?: () => void
  onSuccessLoadComments?: () => void
}

const useBahaPost = (
  { gsn, sn }: UseBahaPostArgs,
  options?: UseBahaPostOptions
) => {
  const context = useContext(PostContext)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const bahaPost = useMemo(() => context.getPost(gsn, sn), [context, gsn, sn])
  const bahaCommentChunks = useMemo(
    () => context.getCommentChunks(gsn, sn),
    [context, gsn, sn]
  )

  const loadLatestComments = useCallback(async () => {
    const { comments: rawCommentChunk, nextPage: currentChunkIndex } =
      await getRawCommentChunkWithPagination(gsn, sn)

    const newBahaCommentChunks = [...bahaCommentChunks]
    newBahaCommentChunks[currentChunkIndex] = rawCommentChunk

    if (
      !bahaCommentChunks[currentChunkIndex] ||
      bahaCommentChunks[currentChunkIndex].length !== rawCommentChunk.length
    ) {
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

      options?.onSuccessLoadComments?.()
    }

    context.setCommentChunks(gsn, sn, newBahaCommentChunks)
  }, [bahaCommentChunks, context, gsn, options, sn])

  const createComment = useCallback(
    (content: string) => {
      return apiCreateComment({
        gsn,
        sn,
        content,
      }).then(() => {
        return loadLatestComments()
      })
    },
    [gsn, loadLatestComments, sn]
  )

  const editComment = useCallback(
    (commentId: string, content: string) => {
      return apiEditComment({
        gsn,
        sn,
        commentId,
        content,
      }).then(() => {
        return loadLatestComments()
      })
    },
    [gsn, loadLatestComments, sn]
  )

  useEffect(() => {
    if (gsn && sn && !bahaPost && !bahaCommentChunks) {
      setIsLoading(true)
      Promise.all([
        !bahaPost && getRawPostDetail(gsn, sn),
        !bahaCommentChunks && getRawCommentChunks(gsn, sn),
      ])
        .then(([_post, _commentChunks]) => {
          if (_post) {
            context.setPost(gsn, sn, _post)
          }
          if (_commentChunks) {
            context.setCommentChunks(gsn, sn, _commentChunks)
          }
        })
        .finally(() => {
          setIsLoading(false)
          options?.onSuccess()
        })
    }
  }, [bahaCommentChunks, bahaPost, context, gsn, options, sn])

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
    bahaPost,
    bahaCommentChunks,
    isLoading,
    loadLatestComments,
    createComment,
    editComment,
  }
}

export default useBahaPost
