import { initSchema } from './schema'

// Inicializa las tablas al importar el módulo
initSchema()

export * from './types'
export * from './connection'
export * from './controllers/users'
export * from './controllers/settings'
export * from './controllers/subprojects'
export * from './controllers/tasks'
export * from './controllers/auth'
