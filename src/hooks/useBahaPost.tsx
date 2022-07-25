import React, { useEffect, useMemo, useState } from 'react'
import { getRawComments, getRawPostDetail } from '../services/api.service'
import { RawBahaComment } from '../types/bahaComment.type'
import { RawBahaPost } from '../types/bahaPost.type'

type PostContextProps = {
  bahaPost?: RawBahaPost
  bahaComments?: RawBahaComment[]
  gsn?: string
  sn?: string
  isLoadingPost?: boolean
  isLoadingComments?: boolean
}

const PostContext = React.createContext<PostContextProps>({})

export const PostContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [gsn, setGsn] = useState<string>()
  const [sn, setSn] = useState<string>()

  const [bahaPost, setBahaPost] = useState<RawBahaPost>()
  const [bahaComments, setBahaComments] = useState<RawBahaComment[]>()
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(false)
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    console.log(new URLSearchParams(location.search))

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

      console.log('b')
      setIsLoadingComments(true)
      getRawComments(gsn, sn)
        .then((_comments) => {
          setBahaComments(_comments)
        })
        .finally(() => {
          setIsLoadingComments(false)
        })
    }
  }, [gsn, sn])

  const value = useMemo<PostContextProps>(
    () => ({
      bahaPost,
      bahaComments,
      gsn,
      sn,
      isLoadingPost,
      isLoadingComments,
    }),
    [bahaPost, bahaComments, gsn, sn, isLoadingPost, isLoadingComments]
  )

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}

const usePost = () => React.useContext(PostContext)

export default usePost
