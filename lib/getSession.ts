import { cookies } from 'next/headers'
import { verifyToken, JWTPayload } from '@/lib/auth'

/**
 * Obtiene el payload del usuario autenticado leyendo la cookie HTTP-Only de la petición.
 *
 * @returns {Promise<JWTPayload | null>} Datos de sesión o null si no está autenticado.
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return null
  }

  return await verifyToken(token)
}
