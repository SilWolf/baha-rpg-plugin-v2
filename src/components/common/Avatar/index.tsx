import React from 'react'

type Props = {
  src: string
  href?: string
  alt: string
}

const Avatar = ({ src, href = '#', alt }: Props) => (
  <a href={href}>
    <img src={src} alt={alt} className="w-8 h-8 rounded-full" />
  </a>
)

export default Avatar
