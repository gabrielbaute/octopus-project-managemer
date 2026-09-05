'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { Priority, Status } from '../types'

interface TaskModalProps {
  initialStatus: Status
  onClose: () => void
  onCreate: (task: { title: string; description: string; priority: Priority; status: Status; dueDate: string }) => void
}

/**
 * Modal para la creación y asignación de fecha a tareas.
 *
 * @param props - Propiedades del modal
 * @returns Elemento TSX del modal
 */
export function TaskModal({ initialStatus, onClose, onCreate }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<Status>(initialStatus)
  // Estado para la fecha (por defecto la fecha actual en YYYY-MM-DD)
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onCreate({ title, description, priority, status, dueDate })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="new-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="detail-head">
          <div>
            <span className="eyebrow">NUEVA TAREA</span>
            <h2>Agregar al flujo</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            autoFocus
            className="modal-input"
            placeholder="Título de la tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="modal-input"
            placeholder="Descripción (opcional)"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Fecha de Entrega */}
          <div>
            <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>
              FECHA DE ENTREGA
            </label>
            <input
              type="date"
              className="modal-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>
                PRIORIDAD
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                style={{
                  width: '100%',
                  background: '#18171c',
                  color: '#fff',
                  border: '1px solid #3a3740',
                  borderRadius: '4px',
                  padding: '6px',
                  fontSize: '12px'
                }}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>
                ESTADO
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                style={{
                  width: '100%',
                  background: '#18171c',
                  color: '#fff',
                  border: '1px solid #3a3740',
                  borderRadius: '4px',
                  padding: '6px',
                  fontSize: '12px'
                }}
              >
                <option value="backlog">Backlog</option>
                <option value="writing">Writing</option>
                <option value="review">Review</option>
                <option value="done">Published</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="new-button"
            style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}
          >
            Guardar Tarea
          </button>
        </form>
      </div>
    </div>
  )
}
