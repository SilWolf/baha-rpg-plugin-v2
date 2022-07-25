import React, { useEffect } from 'react'

type Props = {
  children?: React.ReactNode
}

const MasterLayout = ({ children }: Props) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [])

  return (
    <div className="fixed z-30 inset-0 bg-white p-4 pt-12">
      <div className="container">{children}</div>
    </div>
  )
}

export default MasterLayout
