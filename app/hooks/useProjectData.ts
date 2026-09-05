'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProjectSettings, Status, Subproject, Task } from '../types'

export function useProjectData() {
  const [settings, setSettings] = useState<ProjectSettings>({
    title: 'SamanWriter',
    description: 'Gestión modular de proyectos y tareas.'
  })
  const [projects, setProjects] = useState<Subproject[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [resSettings, resProjects, resTasks] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/subprojects'),
        fetch('/api/tasks')
      ])

      // Redirigir al login si alguna petición retorna 401 (No autorizado)
      if (resSettings.status === 401 || resProjects.status === 401 || resTasks.status === 401) {
        router.push('/login')
        return
      }

      if (resSettings.ok) {
        const dataSettings = await resSettings.json()
        setSettings(dataSettings)
      }

      if (resProjects.ok) {
        const dataProjects = await resProjects.json()
        setProjects(dataProjects)
      }

      if (resTasks.ok) {
        const dataTasks = await resTasks.json()
        setTasks(dataTasks)
      }
    } catch (error) {
      console.error('Error al sincronizar con la API:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  const saveSettings = async (title: string, description: string) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      })
      if (res.ok) await loadData()
    } catch (error) {
      console.error('Error al guardar configuración:', error)
    }
  }

  const createSubproject = async (data: Partial<Subproject>) => {
    try {
      const res = await fetch('/api/subprojects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) await loadData()
    } catch (error) {
      console.error('Error al crear subproyecto:', error)
    }
  }

  const updateSubproject = async (id: number, fields: Partial<Subproject>) => {
    try {
      const res = await fetch('/api/subprojects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...fields })
      })
      if (res.ok) await loadData()
    } catch (error) {
      console.error('Error al actualizar subproyecto:', error)
    }
  }

  const deleteSubproject = async (id: number) => {
    try {
      const res = await fetch(`/api/subprojects?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) await loadData()
    } catch (error) {
      console.error('Error al eliminar subproyecto:', error)
    }
  }

  const createTask = async (data: Partial<Task>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) await loadData()
    } catch (error) {
      console.error('Error al crear tarea:', error)
    }
  }

  const toggleTaskStatus = async (task: Task) => {
    try {
      const nextStatus: Status = task.status === 'done' ? 'writing' : 'done'
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: nextStatus })
      })
      if (res.ok) await loadData()
    } catch (error) {
      console.error('Error al actualizar tarea:', error)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) await loadData()
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
    }
  }

  return {
    settings,
    projects,
    tasks,
    loading,
    saveSettings,
    createSubproject,
    updateSubproject,
    deleteSubproject,
    createTask,
    toggleTaskStatus,
    deleteTask,
    refreshData: loadData
  }
}
