import * as React from 'react'
import PostDetailPage from './pages/postDetail'

import './app.css'
import { PostContextProvider } from './hooks/useBahaPost'

const children = <PostDetailPage />

const App = () => {
  return <PostContextProvider>{children}</PostContextProvider>
}

export default App
