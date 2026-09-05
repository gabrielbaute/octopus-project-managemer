import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

/**
 * Asegura la existencia de la carpeta data/ y crea la instancia de la base de datos.
 */
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'local.db')
export const db = new Database(dbPath)

// Configuración de PRAGMAs de rendimiento
db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')
db.pragma('foreign_keys = ON')
