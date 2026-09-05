import { db } from './connection'

/**
 * Inicializa las tablas del esquema, relaciones multiusuario e índices.
 *
 * @returns {void}
 */
export function initSchema(): void {
  db.exec(`
    -- Tabla de Usuarios
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Configuración por Usuario
    CREATE TABLE IF NOT EXISTS project_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Subproyectos asociados a Usuario
    CREATE TABLE IF NOT EXISTS subprojects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      status TEXT CHECK(status IN ('backlog', 'writing', 'review', 'done')) NOT NULL DEFAULT 'backlog',
      color TEXT DEFAULT 'sage',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Tareas asociadas a Subproyecto
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subprojectId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
      status TEXT CHECK(status IN ('backlog', 'writing', 'review', 'done')) DEFAULT 'backlog',
      dueDate TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subprojectId) REFERENCES subprojects(id) ON DELETE CASCADE
    );

    -- Índices de optimización de rendimiento y búsqueda multiusuario
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_subprojects_user_id ON subprojects(userId);
    CREATE INDEX IF NOT EXISTS idx_tasks_subproject_id ON tasks(subprojectId);
    CREATE INDEX IF NOT EXISTS idx_tasks_subproject_status ON tasks(subprojectId, status);
  `)
}
