'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Priority, Status, Subproject, Task, ViewMode } from '@/types'

/**
 * Hook para gestionar el estado y las operaciones de tareas de un subproyecto.
 *
 * @param {number} subprojectId - ID del subproyecto activo.
 * @returns {Object} Estado de la vista, subproyecto, tareas filtradas y métodos CRUD.
 */
export function useSubprojectTasks(subprojectId: number) {
  const [subproject, setSubproject] = useState<Subproject | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [view, setView] = useState<ViewMode>('portfolio')
  const [query, setQuery] = useState('')
  const [targetStatus, setTargetStatus] = useState<Status>('backlog')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [resP, resT] = await Promise.all([
        fetch('/api/subprojects'),
        fetch(`/api/tasks?subprojectId=${subprojectId}`)
      ])

      if (!resP.ok || !resT.ok) return

      const projects: Subproject[] = await resP.json()
      const taskList: Task[] = await resT.json()

      const current = projects.find((p) => p.id === subprojectId)
      if (current) setSubproject(current)
      setTasks(taskList)

      if (selectedTask) {
        const updatedSelected = taskList.find((t) => t.id === selectedTask.id)
        if (updatedSelected) setSelectedTask(updatedSelected)
      }
    } catch (error) {
      console.error('Error al cargar datos del subproyecto:', error)
    }
  }, [subprojectId, selectedTask])

  useEffect(() => {
    if (subprojectId) loadData()
  }, [subprojectId, loadData])

  const createTask = async (data: {
    title: string
    description: string
    priority: Priority
    status: Status
    dueDate: string
  }) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subprojectId, ...data })
    })
    if (res.ok) {
      setShowTaskModal(false)
      await loadData()
    }
  }

  const updateTask = async (taskId: number, fields: Partial<Task>) => {
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId, ...fields })
    })
    if (res.ok) await loadData()
  }

  const deleteTask = async (taskId: number) => {
    const res = await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' })
    if (res.ok) {
      if (selectedTask?.id === taskId) setSelectedTask(null)
      await loadData()
    }
  }

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  )

  return {
    subproject,
    tasks: filteredTasks,
    view,
    setView,
    query,
    setQuery,
    targetStatus,
    setTargetStatus,
    showTaskModal,
    setShowTaskModal,
    selectedTask,
    setSelectedTask,
    createTask,
    updateTask,
    deleteTask
  }
}
