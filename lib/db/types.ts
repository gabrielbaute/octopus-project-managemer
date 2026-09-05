export type Priority = 'low' | 'medium' | 'high'
export type Status = 'backlog' | 'writing' | 'review' | 'done'

export interface User {
  id: number
  email: string
  passwordHash: string
  name: string
  createdAt?: string
}

export interface ProjectSettings {
  id?: number
  userId: number
  title: string
  description: string
}

export interface Subproject {
  id: number
  userId: number
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
