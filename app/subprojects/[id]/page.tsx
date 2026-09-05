'use client'

import { use } from 'react'
import { ArrowLeft, Clock3, Columns3, List, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import Header from '../../components/Header'
import { TaskModal } from '../../components/TaskModal'
import { TaskDetailPanel } from '../../components/TaskDetailPanel'
import { TaskKanbanView } from '../../components/subproject/TaskKanbanView'
import { useSubprojectTasks } from '../../hooks/useSubprojectTasks'
import type { Status } from '../../types'

const columns: { key: Status; label: string }[] = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'writing', label: 'Writing' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Published' }
]

export default function SubprojectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const subprojectId = Number(id)

  const {
    subproject,
    tasks,
    view,
    setView,
    query,
    setQuery,
    targetStatus,
    setTargetStatus,
    showTaskModal,
    setShowTaskModal,
    selectedTask,
    setSelectedTask,
    createTask,
    updateTask,
    deleteTask
  } = useSubprojectTasks(subprojectId)

  if (!subproject) {
    return (
      <main className="app-shell">
        <div style={{ padding: '40px', color: '#fff' }}>Cargando subproyecto...</div>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <Header title="KANBAN TAREAS" />

      <section className="content" style={{ padding: '30px 40px' }}>
        <div className="content-head">
          <div>
            <div className="breadcrumb" style={{ marginBottom: '10px' }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#a78bfa' }}>
                <ArrowLeft size={14} /> Volver al Dashboard
              </Link>
            </div>
            <h1>{subproject.title}</h1>
            <p className="subtitle">{subproject.description || 'Sin descripción asignada.'}</p>
          </div>

          <button
            type="button"
            className="new-button"
            onClick={() => {
              setTargetStatus('backlog')
              setShowTaskModal(true)
            }}
          >
            <Plus size={16} /> Nueva tarea
          </button>
        </div>

        <div className="toolbar">
          <div className="view-tabs">
            <button
              type="button"
              className={view === 'portfolio' ? 'selected' : ''}
              onClick={() => setView('portfolio')}
            >
              <Columns3 size={15} /> Board
            </button>
            <button
              type="button"
              className={view === 'list' ? 'selected' : ''}
              onClick={() => setView('list')}
            >
              <List size={15} /> List
            </button>
            <button
              type="button"
              className={view === 'timeline' ? 'selected' : ''}
              onClick={() => setView('timeline')}
            >
              <Clock3 size={15} /> Timeline
            </button>
          </div>

          <div className="tool-actions">
            <label className="search">
              <Search size={15} />
              <input
                placeholder="Buscar tareas..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
        </div>

        {view === 'portfolio' && (
          <TaskKanbanView
            columns={columns}
            tasks={tasks}
            onSelectTask={setSelectedTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onOpenModalWithStatus={(status) => {
              setTargetStatus(status)
              setShowTaskModal(true)
            }}
          />
        )}
      </section>

      {showTaskModal && (
        <TaskModal
          initialStatus={targetStatus}
          onClose={() => setShowTaskModal(false)}
          onCreate={createTask}
        />
      )}

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      )}
    </main>
  )
}
