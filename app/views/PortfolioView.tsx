'use client'

import { ArrowUpRight, CalendarDays, FileText, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { Status, Subproject } from '../types'

const columns: { key: Status; label: string }[] = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'writing', label: 'Writing' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Published' }
]

interface PortfolioViewProps {
  projects: Subproject[]
  onSelect: (p: Subproject) => void
  onDelete: (id: number, e: React.MouseEvent) => void
  onOpenNewModal: () => void
}

export function PortfolioView({ projects, onSelect, onDelete, onOpenNewModal }: PortfolioViewProps) {
  return (
    <div className="kanban">
      {columns.map((column) => {
        const colProjects = projects.filter((p) => p.status === column.key)
        return (
          <div className="column" key={column.key}>
            <div className="column-title">
              <span>{column.label}</span>
              <span className="column-count">{colProjects.length}</span>
            </div>

            <div className="column-stack">
              {colProjects.map((project) => (
                <div
                  className="project-card"
                  key={project.id}
                  onClick={() => onSelect(project)}
                >
                  <div className="card-top">
                    <span className={`project-dot dot-${project.color || 'sage'}`} />
                    <span className="eyebrow">{project.status}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <Link
                        href={`/subprojects/${project.id}`}
                        className="icon-button"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowUpRight size={14} />
                      </Link>
                      <button
                        type="button"
                        className="icon-button"
                        onClick={(e) => onDelete(project.id, e)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.description || 'Sin descripción'}</p>

                  <div className="card-meta">
                    <span>
                      <CalendarDays size={13} /> {project.dueDate}
                    </span>
                    <span>
                      <FileText size={13} /> {project.completedCount || 0}/{project.taskCount || 0}
                    </span>
                  </div>

                  <div className="progress">
                    <span style={{ width: `${project.progress || 0}%` }} />
                  </div>

                  <div className="card-foot">
                    <span>{project.progress || 0}% complete</span>
                  </div>
                </div>
              ))}

              {column.key === 'backlog' && (
                <button type="button" className="add-card" onClick={onOpenNewModal}>
                  <Plus size={15} /> Add Subproject
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
