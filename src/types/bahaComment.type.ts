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

export type BahaComment = Omit<RawBahaComment, 'name' | 'userid'> & {
  authorId: string
  authorName: string
  plainText: string
}
