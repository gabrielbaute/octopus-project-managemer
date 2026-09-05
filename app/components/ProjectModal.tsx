'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface ProjectModalProps {
  onClose: () => void
  onCreate: (data: { title: string; description: string; dueDate: string; status: string }) => void
}

/**
 * Modal para la creación de subproyectos con campo de fecha nativo.
 *
 * @param props - Propiedades del modal
 * @returns Elemento TSX del modal
 */
export function ProjectModal({ onClose, onCreate }: ProjectModalProps) {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  // Inicialización con la fecha actual en formato YYYY-MM-DD
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onCreate({
      title,
      description,
      dueDate: dueDate || 'Sin fecha',
      status: 'backlog'
    })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="new-modal" onClick={(e) => e.stopPropagation()}>
        <div className="detail-head">
          <div>
            <span className="eyebrow">New Subproject</span>
            <h2>Create subproject item</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            autoFocus
            className="modal-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="modal-input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

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

          <button
            type="submit"
            className="new-button"
            style={{ marginTop: '15px', width: '100%', justifyContent: 'center' }}
          >
            Save Subproject
          </button>
        </form>
      </div>
    </div>
  )
}
