'use client'

import { ArrowUpRight, CalendarDays, CheckSquare, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { Subproject } from '../types'

interface ListViewProps {
  projects: Subproject[]
  onSelect: (p: Subproject) => void
  onDelete: (id: number, e: React.MouseEvent) => void
}

export function ListView({ projects, onSelect, onDelete }: ListViewProps) {
  return (
    <div className="list-view-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {projects.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
          No hay subproyectos para mostrar en esta vista.
        </div>
      ) : (
        projects.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'var(--card-bg, #1e1e1e)',
              borderRadius: '8px',
              border: '1px solid var(--border-color, #333)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={`project-dot dot-${p.color || 'sage'}`} />
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>{p.title}</strong>
                <span style={{ fontSize: '12px', color: '#888' }}>{p.description || 'Sin descripción'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '12px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CalendarDays size={13} /> {p.dueDate}
              </span>
              <span style={{ fontSize: '12px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckSquare size={13} /> {p.completedCount || 0}/{p.taskCount || 0}
              </span>
              <span className="eyebrow" style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                {p.status}
              </span>
              <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                <Link href={`/subprojects/${p.id}`} className="icon-button">
                  <ArrowUpRight size={14} />
                </Link>
                <button type="button" className="icon-button" onClick={(e) => onDelete(p.id, e)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
