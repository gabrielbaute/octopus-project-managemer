import { db } from '../connection'
import { Subproject } from '../types'
import Database from 'better-sqlite3'

/**
 * Obtiene los subproyectos pertenecientes a un usuario específico, calculando métricas de tareas vía LEFT JOIN.
 *
 * @param {number} userId - Identificador del usuario propietario.
 * @returns {Subproject[]} Lista completa de subproyectos con sus contadores de progreso.
 */
export function getSubprojects(userId: number): Subproject[] {
  const query = `
    SELECT
      s.id,
      s.userId,
      s.title,
      s.description,
      s.dueDate,
      s.status,
      s.color,
      COUNT(t.id) AS taskCount,
      SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) AS completedCount
    FROM subprojects s
    LEFT JOIN tasks t ON s.id = t.subprojectId
    WHERE s.userId = ?
    GROUP BY s.id
    ORDER BY s.id DESC
  `

  const rows = db.prepare(query).all(userId) as (Subproject & { taskCount: number; completedCount: number })[]

  return rows.map((sp) => {
    const taskCount = sp.taskCount || 0
    const completedCount = sp.completedCount || 0
    const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0

    return { ...sp, taskCount, completedCount, progress }
  })
}

/**
 * Registra un nuevo subproyecto asociado a la instancia/usuario.
 *
 * @param {Omit<Subproject, 'id'>} sp - Datos del subproyecto a registrar.
 * @returns {Database.RunResult} Resultado de la inserción en la base de datos.
 */
export function createSubproject(sp: Omit<Subproject, 'id'>): Database.RunResult {
  const stmt = db.prepare('INSERT INTO subprojects (userId, title, description, dueDate, status, color) VALUES (?, ?, ?, ?, ?, ?)')
  return stmt.run(sp.userId, sp.title, sp.description, sp.dueDate, sp.status, sp.color || 'sage')
}

/**
 * Actualiza los campos de un subproyecto garantizando la pertenencia al usuario.
 *
 * @param {number} id - Identificador del subproyecto a actualizar.
 * @param {number} userId - Identificador del usuario propietario para validar permisos.
 * @param {Partial<Subproject>} fields - Campos parciales a modificar.
 * @returns {Database.RunResult | undefined} Resultado de la actualización o undefined si no hay cambios.
 */
export function updateSubproject(id: number, userId: number, fields: Partial<Subproject>): Database.RunResult | undefined {
  const keys = Object.keys(fields).filter((k) => k !== 'id' && k !== 'userId')
  if (keys.length === 0) return

  const setClause = keys.map((k) => `${k} = ?`).join(', ')
  const values = keys.map((k) => (fields as Record<string, unknown>)[k])

  const stmt = db.prepare(`UPDATE subprojects SET ${setClause} WHERE id = ? AND userId = ?`)
  return stmt.run(...values, id, userId)
}

/**
 * Elimina un subproyecto garantizando la pertenencia al usuario.
 *
 * @param {number} id - ID del subproyecto a eliminar.
 * @param {number} userId - Identificador del usuario propietario para validar permisos.
 * @returns {Database.RunResult} Resultado de la eliminación.
 */
export function deleteSubproject(id: number, userId: number): Database.RunResult {
  const stmt = db.prepare('DELETE FROM subprojects WHERE id = ? AND userId = ?')
  return stmt.run(id, userId)
}
