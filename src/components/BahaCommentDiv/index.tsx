import React, { useCallback, useMemo, useState } from 'react'
import { RawBahaComment } from '../../types/bahaComment.type'
import BahaCommentTextarea from '../BahaCommentTextarea'
import Avatar from '../common/Avatar'
import Dropdown from '../common/Dropdown'
import TextRenderer from '../TextRenderer'

type Props = {
  comment: RawBahaComment
  onEdit?: (commentId: string, content: string) => Promise<unknown>
}

const BahaCommentDiv = ({ comment, onEdit }: Props) => {
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
    if (onEdit) {
      return [
        [
          {
            icon: <i className="bi bi-pencil" />,
            label: '修改',
            onClick: handleClickEdit,
          },
        ],
      ]
    }

    return []
  }, [handleClickEdit, onEdit])

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
        <div>
          <Avatar src={comment.propic} alt={comment.userid} />
        </div>
        <div className="flex-1">
          <div className="flex gap-x-4 mb-1 items-center">
            <div className="flex-1 font-bold">{comment.name}</div>
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
          <div>
            <TextRenderer>{comment.text}</TextRenderer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BahaCommentDiv
