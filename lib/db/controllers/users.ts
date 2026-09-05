import { db } from '../connection'
import { User } from '../types'
import Database from 'better-sqlite3'

/**
 * Obtiene un usuario por su dirección de correo electrónico.
 *
 * @param {string} email - Correo electrónico del usuario.
 * @returns {User | undefined} Registro del usuario o undefined si no existe.
 */
export function getUserByEmail(email: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
  return stmt.get(email) as User | undefined
}

/**
 * Obtiene un usuario por su ID único.
 *
 * @param {number} id - Identificador del usuario.
 * @returns {Omit<User, 'passwordHash'> | undefined} Datos públicos del usuario.
 */
export function getUserById(id: number): Omit<User, 'passwordHash'> | undefined {
  const stmt = db.prepare('SELECT id, email, name, createdAt FROM users WHERE id = ?')
  return stmt.get(id) as Omit<User, 'passwordHash'> | undefined
}

/**
 * Registra un nuevo usuario en el sistema.
 *
 * @param {Omit<User, 'id'>} user - Datos del usuario a registrar.
 * @returns {Database.RunResult} Resultado de la inserción.
 */
export function createUser(user: Omit<User, 'id'>): Database.RunResult {
  const stmt = db.prepare('INSERT INTO users (email, passwordHash, name) VALUES (?, ?, ?)')
  return stmt.run(user.email, user.passwordHash, user.name)
}
