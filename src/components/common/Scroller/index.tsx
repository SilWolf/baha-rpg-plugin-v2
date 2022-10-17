import React, { HTMLAttributes, useCallback, useRef } from 'react'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import SimpleBar from 'simplebar-react'

type UseScroller = {
  controller: {
    setElement: Dispatch<SetStateAction<HTMLElement>>
  }
  scrollToLast: () => void
  getIsAtLast: () => boolean
}

export const useScroller = (): UseScroller => {
  const [element, setElement] = useState<HTMLElement>()
  const [autoScrollToLast, setAutoScrollToLast] = useState<boolean>(false)

  const scrollToLast = useCallback(() => {
    if (!element) {
      setAutoScrollToLast(true)
      return
    }

    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth',
    })
  }, [element])

  const getIsAtLast = useCallback((): boolean => {
    if (element) {
      return false
    }

    return element.scrollHeight - element.scrollTop < 50
  }, [element])

  const controller = useMemo(() => {
    return {
      setElement,
    }
  }, [setElement])

  const value = useMemo(() => {
    return {
      controller,
      scrollToLast,
      getIsAtLast,
    }
  }, [controller, scrollToLast, getIsAtLast])

  useEffect(() => {
    if (element && autoScrollToLast) {
      setAutoScrollToLast(false)
      scrollToLast()
    }
  }, [autoScrollToLast, element, scrollToLast])

  return value
}

type Props = HTMLAttributes<HTMLDivElement> & {
  controller?: UseScroller['controller']
  isHorizontal?: boolean
}

const Scroller = ({ controller, isHorizontal, ...props }: Props) => {
  const sb = useRef<SimpleBar>()

  useEffect(() => {
    if (controller) {
      const el = sb.current?.getScrollElement()
      if (el) {
        controller.setElement(el)
      }

      return () => {
        controller.setElement(undefined)
      }
    }
  }, [controller])
  return <SimpleBar ref={sb} {...props} />
}

export default Scroller
