import React, { createContext, useContext, useEffect, useState } from 'react'

declare const Cookies

type MeProps = {
  myUserId: string
  myName: string
}

const MeContext = createContext<MeProps>({ myUserId: '', myName: '' })

export const MeProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = useState<MeProps>({ myUserId: '', myName: '' })

  useEffect(() => {
    setValue({
      myUserId: (Cookies.get('BAHAID') ?? '') as string,
      myName: (Cookies.get('BAHANICK') ?? '') as string,
    })
  }, [])

  return <MeContext.Provider value={value}>{children}</MeContext.Provider>
}

const useMe = () => useContext(MeContext)

export default useMe
