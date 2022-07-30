import React, { useEffect, useState } from 'react'
import BahaPostThreadDiv, {
  BahaPostThreadProps,
} from '../../components/BahaPostThreadDiv'
import MasterLayout from '../../layouts/master.layout'

const PostDetailPage = () => {
  const [threads, setThreads] = useState<BahaPostThreadProps[]>([])

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    const gsn = queryParams.get('gsn')
    const sn = queryParams.get('sn')

    if (gsn && sn) {
      setThreads((prev) => [
        ...prev,
        {
          gsn,
          sn,
        },
      ])
    }
  }, [])

  return (
    <MasterLayout>
      <div className="px-8 flex justify-center items-stretch gap-x-2 min-h-0 h-full">
        {threads.map((thread, i) => (
          <div key={i}>
            <BahaPostThreadDiv {...thread} />
          </div>
        ))}
      </div>
    </MasterLayout>
  )
}

export default PostDetailPage
