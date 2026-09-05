import { SignJWT, jwtVerify } from 'jose'
import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clave_secreta_por_defecto_cambiar_en_produccion'
)

export interface JWTPayload {
  userId: number
  email: string
}

/**
 * Genera un hash seguro para la contraseña del usuario utilizando scrypt y un salt aleatorio.
 *
 * @param {string} password - Contraseña en texto plano.
 * @returns {Promise<string>} Hash formateado como "salt:key".
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

/**
 * Compara una contraseña ingresada contra el hash almacenado utilizando comparación en tiempo constante.
 *
 * @param {string} password - Contraseña ingresada por el usuario.
 * @param {string} storedHash - Hash guardado en la base de datos (formato salt:key).
 * @returns {Promise<boolean>} True si la contraseña coincide.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, key] = storedHash.split(':')
  const keyBuffer = Buffer.from(key, 'hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  return timingSafeEqual(keyBuffer, derivedKey)
}

/**
 * Crea y firma un token JWT con la información del usuario mediante 'jose'.
 *
 * @param {JWTPayload} payload - Datos del usuario a incluir en el token.
 * @returns {Promise<string>} Token JWT firmado.
 */
export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

/**
 * Decodifica y verifica la validez de un token JWT.
 *
 * @param {string} token - Token JWT a verificar.
 * @returns {Promise<JWTPayload | null>} Payload extraído o null si es inválido.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}
