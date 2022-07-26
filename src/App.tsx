import React, { useCallback, useEffect } from 'react'
import PostDetailPage from './pages/postDetail'
import { PostContextProvider } from './hooks/useBahaPost'

import './app.css'

const children = <PostDetailPage />

const App = () => {
  const [isAppOpened, setIsAppOpened] = React.useState<boolean>(true)

  useEffect(() => {
    if (isAppOpened) {
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.removeProperty('overflow')
      }
    }
  }, [isAppOpened])

  const handleClickClose = useCallback(() => setIsAppOpened(false), [])

  useEffect(() => {
    const container = document.querySelector(
      '.main-container_wall-post_header_main'
    )
    if (container) {
      const openButton = document.createElement('div')
      openButton.classList.add('baha-hoverbtn-features')
      openButton.innerHTML = 'O'
      openButton.addEventListener('click', () => setIsAppOpened(true))

      container.append(openButton)
    }
  }, [])

  return (
    <PostContextProvider>
      <div
        className={`fixed left-0 right-0 bg-white p-4 pt-12 transition-[top,bottom,opacity] ${
          isAppOpened
            ? 'z-30 top-0 bottom-0 opacity-100'
            : '-z-30 top-[400px] -bottom-[400px] opacity-0'
        }`}
      >
        <div className="w-full h-full flex flex-col min-h-0">
          <div className="py-2 text-right">
            <button onClick={handleClickClose}>關閉</button>
          </div>
          <div className="flex-1 h-full min-h-0">{children}</div>
        </div>
      </div>
    </PostContextProvider>
  )
}

export default App
