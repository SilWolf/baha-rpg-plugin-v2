import React, { HTMLAttributes, useCallback, useRef } from 'react'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import SimpleBar from 'simplebar-react'

type UseScroller = {
  controller: {
    setScrollToLast: Dispatch<SetStateAction<() => void>>
  }
  scrollToLast: () => void
}

export const useScroller = (): UseScroller => {
  const [innerScrollToLast, setInnerScrollToLast] = useState<() => void>(
    () => () => {
      console.log('not implement')
    }
  )
  const [autoScrollToLast, setAutoScrollToLast] = useState<boolean>(false)

  const setScrollToLast = useCallback((fn) => {
    setInnerScrollToLast(() => fn)
  }, [])

  const controller = useMemo(() => {
    return {
      setScrollToLast,
    }
  }, [setScrollToLast])

  const value = useMemo(() => {
    return {
      controller,
      scrollToLast,
    }
  }, [controller, scrollToLast])

  return value
}

type Props = HTMLAttributes<HTMLDivElement> & {
  controller?: UseScroller['controller']
}

const Scroller = ({ controller, ...props }: Props) => {
  const sb = useRef<SimpleBar>()

  useEffect(() => {
    if (controller) {
      controller.setScrollToLast(() => () => {
        const el = sb.current?.getScrollElement()
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth',
        })
      })

      return () => {
        controller.setScrollToLast(() => () => {})
      }
    }
  }, [controller])
  return <SimpleBar ref={sb} {...props} />
}

export default Scroller
