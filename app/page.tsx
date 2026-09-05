'use client'

import { useState } from 'react'
import { Clock3, Columns3, List, Pencil, Plus, Search } from 'lucide-react'
import  Header  from './components/Header'
import { Sidebar } from './components/Sidebar'
import { SettingsModal } from './components/SettingsModal'
import { ProjectModal } from './components/ProjectModal'
import { DetailPanel } from './components/DetailPanel'
import { PortfolioView } from './views/PortfolioView'
import { ListView } from './views/ListView'
import { TimelineView } from './views/TimelineView'
import { useProjectData } from './hooks/useProjectData'
import type { Subproject, ViewMode } from './types'

export default function Page() {
  const {
    settings,
    projects,
    tasks,
    saveSettings,
    createSubproject,
    updateSubproject,
    createTask,
    toggleTaskStatus,
    deleteTask,
    deleteSubproject
  } = useProjectData()

  const [view, setView] = useState<ViewMode>('portfolio')
  const [query, setQuery] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Subproject | null>(null)
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false)

  // Cambio principal: Al hacer click en un ítem del Sidebar se abre el DetailPanel del subproyecto
  const handleSelectSidebarFilter = (id: string | null) => {
    setActiveFilter(id)
    if (id !== null) {
      const targetProject = projects.find((p) => p.id === Number(id))
      if (targetProject) {
        setSelectedProject(targetProject)
      }
    } else {
      setSelectedProject(null)
    }
  }

  // Filtrado exclusivo para la búsqueda de texto
  const filteredProjects = projects.filter((p) => {
    return p.title.toLowerCase().includes(query.toLowerCase())
  })

  // Sincronizar el estado actual con selectedProject si actualizamos datos en caliente
  const currentSelectedProject = selectedProject
    ? projects.find((p) => p.id === selectedProject.id) || selectedProject
    : null

  return (
    <main className="app-shell">
      <Header title={settings.title} />

      <div className="layout">
        <Sidebar
          projects={projects}
          activeFilter={activeFilter}
          setActiveFilter={handleSelectSidebarFilter}
        />

        <section className="content">
          <div className="content-head">
            <div>
              <div className="breadcrumb">
                <span>Project Dashboard</span>
                <span>/</span>
                <strong>
                  {activeFilter
                    ? projects.find((p) => p.id === Number(activeFilter))?.title
                    : settings.title}
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1>
                  {settings.title}
                  <span className="period">.</span>
                </h1>
                <button
                  type="button"
                  className="icon-button"
                  style={{ padding: '6px' }}
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Pencil size={18} />
                </button>
              </div>
              <p className="subtitle">{settings.description}</p>
            </div>

            <button
              type="button"
              className="new-button"
              onClick={() => setShowProjectModal(true)}
            >
              <Plus size={16} /> New Subproject
            </button>
          </div>

          <div className="toolbar">
            <div className="view-tabs">
              <button
                type="button"
                className={view === 'portfolio' ? 'selected' : ''}
                onClick={() => setView('portfolio')}
              >
                <Columns3 size={15} /> Portfolio
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
                  placeholder="Find a subproject..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
          </div>

          {view === 'portfolio' && (
            <PortfolioView
              projects={filteredProjects}
              onSelect={setSelectedProject}
              onDelete={(id, e) => {
                e.stopPropagation()
                if (confirm('¿Deseas eliminar este subproyecto?')) {
                  deleteSubproject(id)
                }
              }}
              onOpenNewModal={() => setShowProjectModal(true)}
            />
          )}

          {view === 'list' && (
            <ListView
              projects={filteredProjects}
              onSelect={setSelectedProject}
              onDelete={(id, e) => {
                e.stopPropagation()
                if (confirm('¿Deseas eliminar este subproyecto?')) {
                  deleteSubproject(id)
                }
              }}
            />
          )}

          {view === 'timeline' && (
            <TimelineView
              projects={filteredProjects}
              onSelect={setSelectedProject}
            />
          )}

          <footer className="footer">
            <span>
              <span className="live-dot" /> Local SQLite DB Active
            </span>
            <span>
              {tasks.filter((t) => t.status === 'done').length} of {tasks.length} tasks complete
            </span>
          </footer>
        </section>
      </div>

      {currentSelectedProject && (
        <DetailPanel
          project={currentSelectedProject}
          tasks={tasks}
          onClose={() => {
            setSelectedProject(null)
            setActiveFilter(null)
          }}
          onUpdateProject={updateSubproject}
          onCreateTask={createTask}
          onToggleTask={toggleTaskStatus}
          onDeleteTask={deleteTask}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          current={settings}
          onClose={() => setShowSettingsModal(false)}
          onSave={(title, desc) => {
            saveSettings(title, desc)
            setShowSettingsModal(false)
          }}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          onCreate={(data) => {
            createSubproject(data)
            setShowProjectModal(false)
          }}
        />
      )}
    </main>
  )
}
