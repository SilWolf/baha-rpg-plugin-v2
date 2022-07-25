import React from 'react'

type Props = {
  children?: React.ReactNode
}

const MasterLayout = ({ children }: Props) => {
  return <div className="container">{children}</div>
}

export default MasterLayout
