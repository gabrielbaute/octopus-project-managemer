import { NextResponse } from 'next/server'
import { getUserById } from '@/lib/db'
import { getSession } from '@/lib/getSession'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const user = getUserById(session.userId)
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  return NextResponse.json(user)
}
