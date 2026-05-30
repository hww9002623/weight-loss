export interface Chapter {
  id: string
  title: string
  content: string[]
  tip?: string
  takeaways?: string[]
}

export interface Module {
  id: string
  title: string
  icon: string
  description: string
  chapters: Chapter[]
}

export interface ChapterRef {
  moduleId: string
  chapterId: string
}

export interface AdjacentChapters {
  prev: (Chapter & { moduleId: string; moduleTitle: string }) | null
  next: (Chapter & { moduleId: string; moduleTitle: string }) | null
}
