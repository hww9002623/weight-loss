import type { Chapter } from '@/types'

interface ChapterContentProps {
  chapter: Chapter
  chapterId: string
}

export default function ChapterContent({ chapter, chapterId }: ChapterContentProps) {
  return (
    <>
      {/* 正文 */}
      <div className="space-y-4 sm:space-y-5">
        {chapter.content.map((para, i) => (
          <p
            key={`${chapterId}-${i}`}
            className="content-para text-[var(--color-text)] leading-[1.8] sm:leading-[1.9] text-[15px] sm:text-base"
          >
            {para}
          </p>
        ))}
      </div>

      {/* 小贴士 */}
      {chapter.tip && (
        <div className="tip-card flex gap-3 sm:gap-4 my-6 sm:my-8 p-4 sm:p-5 bg-[var(--color-tip-bg)] border-l-4 border-[var(--color-tip-border)] rounded-r-xl">
          <span className="text-xl sm:text-2xl flex-shrink-0" aria-hidden="true">💡</span>
          <div>
            <p className="font-bold text-[var(--color-primary-dark)] text-sm mb-1">小贴士</p>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{chapter.tip}</p>
          </div>
        </div>
      )}

      {/* 本章要点 */}
      {chapter.takeaways && (
        <section className="takeaway-card mt-6 sm:mt-8 p-4 sm:p-5 bg-white border border-[var(--color-border)] rounded-xl ios-card-shadow">
          <h2 className="font-bold text-[var(--color-primary-dark)] text-lg mb-3 sm:mb-4">本章要点</h2>
          <ul className="space-y-2.5 sm:space-y-3">
            {chapter.takeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-sm text-[var(--color-text)]">
                <span className="flex-shrink-0 w-5 h-5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
