// app/components/AuthForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Formulario interactivo para inicio de sesión y registro de usuarios.
 */
export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
    const body = isRegister ? { email, password, name } : { email, password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error inesperado')
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Tarjeta principal con cristalismo (backdrop-blur) y bordes sutiles */
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-emerald-950/20 space-y-6">

      {/* Cabecera: Marca y Título */}
      <div className="text-center space-y-2">
        {/* Isotipo / Logotipo visual */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {isRegister ? 'Crear una cuenta' : 'Iniciar Sesión'}
        </h2>
        <p className="text-sm text-slate-400">
          {isRegister
            ? 'Ingresa tus datos para empezar a gestionar tus subproyectos'
            : 'Accede a tu panel principal de SamanWriter'}
        </p>
      </div>

      {/* Alerta de Error */}
      {error && (
        /* Bloque de notificación de errores de la API */
        <div className="p-3.5 text-sm text-rose-300 bg-rose-950/50 border border-rose-800/60 rounded-xl flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Formulario de entrada de datos */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Campo opcional: Nombre (Solo en Modo Registro) */}
        {isRegister && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              placeholder="Ej. Alexander Humboldt"
            />
          </div>
        )}

        {/* Campo: Correo Electrónico */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="usuario@ejemplo.com"
          />
        </div>

        {/* Campo: Contraseña */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="••••••••"
          />
        </div>

        {/* Botón de acción principal */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/10 mt-2"
        >
          {loading ? 'Procesando...' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Pie de tarjeta: Alternar modo Registro / Login */}
      <div className="pt-2 text-center border-t border-slate-800/60">
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister)
            setError('')
          }}
          className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none"
        >
          {isRegister
            ? '¿Ya tienes una cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate gratis'}
        </button>
      </div>

    </div>
  )
}
