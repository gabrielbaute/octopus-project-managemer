'use client'

import { useState } from 'react'
import { Calendar, Check, Plus, Trash2, X } from 'lucide-react'
import { TaskDetailPanel } from './TaskDetailPanel'
import type { Status, Subproject, Task } from '../types'

interface DetailPanelProps {
  project: Subproject
  tasks: Task[]
  onClose: () => void
  onUpdateProject: (id: number, fields: Partial<Subproject>) => void
  onCreateTask: (task: Partial<Task>) => void
  onToggleTask: (task: Task) => void
  onDeleteTask: (id: number) => void
  onUpdateTask?: (id: number, fields: Partial<Task>) => void
}

export function DetailPanel({
  project,
  tasks,
  onClose,
  onUpdateProject,
  onCreateTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask
}: DetailPanelProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  // Estado local para controlar cuál tarea se está editando a fondo en el panel flotante
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Filtrar tareas que pertenecen únicamente a este subproyecto
  const projectTasks = tasks.filter((t) => t.subprojectId === project.id)

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    onCreateTask({
      subprojectId: project.id,
      title: newTaskTitle,
      status: 'writing',
      priority: 'medium',
      description: '',
      dueDate: project.dueDate
    })
    setNewTaskTitle('')
  }

  return (
    <>
      <aside
        className="detail-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          backgroundColor: 'var(--bg-panel, #18181b)',
          borderLeft: '1px solid var(--border-color, #27272a)',
          padding: '24px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.5)'
        }}
      >
        {/* Encabezado del Panel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="eyebrow" style={{ textTransform: 'uppercase', fontSize: '11px', color: '#888' }}>
            Detalles del Subproyecto
          </span>
          <button type="button" className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Editor rápido de Título y Estado */}
        <div>
          <input
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              width: '100%',
              marginBottom: '8px'
            }}
            value={project.title}
            onChange={(e) => onUpdateProject(project.id, { title: e.target.value })}
          />

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={project.status}
              onChange={(e) => onUpdateProject(project.id, { status: e.target.value as Status })}
              style={{
                backgroundColor: '#27272a',
                color: '#fff',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="backlog">Backlog</option>
              <option value="writing">Writing</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>

            {/* Campo para la edición rápida de la Fecha de Entrega */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#27272a', padding: '2px 6px', borderRadius: '4px' }}>
              <Calendar size={12} color="#888" />
              <input
                type="date"
                value={project.dueDate || ''}
                onChange={(e) => onUpdateProject(project.id, { dueDate: e.target.value })}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  colorScheme: 'dark'
                }}
              />
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>
            Descripción:
          </label>
          <textarea
            style={{
              width: '100%',
              backgroundColor: '#27272a',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              padding: '8px',
              fontSize: '13px',
              resize: 'vertical'
            }}
            rows={3}
            value={project.description || ''}
            onChange={(e) => onUpdateProject(project.id, { description: e.target.value })}
          />
        </div>

        <hr style={{ borderColor: '#27272a', margin: '0' }} />

        {/* Lista de Tareas (Checklist) */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#ccc' }}>Tareas del Subproyecto</h4>

          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              placeholder="Añadir nueva tarea..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#27272a',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 10px',
                color: '#fff',
                fontSize: '13px'
              }}
            />
            <button
              type="submit"
              className="new-button"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <Plus size={14} />
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {projectTasks.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#666' }}>No hay tareas aún.</p>
            ) : (
              projectTasks.map((task) => {
                const isDone = task.status === 'done'
                return (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px',
                      backgroundColor: '#27272a',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Botón Checkbox: solo conmuta el estado de la tarea */}
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '3px',
                          border: '1px solid #555',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isDone ? '#4ade80' : 'transparent',
                          cursor: 'pointer'
                        }}
                        onClick={() => onToggleTask(task)}
                      >
                        {isDone && <Check size={12} color="#000" />}
                      </div>

                      {/* Título de la Tarea: Al hacer clic se abre el panel flotante de edición profunda */}
                      <span
                        onClick={() => setSelectedTask(task)}
                        style={{
                          fontSize: '13px',
                          textDecoration: isDone ? 'line-through' : 'none',
                          color: isDone ? '#888' : '#fff',
                          cursor: 'pointer'
                        }}
                        title="Haz clic para editar detalles y código"
                      >
                        {task.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </aside>

      {/* Renderiza el panel extenso por encima si hay una tarea seleccionada */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={(id, fields) => {
            if (onUpdateTask) {
              onUpdateTask(id, fields)
            }
          }}
          onDeleteTask={onDeleteTask}
        />
      )}
    </>
  )
}
