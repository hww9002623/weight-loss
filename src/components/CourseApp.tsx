'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import type { Module, ChapterRef } from '@/types'
import { getAllChaptersFlat, getAdjacentChapters, getDirection, getChapterProgress } from '@/lib/utils'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import Sidebar from './Sidebar'
import ChapterContent from './ChapterContent'
import ChapterNav from './ChapterNav'
import BMICalculator from './BMICalculator'
import BMRCalculator from './BMRCalculator'
import MobileNav from './MobileNav'

interface CourseAppProps {
  modules: Module[]
}

export default function CourseApp({ modules }: CourseAppProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [activeChapter, setActiveChapter] = useState<ChapterRef | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
  const [displayChapter, setDisplayChapter] = useState<ChapterRef | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // useMemo 缓存扁平化结果
  const allChapters = useMemo(() => getAllChaptersFlat(modules), [modules])

  // 获取当前章节数据（用 displayChapter 渲染）
  const renderChapter = displayChapter || activeChapter
  const currentChapter = useMemo(() =>
    renderChapter
      ? modules.find(m => m.id === renderChapter.moduleId)?.chapters.find(c => c.id === renderChapter.chapterId)
      : null,
    [renderChapter, modules]
  )
  const currentModule = useMemo(() =>
    renderChapter
      ? modules.find(m => m.id === renderChapter.moduleId)
      : null,
    [renderChapter, modules]
  )

  // 获取相邻章节
  const adjacentChapters = useMemo(() =>
    renderChapter
      ? getAdjacentChapters(modules, renderChapter.moduleId, renderChapter.chapterId)
      : { prev: null, next: null },
    [renderChapter, modules]
  )

  // 进度百分比
  const progress = useMemo(() =>
    renderChapter
      ? getChapterProgress(modules, renderChapter.moduleId, renderChapter.chapterId)
      : 0,
    [renderChapter, modules]
  )

  // 平滑切换章节
  const navigateToChapter = useCallback((target: ChapterRef | null) => {
    if (target && displayChapter && target.moduleId === displayChapter.moduleId && target.chapterId === displayChapter.chapterId) return
    if (!target && !displayChapter) return

    const dir = target ? getDirection(modules, displayChapter || { moduleId: '', chapterId: '' }, target) : 'right'
    setSlideDir(dir)
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveChapter(target)
      setDisplayChapter(target)
      setIsTransitioning(false)
      const mainEl = document.querySelector('main')
      if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 250)
  }, [displayChapter, modules])

  // 滑动手势
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (adjacentChapters.next && activeChapter) {
        navigateToChapter({ moduleId: adjacentChapters.next.moduleId, chapterId: adjacentChapters.next.id })
      }
    },
    onSwipeRight: () => {
      if (adjacentChapters.prev && activeChapter) {
        navigateToChapter({ moduleId: adjacentChapters.prev.moduleId, chapterId: adjacentChapters.prev.id })
      } else if (activeChapter) {
        navigateToChapter(null)
      }
    },
    threshold: 60,
  })

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* 导航栏 - iOS 安全区域适配 */}
      <header
        className="fixed top-0 left-0 right-0 bg-white border-b border-[var(--color-border)] z-50 ios-safe-top"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="h-14 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-sidebar)] transition-colors touch-target ios-btn-press"
              aria-label={sidebarOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={sidebarOpen}
            >
              <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">📖</span>
              <span className="font-bold text-[var(--color-primary-dark)] text-sm">科学减脂指南</span>
            </div>
          </div>
          <div className="text-xs text-[var(--color-text-muted)] hidden sm:block">零基础友好 · 5大模块 · 30+课时</div>
        </div>
        {/* 学习进度条 - 桌面端显示 */}
        {renderChapter && !isMobile && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8ece9]">
            <div
              className="progress-bar h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] rounded-r-full"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`学习进度 ${Math.round(progress)}%`}
            />
          </div>
        )}
      </header>

      <div className="flex" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top))' }}>
        <Sidebar
          modules={modules}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          renderChapter={renderChapter}
          onNavigate={navigateToChapter}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* 主内容区 */}
        <main
          className={`flex-1 min-w-0 ${isMobile && activeChapter ? 'pb-20' : ''}`}
          {...(isMobile && activeChapter ? swipeHandlers : {})}
        >
          {/* 首页 */}
          {!activeChapter && (
            <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
              {/* Hero */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center py-8 sm:py-12 hero-section">
                <div className="space-y-4 sm:space-y-5">
                  <span className="inline-block px-4 py-1.5 bg-[var(--color-tip-bg)] text-[var(--color-primary)] text-xs font-semibold rounded-full border border-[var(--color-tip-border)]">
                    零基础友好 · 5大模块 · 30+课时
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-primary-dark)] leading-tight">
                    科学减脂，从这里开始
                  </h1>
                  <p className="text-[var(--color-text-muted)] leading-relaxed max-w-lg text-sm sm:text-base">
                    不节食、不盲目、不焦虑。用通俗易懂的方式，带你掌握减脂的核心知识，建立可持续的健康生活方式。看完能形成完整减脂思维，给自己定制专属方案。
                  </p>
                  <button
                    onClick={() => navigateToChapter({ moduleId: modules[0].id, chapterId: modules[0].chapters[0].id })}
                    className="inline-block px-8 py-3.5 sm:py-3 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-light)] transition-all hover:-translate-y-0.5 text-base sm:text-sm touch-target ios-btn-press"
                  >
                    开始学习 →
                  </button>
                </div>
                <div className="relative flex items-center justify-center h-48 sm:h-64 lg:h-72">
                  <div className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] rounded-full opacity-70" />
                  <div className="absolute w-32 h-32 sm:w-44 sm:h-44 bg-gradient-to-br from-[#95d5b2] to-[var(--color-accent)] rounded-full opacity-50 top-5 right-5" />
                  <span className="relative text-5xl sm:text-7xl animate-[float_3s_ease-in-out_infinite]" aria-hidden="true">🏃‍♀️</span>
                </div>
              </section>

              {/* 学习路径 */}
              <section className="mb-12">
                <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-6 text-center">学习路径</h2>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {modules.map((mod, i) => (
                    <div key={mod.id} className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-[var(--color-primary)] text-white font-bold text-sm rounded-full flex items-center justify-center">
                        {i + 1}
                      </div>
                      {i < modules.length - 1 && <span className="text-[var(--color-accent)] text-lg" aria-hidden="true">→</span>}
                    </div>
                  ))}
                </div>
              </section>

              {/* 模块卡片 */}
              <section>
                <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-6 text-center">五大模块</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => navigateToChapter({ moduleId: mod.id, chapterId: mod.chapters[0].id })}
                      className="flex flex-col gap-3 p-6 bg-white border border-[var(--color-border)] rounded-xl text-left
                        transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-accent)] ios-card-shadow ios-btn-press"
                    >
                      <span className="text-3xl" aria-hidden="true">{mod.icon}</span>
                      <h3 className="font-bold text-[var(--color-primary-dark)] text-lg">{mod.title}</h3>
                      <p className="text-[var(--color-text-muted)] text-sm flex-1">{mod.description}</p>
                      <span className="text-[var(--color-primary)] text-xs font-semibold">{mod.chapters.length} 章节</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* 免责声明 */}
              <footer className="mt-12 p-4 bg-[#fff8e7] border border-[#ffe082] rounded-xl text-center">
                <p className="text-sm text-[#795548]">
                  ⚠️ 本课程仅供健康教育参考，不构成医疗建议。如有健康问题，请咨询专业医生。
                </p>
              </footer>
            </div>
          )}

          {/* BMI 计算器页 */}
          {renderChapter?.chapterId === 'bmi' && (
            <article className={`max-w-3xl mx-auto px-4 lg:px-6 py-8 ${isTransitioning ? (slideDir === 'left' ? 'chapter-exit-left' : 'chapter-exit-right') : (slideDir === 'left' ? 'chapter-enter-right' : 'chapter-enter-left')}`}>
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary-dark)]">🧮 BMI 体重计算器</h1>
                <div className="h-1 w-16 bg-[var(--color-accent)] mt-3 rounded-full" />
              </div>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                BMI（Body Mass Index）是国际上常用的衡量人体胖瘦程度的指数。计算公式：体重(kg) ÷ 身高(m)²
              </p>
              <BMICalculator />
              <div className="bg-[var(--color-tip-bg)] border-l-4 border-[var(--color-tip-border)] rounded-r-xl p-5 mt-6">
                <p className="font-bold text-[var(--color-primary-dark)] mb-2">💡 参考标准</p>
                <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
                  <li>• 偏瘦：BMI &lt; 18.5</li>
                  <li>• 正常：18.5 ≤ BMI &lt; 24</li>
                  <li>• 偏胖：24 ≤ BMI &lt; 28</li>
                  <li>• 肥胖：BMI ≥ 28</li>
                </ul>
              </div>

              {!isMobile && (
                <ChapterNav
                  adjacent={{ prev: { id: 'myths', moduleId: 'principles', moduleTitle: '减肥底层原理', title: '常见减肥说法的真相', content: [] }, next: { id: 'bmr', moduleId: 'tools', moduleTitle: '实用工具', title: 'BMR 计算器', content: [] } }}
                  onNavigate={navigateToChapter}
                />
              )}
            </article>
          )}

          {/* 基础代谢计算器页 */}
          {renderChapter?.chapterId === 'bmr' && (
            <article className={`max-w-3xl mx-auto px-4 lg:px-6 py-8 ${isTransitioning ? (slideDir === 'left' ? 'chapter-exit-left' : 'chapter-exit-right') : (slideDir === 'left' ? 'chapter-enter-right' : 'chapter-enter-left')}`}>
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary-dark)]">🔥 BMR 基础代谢计算器</h1>
                <div className="h-1 w-16 bg-[var(--color-accent)] mt-3 rounded-full" />
              </div>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                基础代谢率（BMR）是人体在安静状态下维持生命所需的最低热量。知道你的 BMR，才能合理制定饮食计划。
              </p>
              <BMRCalculator />
              <div className="bg-[var(--color-tip-bg)] border-l-4 border-[var(--color-tip-border)] rounded-r-xl p-5 mt-6">
                <p className="font-bold text-[var(--color-primary-dark)] mb-2">💡 活动系数参考</p>
                <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
                  <li>• 久坐不动：BMR × 1.2</li>
                  <li>• 轻度运动（1-3天/周）：BMR × 1.375</li>
                  <li>• 中等运动（3-5天/周）：BMR × 1.55</li>
                  <li>• 高强度运动（6-7天/周）：BMR × 1.725</li>
                </ul>
              </div>

              {!isMobile && (
                <ChapterNav
                  adjacent={{ prev: { id: 'bmi', moduleId: 'tools', moduleTitle: '实用工具', title: 'BMI 计算器', content: [] }, next: { id: 'sleep', moduleId: 'lifestyle', moduleTitle: '日常习惯体系', title: '睡眠和体重的关系', content: [] } }}
                  onNavigate={navigateToChapter}
                />
              )}
            </article>
          )}

          {/* 章节内容页 */}
          {currentChapter && !['bmi', 'bmr'].includes(renderChapter?.chapterId || '') && (
            <article className={`max-w-3xl mx-auto px-4 lg:px-6 py-8 ${isTransitioning ? (slideDir === 'left' ? 'chapter-exit-left' : 'chapter-exit-right') : (slideDir === 'left' ? 'chapter-enter-right' : 'chapter-enter-left')}`}>
              {/* 面包屑 */}
              <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6" aria-label="面包屑导航">
                <button onClick={() => navigateToChapter(null)} className="hover:text-[var(--color-primary)] transition-colors touch-target ios-btn-press">
                  首页
                </button>
                <span aria-hidden="true">/</span>
                <span>{currentModule?.title}</span>
                <span aria-hidden="true">/</span>
                <span className="text-[var(--color-text)] font-medium">{currentChapter.title}</span>
              </nav>

              {/* 标题 */}
              <header className="mb-8 pb-6 border-b-2 border-[var(--color-accent)]">
                <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary-dark)] leading-tight">
                  {currentChapter.title}
                </h1>
                {/* 移动端滑动提示 */}
                {isMobile && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    左右滑动切换章节
                  </p>
                )}
              </header>

              <ChapterContent chapter={currentChapter} chapterId={renderChapter?.chapterId || ''} />

              {/* 桌面端导航 */}
              {!isMobile && (
                <ChapterNav adjacent={adjacentChapters} onNavigate={navigateToChapter} />
              )}

              {/* 移动端底部留白 */}
              {isMobile && <div className="h-8" />}
            </article>
          )}
        </main>
      </div>

      {/* 移动端底部导航栏 */}
      <MobileNav
        adjacent={adjacentChapters}
        onNavigate={navigateToChapter}
        onBackToHome={() => navigateToChapter(null)}
        progress={progress}
        isChapterView={!!activeChapter}
      />
    </div>
  )
}
