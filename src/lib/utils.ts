import type { Module, Chapter, ChapterRef, AdjacentChapters } from '@/types'

/** 将所有章节扁平化，附加模块信息 */
export function getAllChaptersFlat(modules: Module[]) {
  return modules.flatMap((mod) =>
    mod.chapters.map((ch) => ({
      ...ch,
      moduleId: mod.id,
      moduleTitle: mod.title,
    }))
  )
}

/** 获取相邻章节 */
export function getAdjacentChapters(modules: Module[], moduleId: string, chapterId: string): AdjacentChapters {
  const all = getAllChaptersFlat(modules)
  const index = all.findIndex((c) => c.moduleId === moduleId && c.id === chapterId)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  }
}

/** 判断目标章节相对于当前章节的方向 */
export function getDirection(modules: Module[], current: ChapterRef, target: ChapterRef): 'left' | 'right' {
  const all = modules.flatMap(m => m.chapters.map(c => ({ moduleId: m.id, chapterId: c.id })))
  const curIdx = all.findIndex(c => c.moduleId === current.moduleId && c.chapterId === current.chapterId)
  const tarIdx = all.findIndex(c => c.moduleId === target.moduleId && c.chapterId === target.chapterId)
  return tarIdx > curIdx ? 'left' : 'right'
}

/** 获取章节在全部章节中的进度百分比 */
export function getChapterProgress(modules: Module[], moduleId: string, chapterId: string): number {
  const allChapters = modules.flatMap(m => m.chapters.map(c => ({ moduleId: m.id, chapterId: c.id })))
  const idx = allChapters.findIndex(c => c.moduleId === moduleId && c.chapterId === chapterId)
  return idx >= 0 ? ((idx + 1) / allChapters.length) * 100 : 0
}
