export type RawBahaCommentMention = {
  id: string
  offset: string
  length: string
}

export type RawBahaComment = {
  ctime: string
  time: string
  id: string
  mentions: RawBahaCommentMention[]
  name: string
  position: number
  propic: string
  text: string
  userid: string
}

export type RawBahaCommentWithPagination = {
  comments: RawBahaComment[]
  nextPage: number
  totalPage: number
  commentCount: number
}

export type BahaComment = Omit<RawBahaComment, 'name' | 'userid'> & {
  authorId: string
  authorName: string
  rawText: string
  mentionedUserIdSet: Set<string>
}

export type BahaCommentWithPagination = Omit<
  RawBahaCommentWithPagination,
  'comments'
> & {
  comments: BahaComment[]
}
