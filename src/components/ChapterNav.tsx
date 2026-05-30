import type { AdjacentChapters, ChapterRef } from '@/types'

interface ChapterNavProps {
  adjacent: AdjacentChapters
  onNavigate: (target: ChapterRef) => void
}

export default function ChapterNav({ adjacent, onNavigate }: ChapterNavProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10 pt-6 border-t border-[var(--color-border)]">
      {adjacent.prev ? (
        <button
          onClick={() => onNavigate({ moduleId: adjacent.prev!.moduleId, chapterId: adjacent.prev!.id })}
          className="nav-btn flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] sm:w-auto"
          aria-label={`上一章：${adjacent.prev.title}`}
          style={{ '--nav-dir': '-4px' } as React.CSSProperties}
        >
          <span aria-hidden="true">←</span>
          <div className="text-left">
            <p className="text-xs text-[var(--color-text-muted)]">上一章</p>
            <p className="text-sm font-medium">{adjacent.prev.title}</p>
          </div>
        </button>
      ) : <div />}
      {adjacent.next ? (
        <button
          onClick={() => onNavigate({ moduleId: adjacent.next!.moduleId, chapterId: adjacent.next!.id })}
          className="nav-btn flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] sm:w-auto"
          aria-label={`下一章：${adjacent.next.title}`}
          style={{ '--nav-dir': '4px' } as React.CSSProperties}
        >
          <div className="text-left sm:text-right">
            <p className="text-xs text-[var(--color-text-muted)]">下一章</p>
            <p className="text-sm font-medium">{adjacent.next.title}</p>
          </div>
          <span aria-hidden="true">→</span>
        </button>
      ) : <div />}
    </div>
  )
}
