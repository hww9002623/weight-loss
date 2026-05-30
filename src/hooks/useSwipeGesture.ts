'use client'

import { useRef, useCallback, TouchEvent } from 'react'

interface SwipeHandlers {
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: () => void
}

interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  preventScroll?: boolean
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  preventScroll = false,
}: UseSwipeGestureOptions): SwipeHandlers {
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const isSwiping = useRef<boolean>(false)

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchEndX.current = e.touches[0].clientX
    isSwiping.current = false
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = Math.abs(currentX - touchStartX.current)
    const diffY = Math.abs(currentY - touchStartY.current)

    // 如果水平滑动距离大于垂直滑动，认为是滑动手势
    if (diffX > diffY && diffX > 10) {
      isSwiping.current = true
      if (preventScroll) {
        e.preventDefault()
      }
    }

    touchEndX.current = currentX
  }, [preventScroll])

  const onTouchEnd = useCallback(() => {
    if (!isSwiping.current) return

    const diffX = touchEndX.current - touchStartX.current

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (diffX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    isSwiping.current = false
  }, [onSwipeLeft, onSwipeRight, threshold])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
