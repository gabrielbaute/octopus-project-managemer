import { db } from '../connection'
import { ProjectSettings } from '../types'

/**
 * Obtiene la configuración del proyecto workspace asociada a un usuario.
 * Si no existe un registro previo, crea uno por defecto para ese usuario.
 *
 * @param {number} userId - Identificador del usuario.
 * @returns {ProjectSettings} Configuración del proyecto del usuario.
 */
export function getSettings(userId: number): ProjectSettings {
  const stmt = db.prepare('SELECT id, userId, title, description FROM project_settings WHERE userId = ?')
  const row = stmt.get(userId) as ProjectSettings | undefined

  if (!row) {
    const defaultSettings = {
      userId,
      title: 'SamanWriter',
      description: 'Software de escritura y gestión de subproyectos.'
    }
    const insertStmt = db.prepare('INSERT INTO project_settings (userId, title, description) VALUES (?, ?, ?)')
    const result = insertStmt.run(defaultSettings.userId, defaultSettings.title, defaultSettings.description)

    return {
      id: Number(result.lastInsertRowid),
      ...defaultSettings
    }
  }

  return row
}

/**
 * Actualiza la configuración del proyecto workspace de un usuario.
 *
 * @param {number} userId - Identificador del usuario propietario.
 * @param {string} title - Nuevo título del proyecto.
 * @param {string} description - Nueva descripción del proyecto.
 * @returns {ProjectSettings} Configuración actualizada.
 */
export function updateSettings(userId: number, title: string, description: string): ProjectSettings {
  const stmt = db.prepare(`
    INSERT INTO project_settings (userId, title, description)
    VALUES (?, ?, ?)
    ON CONFLICT(userId) DO UPDATE SET
      title = excluded.title,
      description = excluded.description
  `)
  stmt.run(userId, title, description)

  return { userId, title, description }
}
