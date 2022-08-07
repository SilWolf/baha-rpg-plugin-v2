import {
  BahaComment,
  BahaCommentWithPagination,
  RawBahaComment,
  RawBahaCommentWithPagination,
} from '../types/bahaComment.type'
import { RawBahaPost } from '../types/bahaPost.type'
import { decodeHTML } from '../utils/string.util'

declare const Cookies

const generateToken = () => {
  let token = ''
  for (let i = 0; i < 8; i++) {
    let hex = Math.floor(Math.random() * 256).toString(16)
    if (hex.length == 1) {
      hex = '0' + hex
    }
    token += hex
  }

  return token
}

const convertRawCommentToComment = (comment: RawBahaComment): BahaComment => {
  let newText = comment.text

  if (comment.mentions && comment.mentions.length > 0) {
    const sortedMentions = comment.mentions.sort(
      (a, b) => parseInt(b.offset) - parseInt(a.offset)
    )

    for (const sortedMention of sortedMentions) {
      const offset = parseInt(sortedMention.offset)
      const length = parseInt(sortedMention.length)

      newText =
        newText.substring(0, offset) +
        `[${sortedMention.id}:${newText.substring(offset, offset + length)}]` +
        newText.substring(offset + length)
    }
  }

  newText = decodeHTML(newText)

  return {
    ...comment,
    rawText: comment.text,
    text: newText,
    authorId: comment.userid,
    authorName: comment.name,
    mentionedUserIdSet: new Set(comment.mentions.map((mention) => mention.id)),
  }
}

export const getRawPostDetail = (
  gsn: string | number,
  sn: string | number
): Promise<RawBahaPost> => {
  return fetch(
    `https://api.gamer.com.tw/guild/v1/post_detail.php?gsn=${gsn}&messageId=${sn}`,
    {
      credentials: 'include',
    }
  ).then((res) => res.json().then((json) => json.data) as Promise<RawBahaPost>)
}

export const getCommentChunkWithPagination = (
  gsn: string | number,
  sn: string | number,
  page: number = 0
): Promise<BahaCommentWithPagination> => {
  return fetch(
    `https://api.gamer.com.tw/guild/v1/comment_list.php?gsn=${gsn}&messageId=${sn}&page=${page}`,
    {
      credentials: 'include',
    }
  ).then((res) =>
    res.json().then((json) => {
      const data = json.data as RawBahaCommentWithPagination

      return {
        ...data,
        comments: data.comments.map((comment) =>
          convertRawCommentToComment(comment)
        ),
      }
    })
  )
}

export const getCommentChunks = (
  gsn: string | number,
  sn: string | number
): Promise<BahaComment[][]> => {
  return fetch(
    `https://api.gamer.com.tw/guild/v1/comment_list.php?gsn=${gsn}&messageId=${sn}&all`,
    {
      credentials: 'include',
    }
  ).then(
    (res) =>
      res.json().then((json) => {
        const comments = json.data.comments as RawBahaComment[]

        const newBahaCommentChunks: BahaComment[][] = []
        for (let i = 0; i < comments.length; i += 15) {
          newBahaCommentChunks.push(
            comments
              .slice(i, i + 15)
              .map((comment) => convertRawCommentToComment(comment))
          )
        }
        return newBahaCommentChunks
      }) as Promise<BahaComment[][]>
  )
}

export const apiCreateComment = (payload: {
  gsn: string
  sn: string
  content: string
}) => {
  const token = generateToken()
  Cookies.set('ckBahamutCsrfToken', token, {
    domain: '.gamer.com.tw',
    path: '/',
    secure: true,
  })

  const formData = new FormData()
  formData.append('gsn', payload.gsn)
  formData.append('messageId', payload.sn)
  formData.append('content', payload.content)
  formData.append('legacy', '1')

  return fetch(`https://api.gamer.com.tw/guild/v1/comment_new.php`, {
    method: 'POST',
    credentials: 'include',
    headers: new Headers({ 'X-Bahamut-Csrf-Token': token }),
    body: formData,
  })
}

export const apiEditComment = (payload: {
  gsn: string
  sn: string
  commentId: string
  content: string
}) => {
  const token = generateToken()
  Cookies.set('ckBahamutCsrfToken', token, {
    domain: '.gamer.com.tw',
    path: '/',
    secure: true,
  })

  const formData = new FormData()
  formData.append('gsn', payload.gsn)
  formData.append('messageId', payload.sn)
  formData.append('commentId', payload.commentId)
  formData.append('content', payload.content)
  formData.append('legacy', '1')

  return fetch(`https://api.gamer.com.tw/guild/v1/comment_edit.php`, {
    method: 'POST',
    credentials: 'include',
    headers: new Headers({ 'X-Bahamut-Csrf-Token': token }),
    body: formData,
  })
}
