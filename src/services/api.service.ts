import { RawBahaComment } from '../types/bahaComment.type'
import { RawBahaPost } from '../types/bahaPost.type'

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

export const getRawComments = (
  gsn: string | number,
  sn: string | number
): Promise<RawBahaComment[]> => {
  return fetch(
    `https://api.gamer.com.tw/guild/v1/comment_list.php?gsn=${gsn}&messageId=${sn}&all`,
    {
      credentials: 'include',
    }
  ).then(
    (res) =>
      res.json().then((json) => json.data.comments) as Promise<RawBahaComment[]>
  )
}

export const postComment = (payload: {
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
