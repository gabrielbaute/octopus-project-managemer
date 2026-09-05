import { getUserByEmail, createUser } from './users'
import { hashPassword, verifyPassword, createToken } from '@/lib/auth'
import { User } from '../types'

export interface AuthResult {
  user: Omit<User, 'passwordHash'>
  token: string
}

/**
 * Registra un nuevo usuario, genera el hash de su contraseña e inicia su workspace predeterminado.
 *
 * @param {string} email - Correo electrónico.
 * @param {string} password - Contraseña en texto plano.
 * @param {string} name - Nombre completo o alias.
 * @returns {Promise<AuthResult>} Datos del usuario registrado y token generado.
 * @throws {Error} Si el correo electrónico ya se encuentra registrado.
 */
export async function registerUser(email: string, password: string, name: string): Promise<AuthResult> {
  const existingUser = getUserByEmail(email)
  if (existingUser) {
    throw new Error('El correo electrónico ya está registrado.')
  }

  const passwordHash = await hashPassword(password)
  const result = createUser({ email, passwordHash, name })
  const userId = Number(result.lastInsertRowid)

  const token = await createToken({ userId, email })

  return {
    user: { id: userId, email, name },
    token
  }
}

/**
 * Autentica un usuario verificando sus credenciales y emite su token JWT.
 *
 * @param {string} email - Correo electrónico.
 * @param {string} password - Contraseña ingresada.
 * @returns {Promise<AuthResult>} Datos del usuario y token.
 * @throws {Error} Si las credenciales son incorrectas.
 */
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const user = getUserByEmail(email)
  if (!user) {
    throw new Error('Credenciales inválidas.')
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    throw new Error('Credenciales inválidas.')
  }

  const token = await createToken({ userId: user.id, email: user.email })

  return {
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    token
  }
}
