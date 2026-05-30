'use client'

import { useRef, useCallback, TouchEvent } from 'react'
import type { Module, ChapterRef } from '@/types'

interface SidebarProps {
  modules: Module[]
  activeModule: string | null
  setActiveModule: (id: string | null) => void
  renderChapter: ChapterRef | null
  onNavigate: (target: ChapterRef) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({
  modules,
  activeModule,
  setActiveModule,
  renderChapter,
  onNavigate,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  // 侧边栏左滑关闭手势
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current
    const diffY = Math.abs(e.changedTouches[0].clientY - touchStartY.current)

    // 左滑超过 80px 且垂直滑动小于水平滑动
    if (diffX < -80 && diffY < Math.abs(diffX)) {
      setSidebarOpen(false)
    }
  }, [setSidebarOpen])

  return (
    <>
      <aside
        role="navigation"
        aria-label="课程目录"
        className={`
          fixed lg:sticky top-0 left-0 w-72 h-[100dvh] bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)]
          overflow-y-auto z-40 transition-transform duration-300 elastic-scroll scrollbar-hide
          ${sidebarOpen ? 'translate-x-0 sidebar-open' : '-translate-x-full lg:translate-x-0 sidebar-closed'}
        `}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="p-5 pt-4">
          {/* 侧边栏标题 */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[var(--color-border)]">
            <span className="text-lg">📚</span>
            <span className="font-bold text-[var(--color-primary-dark)] text-sm">课程目录</span>
            {/* 移动端关闭按钮 */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/60 transition-colors touch-target ios-btn-press"
              aria-label="关闭菜单"
            >
              <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 模块列表 */}
          <nav className="space-y-1">
            {modules.map((mod) => (
              <div key={mod.id}>
                <button
                  onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                  aria-expanded={activeModule === mod.id}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold
                    transition-colors text-left touch-target ios-btn-press
                    ${activeModule === mod.id ? 'bg-white text-[var(--color-primary-dark)]' : 'text-[var(--color-text)] hover:bg-white/60'}
                  `}
                >
                  <span className="text-base">{mod.icon}</span>
                  <span className="flex-1">{mod.title}</span>
                  <svg
                    className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${activeModule === mod.id ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* 章节列表 */}
                {activeModule === mod.id && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-[var(--color-border)] pl-3">
                    {mod.chapters.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => {
                          onNavigate({ moduleId: mod.id, chapterId: ch.id })
                          setSidebarOpen(false)
                        }}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition-all touch-target ios-btn-press
                          ${renderChapter?.chapterId === ch.id
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)] font-semibold border-l-3 border-[var(--color-primary)] -ml-[13px] pl-[22px]'
                            : 'text-[var(--color-text-muted)] hover:bg-white/60 hover:text-[var(--color-text)]'
                          }
                        `}
                      >
                        {ch.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* 计算器入口 */}
          <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] mb-3">实用工具</p>
            <button
              onClick={() => {
                onNavigate({ moduleId: 'tools', chapterId: 'bmi' })
                setSidebarOpen(false)
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm
                transition-colors text-left touch-target ios-btn-press
                ${renderChapter?.chapterId === 'bmi' ? 'bg-white text-[var(--color-primary-dark)]' : 'text-[var(--color-text)] hover:bg-white/60'}
              `}
            >
              <span aria-hidden="true">🧮</span>
              <span>BMI 计算器</span>
            </button>
            <button
              onClick={() => {
                onNavigate({ moduleId: 'tools', chapterId: 'bmr' })
                setSidebarOpen(false)
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm
                transition-colors text-left touch-target ios-btn-press
                ${renderChapter?.chapterId === 'bmr' ? 'bg-white text-[var(--color-primary-dark)]' : 'text-[var(--color-text)] hover:bg-white/60'}
              `}
            >
              <span aria-hidden="true">🔥</span>
              <span>基础代谢计算器</span>
            </button>
          </div>

          {/* iOS 底部安全区域 */}
          <div className="h-8" />
        </div>
      </aside>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          style={{ top: 0 }}
        />
      )}
    </>
  )
}
