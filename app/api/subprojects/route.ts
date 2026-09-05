import { NextResponse } from 'next/server'
import { getSubprojects, createSubproject, updateSubproject, deleteSubproject } from '@/lib/db'
import { getSession } from '@/lib/getSession'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  return NextResponse.json(getSubprojects(session.userId))
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const result = createSubproject({ ...body, userId: session.userId })
  return NextResponse.json({ id: Number(result.lastInsertRowid) })
}

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  updateSubproject(Number(body.id), session.userId, body)
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (id) {
    deleteSubproject(Number(id), session.userId)
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
}
