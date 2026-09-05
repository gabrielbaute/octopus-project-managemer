'use client'

import { CalendarDays, Plus, Trash2 } from 'lucide-react'
import type { Status, Task } from '../../types'

interface Props {
  columns: { key: Status; label: string }[]
  tasks: Task[]
  onSelectTask: (task: Task) => void
  onUpdateTask: (id: number, fields: Partial<Task>) => void
  onDeleteTask: (id: number) => void
  onOpenModalWithStatus: (status: Status) => void
}

/**
 * Representación en tablero Kanban de las tareas de un subproyecto.
 *
 * @param {Props} props - Propiedades para renderizado y callbacks de eventos.
 */
export function TaskKanbanView({
  columns,
  tasks,
  onSelectTask,
  onUpdateTask,
  onDeleteTask,
  onOpenModalWithStatus
}: Props) {
  return (
    <div className="kanban" style={{ marginTop: '20px' }}>
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key)
        return (
          <div className="column" key={col.key}>
            <div className="column-title">
              <span>{col.label}</span>
              <span className="column-count">{colTasks.length}</span>
            </div>

            <div className="column-stack">
              {colTasks.map((task) => (
                <div
                  className="project-card"
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-top">
                    <span className={`priority ${task.priority}`} />
                    <button
                      type="button"
                      className="icon-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteTask(task.id)
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}

                  <div className="card-meta" style={{ marginTop: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CalendarDays size={13} />
                      <input
                        type="date"
                        value={task.dueDate || ''}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdateTask(task.id, { dueDate: e.target.value })}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#888',
                          fontSize: '11px',
                          colorScheme: 'dark'
                        }}
                      />
                    </span>
                  </div>

                  <div className="card-foot" style={{ marginTop: '8px' }}>
                    <select
                      value={task.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdateTask(task.id, { status: e.target.value as Status })}
                      style={{
                        background: '#18171c',
                        color: '#fff',
                        border: '1px solid #3a3740',
                        borderRadius: '4px',
                        fontSize: '11px',
                        padding: '2px 4px'
                      }}
                    >
                      {columns.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="add-card"
                onClick={() => onOpenModalWithStatus(col.key)}
              >
                <Plus size={15} /> Añadir tarea
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
