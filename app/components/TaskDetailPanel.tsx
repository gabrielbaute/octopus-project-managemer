'use client'

import { useState, useEffect } from 'react'
import { Calendar, CheckCircle2, AlertCircle, Trash2, X } from 'lucide-react'
import type { Task, Status, Priority } from '../types'

interface TaskDetailPanelProps {
  task: Task
  onClose: () => void
  onUpdateTask: (id: number, fields: Partial<Task>) => void
  onDeleteTask: (id: number) => void
}

export function TaskDetailPanel({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask
}: TaskDetailPanelProps) {
  // Estado local para evitar latencia al escribir textos largos o código
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState<Status>(task.status)
  const [priority, setPriority] = useState<Priority>(task.priority || 'medium')
  const [dueDate, setDueDate] = useState(task.dueDate || '')

  // Mantener sincronizado si cambia la tarea prop
  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description || '')
    setStatus(task.status)
    setPriority(task.priority || 'medium')
    setDueDate(task.dueDate || '')
  }, [task])

  const handleBlurSave = () => {
    onUpdateTask(task.id, {
      title,
      description,
      status,
      priority,
      dueDate
    })
  }

  return (
    <aside
      className="task-detail-panel"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '520px',
        height: '100vh',
        backgroundColor: 'var(--bg-panel, #121214)',
        borderLeft: '1px solid var(--border-color, #27272a)',
        padding: '24px',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '-6px 0 20px rgba(0,0,0,0.6)'
      }}
    >
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="eyebrow" style={{ textTransform: 'uppercase', fontSize: '11px', color: '#888', letterSpacing: '1px' }}>
          Detalles de la Tarea #{task.id}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="icon-button"
            title="Eliminar Tarea"
            onClick={() => {
              if (confirm('¿Eliminar esta tarea?')) {
                onDeleteTask(task.id)
                onClose()
              }
            }}
          >
            <Trash2 size={16} color="#ef4444" />
          </button>
          <button type="button" className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Editor de Título */}
      <div>
        <input
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid transparent',
            color: '#fff',
            width: '100%',
            outline: 'none',
            padding: '4px 0'
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlurSave}
          placeholder="Título de la tarea..."
        />
      </div>

      {/* Grid de Metadatos (Estado, Prioridad, Fecha) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          backgroundColor: '#18181b',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #27272a'
        }}
      >
        {/* Estado */}
        <div>
          <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Estado</label>
          <select
            value={status}
            onChange={(e) => {
              const newStatus = e.target.value as Status
              setStatus(newStatus)
              onUpdateTask(task.id, { status: newStatus })
            }}
            style={{
              backgroundColor: '#27272a',
              color: '#fff',
              border: 'none',
              padding: '6px',
              borderRadius: '4px',
              fontSize: '12px',
              width: '100%'
            }}
          >
            <option value="backlog">Backlog</option>
            <option value="writing">Writing</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Prioridad</label>
          <select
            value={priority}
            onChange={(e) => {
              const newPriority = e.target.value as Priority
              setPriority(newPriority)
              onUpdateTask(task.id, { priority: newPriority })
            }}
            style={{
              backgroundColor: '#27272a',
              color: '#fff',
              border: 'none',
              padding: '6px',
              borderRadius: '4px',
              fontSize: '12px',
              width: '100%'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Fecha de Entrega */}
        <div>
          <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Fecha Límite</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value)
              onUpdateTask(task.id, { dueDate: e.target.value })
            }}
            style={{
              backgroundColor: '#27272a',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              padding: '5px',
              borderRadius: '4px',
              width: '100%',
              colorScheme: 'dark'
            }}
          />
        </div>
      </div>

      {/* Editor de Descripción Extensa (Documentación y Fragmentos de código) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '12px', color: '#aaa', fontWeight: 600 }}>
            Documentación / Descripción Detallada:
          </label>
          <span style={{ fontSize: '10px', color: '#666' }}>Acepta texto largo y bloques de código</span>
        </div>
        <textarea
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '6px',
            color: '#e4e4e7',
            padding: '12px',
            fontSize: '13px',
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            lineHeight: '1.5',
            resize: 'none',
            outline: 'none'
          }}
          placeholder="Escribe la documentación de la tarea, notas tecnicas o snippets de código..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleBlurSave}
        />
      </div>

      <div style={{ fontSize: '11px', color: '#555', textAlign: 'right' }}>
        Los cambios se guardan automáticamente al desenfocar los campos.
      </div>
    </aside>
  )
}
