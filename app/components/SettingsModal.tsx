'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { ProjectSettings } from '../types'

interface SettingsModalProps {
  current: ProjectSettings
  onClose: () => void
  onSave: (title: string, description: string) => void
}

export function SettingsModal({ current, onClose, onSave }: SettingsModalProps) {
  const [title, setTitle] = useState<string>(current.title)
  const [description, setDescription] = useState<string>(current.description)

  return (
    <div className="overlay" onClick={onClose}>
      <div className="new-modal" onClick={(e) => e.stopPropagation()}>
        <div className="detail-head">
          <div>
            <span className="eyebrow">Settings</span>
            <h2>Editar Proyecto Principal</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginTop: '10px' }}>
          Nombre:
        </label>
        <input
          className="modal-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginTop: '10px' }}>
          Descripción:
        </label>
        <textarea
          className="modal-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <button
          type="button"
          className="new-button"
          style={{ marginTop: '15px', width: '100%', justifyContent: 'center' }}
          onClick={() => onSave(title, description)}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  )
}
