import { RawBahaPost } from '../types/bahaPost.type'

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
