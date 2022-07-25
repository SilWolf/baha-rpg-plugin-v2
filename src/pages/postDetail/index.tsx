import React, { useEffect } from 'react'
import MasterLayout from '../../layouts/master.layout'

const PostDetailPage = () => {
  useEffect(() => {
    fetch(
      'https://api.gamer.com.tw/guild/v1/post_detail.php?gsn=3014&messageId=27236629',
      {
        credentials: 'include',
      }
    )
      .then((res) => res.json())
      .then((res) => console.log(res))
  }, [])

  return (
    <MasterLayout>
      <div className="mx-auto max-w-screen-sm">123123123</div>
    </MasterLayout>
  )
}

export default PostDetailPage
