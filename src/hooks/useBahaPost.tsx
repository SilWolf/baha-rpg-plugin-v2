import React, { useEffect, useMemo, useState } from 'react'
import { getRawPostDetail } from '../services/api.service'
import { RawBahaPost } from '../types/bahaPost.type'

type PostContextProps = {
  bahaPost?: RawBahaPost
  gsn?: string
  sn?: string
  isLoading?: boolean
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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    console.log(new URLSearchParams(location.search))

    setGsn(queryParams.get('gsn') ?? undefined)
    setSn(queryParams.get('sn') ?? undefined)
  }, [])

  useEffect(() => {
    if (gsn && sn) {
      setIsLoading(true)
      getRawPostDetail(gsn, sn)
        .then((_post) => {
          setBahaPost(_post)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [gsn, sn])

  const value = useMemo<PostContextProps>(
    () => ({ bahaPost, gsn, sn, isLoading }),
    [gsn, isLoading, sn, bahaPost]
  )

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}

const usePost = () => React.useContext(PostContext)

export default usePost
