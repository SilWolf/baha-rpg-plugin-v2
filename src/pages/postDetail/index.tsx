import React, { useCallback, useEffect, useState } from 'react'
import BahaPostThreadDiv, {
  BahaPostThreadFilter,
  BahaPostThreadProps,
} from '../../components/BahaPostThreadDiv'
import MasterLayout from '../../layouts/master.layout'
import { generateId } from '../../utils/string.util'

type BahaPostThreadGroup = {
  master: BahaPostThreadProps
  slaves: BahaPostThreadProps[]
}

const PostDetailPage = () => {
  const [threadGroups, setThreadGroups] = useState<BahaPostThreadGroup[]>([])

  const handleCreateNewThreadByOtherPlayer = useCallback(
    async (threadId: string, filter: BahaPostThreadFilter) => {
      const threadGroupIndex = threadGroups.findIndex((threadGroup) => {
        threadGroup.master.threadId === threadId
      })

      if (threadGroupIndex !== -1) {
        const newThreadGroups = [...threadGroups]
        const newThreadGroup = newThreadGroups[threadGroupIndex]
        newThreadGroup.slaves.push({
          threadId: generateId(),
          gsn: newThreadGroup.master.gsn,
          sn: newThreadGroup.master.sn,
        })

        setThreadGroups(newThreadGroups)
      }
    },
    []
  )

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    const gsn = queryParams.get('gsn')
    const sn = queryParams.get('sn')

    if (gsn && sn) {
      setThreadGroups((prev) => [
        ...prev,
        {
          master: {
            threadId: generateId(),
            gsn,
            sn,
          },
          slaves: [],
        },
      ])
    }
  }, [])

  return (
    <MasterLayout>
      <div className="px-8 flex justify-center items-stretch gap-x-2 min-h-0 h-full">
        {threadGroups.map(({ master, slaves }, i) => (
          <div key={i}>
            <BahaPostThreadDiv
              {...master}
              onCreateNewThreadByOtherPlayer={
                handleCreateNewThreadByOtherPlayer
              }
            />
          </div>
        ))}
      </div>
    </MasterLayout>
  )
}

export default PostDetailPage
