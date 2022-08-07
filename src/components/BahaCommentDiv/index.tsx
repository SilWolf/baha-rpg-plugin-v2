import React, { useCallback, useMemo, useState } from 'react'
import { BahaComment } from '../../types/bahaComment.type'
import BahaCommentTextarea from '../BahaCommentTextarea'
import Avatar from '../common/Avatar'
import Dropdown from '../common/Dropdown'
import TextRenderer from '../TextRenderer'

type Props = {
  comment: BahaComment
  onEdit?: (commentId: string, content: string) => Promise<unknown>
  onForkNewThreadByOtherUserId?: (userId: string) => Promise<unknown>
}

const BahaCommentDiv = ({
  comment,
  onEdit,
  onForkNewThreadByOtherUserId,
}: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleClickEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleCancelTextarea = useCallback(() => {
    setIsEditing(false)
  }, [])

  const handleSubmitTextarea = useCallback(
    (value: string) => {
      return onEdit(comment.id, value).then(() => {
        setIsEditing(false)
      })
    },
    [comment.id, onEdit]
  )

  const dropdownItemGroups = useMemo(() => {
    const list = []

    if (onEdit) {
      list.push({
        icon: <i className="bi bi-pencil" />,
        label: '修改',
        onClick: handleClickEdit,
      })
    }

    if (onForkNewThreadByOtherUserId) {
      list.push({
        icon: <i className="bi bi-node-plus-fill" />,
        label: '與此玩家開副串',
        onClick: () => onForkNewThreadByOtherUserId(comment.authorId),
      })
    }

    return [list]
  }, [onEdit, onForkNewThreadByOtherUserId, handleClickEdit, comment])

  if (isEditing) {
    return (
      <div className="bahaRpgPluginV2App-bahaComment shadow p-4 pl-10">
        <BahaCommentTextarea
          value={comment.text}
          onCancel={handleCancelTextarea}
          onSubmit={handleSubmitTextarea}
        />
      </div>
    )
  }

  return (
    <div className="bahaRpgPluginV2App-bahaComment shadow p-4">
      <div className="flex gap-x-2">
        <div className="flex-[0_0_2rem]">
          <Avatar src={comment.propic} alt={comment.authorId} />
        </div>
        <div className="flex-1">
          <div className="flex gap-x-4 mb-1 items-center">
            <div className="flex-1 font-bold">{comment.authorName}</div>
            <div className="text-xs text-gray-400">#{comment.position}</div>
            <div className="text-xs text-gray-400">{comment.ctime}</div>
            <div>
              <Dropdown
                trigger={<i className="bi bi-three-dots-vertical" />}
                itemGroups={dropdownItemGroups}
                className="p-0 bg-transparent text-gray-400"
              />
            </div>
          </div>
          <div className="break-all">
            <TextRenderer>{comment.text}</TextRenderer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BahaCommentDiv
