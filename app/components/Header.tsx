// app/components/Header.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface UserState {
  name: string
  email: string
}

/**
 * Encabezado de la aplicación alineado con las variables semánticas de Tailwind/Shadcn.
 */
export default function Header() {
  const [user, setUser] = useState<UserState | null>(null)
  const router = useRouter()

  useEffect(() => {
    /* Obtiene la sesión actual del usuario desde la API */
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data)
      })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    /* Encabezado con soporte semántico usando las clases nativas del sistema de diseño (bg-background, border-border) */
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">

      {/* Sección Izquierda: Identificador de la aplicación */}
      <div className="flex items-center space-x-3">
        {/* Contenedor del ícono renderizado desde la carpeta public */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 overflow-hidden">
          <Image
            src="/icon.svg"
            alt="Octopus PM Logo"
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
            priority
          />
        </div>
        <h1 className="text-lg font-bold text-foreground tracking-tight">Octopus PM</h1>
      </div>

      {/* Sección Derecha: Datos del usuario activo y control de sesión */}
      {user && (
        <div className="flex items-center space-x-4">
          {/* Información del usuario usando variables de texto secundario */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          {/* Botón de cierre de sesión adaptado a la estética destructiva/alerta */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-medium text-destructive-foreground bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 rounded-lg transition-colors focus:outline-none"
          >
            Cerrar Sesión
          </button>
        </div>
      )}

    </header>
  )
}
