// proxy.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'

/**
 * Proxy para validar la presencia de la cookie de autenticación.
 * Redirige usuarios no autenticados a /login y autenticados fuera de /login.
 *
 * @param {NextRequest} request - Objeto de petición de Next.js.
 * @returns {NextResponse} Respuesta HTTP de redirección o continuación.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'

  // Redirigir a login si intenta ingresar al dashboard sin token
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirigir al dashboard si ya inició sesión e intenta ir a /login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
