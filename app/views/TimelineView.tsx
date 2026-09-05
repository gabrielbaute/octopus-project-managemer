'use client'

import type { Subproject } from '../types'

interface TimelineViewProps {
  projects: Subproject[]
  onSelect: (p: Subproject) => void
}

function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <span style={{ width: `${value}%` }} />
    </div>
  )
}

export function TimelineView({ projects, onSelect }: TimelineViewProps) {
  return (
    <div className="timeline">
      <div className="timeline-line" />
      {projects.map((project, i) => (
        <div className="timeline-row" key={project.id}>
          <div className="timeline-date">
            {project.dueDate}
            <span>2026</span>
          </div>
          <div className={`timeline-node dot-${project.color || 'sage'}`} />
          <button
            type="button"
            className="timeline-card"
            onClick={() => onSelect(project)}
          >
            <div>
              <span className="eyebrow">
                Phase {i + 1} / {project.status}
              </span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <div className="timeline-progress">
              <strong>{project.progress || 0}%</strong>
              <Progress value={project.progress || 0} />
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}
