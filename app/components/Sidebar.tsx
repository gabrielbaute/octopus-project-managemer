'use client'

import { Archive, ArrowUpRight, ChevronDown, Columns3, Folder } from 'lucide-react'
import Link from 'next/link'
import type { Subproject } from '../types'

interface SidebarProps {
  projects: Subproject[]
  activeFilter: string | null
  setActiveFilter: (id: string | null) => void
}

export function Sidebar({ projects, activeFilter, setActiveFilter }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <span className="section-label">Workspace</span>
        <button type="button" aria-label="Collapse workspace">
          <ChevronDown size={14} />
        </button>
      </div>

      <nav>
        <button
          type="button"
          className={`nav-item ${activeFilter === null ? 'active' : ''}`}
          onClick={() => setActiveFilter(null)}
        >
          <Columns3 size={16} /> All Subprojects
        </button>
        <button type="button" className="nav-item">
          <Archive size={16} /> Archive <span className="nav-count">{projects.length}</span>
        </button>
      </nav>

      <div className="sidebar-head" style={{ marginTop: '20px' }}>
        <span className="section-label">Subprojects List</span>
      </div>

      <nav className="subproject-nav-list" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {projects.map((p) => {
          const isActive = activeFilter === String(p.id)

          return (
            <div
              key={p.id}
              className={`nav-item-container ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '6px',
                paddingRight: '4px',
                backgroundColor: isActive ? 'var(--bg-active, #27272a)' : 'transparent'
              }}
            >
              <button
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  padding: '8px 12px',
                  color: isActive ? '#fff' : '#a1a1aa',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveFilter(String(p.id))}
              >
                <Folder size={14} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.title}
                </span>
              </button>

              <Link
                href={`/subprojects/${p.id}`}
                className="icon-button"
                title="Ver Kanban individual"
                style={{
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#71717a',
                  flexShrink: 0
                }}
              >
                <ArrowUpRight size={13} />
              </Link>
            </div>
          )
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-row">
          <div className="avatar small-avatar">SC</div>
          <div>
            <strong>Developer</strong>
            <span className="muted small">Local Database</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
