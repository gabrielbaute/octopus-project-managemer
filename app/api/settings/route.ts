import { NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/db'
import { getSession } from '@/lib/getSession'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const settings = getSettings(session.userId)
  return NextResponse.json(settings)
}

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { title, description } = await request.json()
  if (!title || !description) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
  }

  const updated = updateSettings(session.userId, title, description)
  return NextResponse.json(updated)
}
