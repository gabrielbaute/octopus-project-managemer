export type Priority = 'low' | 'medium' | 'high'
export type Status = 'backlog' | 'writing' | 'review' | 'done'
export type ViewMode = 'portfolio' | 'list' | 'timeline'

export interface ProjectSettings {
  title: string
  description: string
}

export interface Subproject {
  id: number
  title: string
  description: string
  dueDate: string
  status: Status
  color: string
  taskCount?: number
  completedCount?: number
  progress?: number
}

export interface Task {
  id: number
  subprojectId: number
  title: string
  description: string
  priority: Priority
  status: Status
  dueDate: string
}
