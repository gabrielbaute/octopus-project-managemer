import { db } from '../connection'
import { Task } from '../types'
import Database from 'better-sqlite3'

/**
 * Verifica la propiedad de un subproyecto para asegurar aislamiento multitenant.
 *
 * @param {number} subprojectId - ID del subproyecto a verificar.
 * @param {number} userId - ID del usuario.
 * @returns {boolean} True si el subproyecto pertenece al usuario.
 */
function isSubprojectOwnedByUser(subprojectId: number, userId: number): boolean {
  const stmt = db.prepare('SELECT id FROM subprojects WHERE id = ? AND userId = ?')
  return Boolean(stmt.get(subprojectId, userId))
}

/**
 * Obtiene las tareas filtradas por usuario y opcionalmente por subproyecto.
 *
 * @param {number} userId - Identificador del usuario autenticado.
 * @param {number} [subprojectId] - Filtro de subproyecto opcional.
 * @returns {Task[]} Lista de tareas pertenecientes al usuario.
 */
export function getTasks(userId: number, subprojectId?: number): Task[] {
  if (subprojectId) {
    const query = `
      SELECT t.*
      FROM tasks t
      INNER JOIN subprojects s ON t.subprojectId = s.id
      WHERE t.subprojectId = ? AND s.userId = ?
      ORDER BY t.id DESC
    `
    return db.prepare(query).all(subprojectId, userId) as Task[]
  }

  const query = `
    SELECT t.*
    FROM tasks t
    INNER JOIN subprojects s ON t.subprojectId = s.id
    WHERE s.userId = ?
    ORDER BY t.id DESC
  `
  return db.prepare(query).all(userId) as Task[]
}

/**
 * Registra una nueva tarea asegurando que el subproyecto pertenezca al usuario.
 *
 * @param {number} userId - ID del usuario creador.
 * @param {Omit<Task, 'id'>} task - Datos de la tarea a crear.
 * @returns {Database.RunResult} Resultado de la inserción.
 * @throws {Error} Si el subproyecto no pertenece al usuario.
 */
export function createTask(userId: number, task: Omit<Task, 'id'>): Database.RunResult {
  if (!isSubprojectOwnedByUser(task.subprojectId, userId)) {
    throw new Error('Acceso no autorizado al subproyecto especificado.')
  }

  const stmt = db.prepare(
    'INSERT INTO tasks (subprojectId, title, description, priority, status, dueDate) VALUES (?, ?, ?, ?, ?, ?)'
  )
  return stmt.run(task.subprojectId, task.title, task.description, task.priority, task.status, task.dueDate)
}

/**
 * Inserta un lote de tareas dentro de una transacción garantizando la pertenencia del subproyecto.
 *
 * @param {number} userId - ID del usuario propietario.
 * @param {Omit<Task, 'id'>[]} tasksList - Lista de tareas a insertar.
 * @returns {void}
 * @throws {Error} Si alguna tarea pertenece a un subproyecto no autorizado.
 */
export const createTasksBulk = db.transaction((userId: number, tasksList: Omit<Task, 'id'>[]) => {
  const stmt = db.prepare(
    'INSERT INTO tasks (subprojectId, title, description, priority, status, dueDate) VALUES (?, ?, ?, ?, ?, ?)'
  )

  for (const task of tasksList) {
    if (!isSubprojectOwnedByUser(task.subprojectId, userId)) {
      throw new Error(`Acceso no autorizado al subproyecto ID: ${task.subprojectId}`)
    }
    stmt.run(task.subprojectId, task.title, task.description, task.priority, task.status, task.dueDate)
  }
})

/**
 * Actualiza una tarea existente validando la propiedad del usuario mediante JOIN.
 *
 * @param {number} id - Identificador de la tarea.
 * @param {number} userId - ID del usuario.
 * @param {Partial<Task>} fields - Campos parciales a actualizar.
 * @returns {Database.RunResult | undefined} Resultado de la actualización o undefined si no hay cambios.
 */
export function updateTask(id: number, userId: number, fields: Partial<Task>): Database.RunResult | undefined {
  const keys = Object.keys(fields).filter((k) => k !== 'id' && k !== 'subprojectId')
  if (keys.length === 0) return

  const setClause = keys.map((k) => `t.${k} = ?`).join(', ')
  const values = keys.map((k) => (fields as Record<string, unknown>)[k])

  const query = `
    UPDATE tasks
    SET ${setClause}
    WHERE id = ? AND subprojectId IN (SELECT id FROM subprojects WHERE userId = ?)
  `

  const stmt = db.prepare(query)
  return stmt.run(...values, id, userId)
}

/**
 * Elimina una tarea validando que pertenezca a un subproyecto del usuario.
 *
 * @param {number} id - ID de la tarea a eliminar.
 * @param {number} userId - ID del usuario.
 * @returns {Database.RunResult} Resultado del borrado.
 */
export function deleteTask(id: number, userId: number): Database.RunResult {
  const query = `
    DELETE FROM tasks
    WHERE id = ? AND subprojectId IN (SELECT id FROM subprojects WHERE userId = ?)
  `
  return db.prepare(query).run(id, userId)
}
