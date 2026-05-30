'use client'

import type { AdjacentChapters, ChapterRef } from '@/types'

interface MobileNavProps {
  adjacent: AdjacentChapters
  onNavigate: (target: ChapterRef) => void
  onBackToHome: () => void
  progress: number
  isChapterView: boolean
}

export default function MobileNav({ adjacent, onNavigate, onBackToHome, progress, isChapterView }: MobileNavProps) {
  if (!isChapterView) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[var(--color-border)] z-50 lg:hidden mobile-bottom-nav"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {/* 进度条 */}
      <div className="h-0.5 bg-[#e8ece9]">
        <div
          className="progress-bar h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        {/* 上一章 */}
        {adjacent.prev ? (
          <button
            onClick={() => onNavigate({ moduleId: adjacent.prev!.moduleId, chapterId: adjacent.prev!.id })}
            className="flex items-center gap-1.5 text-[var(--color-text-muted)] touch-target ios-btn-press"
            aria-label={`上一章：${adjacent.prev.title}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs">上一章</span>
          </button>
        ) : (
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-[var(--color-text-muted)] touch-target ios-btn-press"
            aria-label="返回首页"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">首页</span>
          </button>
        )}

        {/* 进度指示 */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-[var(--color-bg)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-[var(--color-text-muted)]">{Math.round(progress)}%</span>
        </div>

        {/* 下一章 */}
        {adjacent.next ? (
          <button
            onClick={() => onNavigate({ moduleId: adjacent.next!.moduleId, chapterId: adjacent.next!.id })}
            className="flex items-center gap-1.5 text-[var(--color-primary)] font-medium touch-target ios-btn-press"
            aria-label={`下一章：${adjacent.next.title}`}
          >
            <span className="text-xs">下一章</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div className="touch-target" />
        )}
      </div>
    </nav>
  )
}
