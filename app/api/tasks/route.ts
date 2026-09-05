import { NextResponse } from 'next/server'
import { createTask, getTasks, updateTask, deleteTask } from '@/lib/db'
import { getSession } from '@/lib/getSession'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const id = new URL(request.url).searchParams.get('subprojectId')
  const tasks = getTasks(session.userId, id ? Number(id) : undefined)
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = createTask(session.userId, body)
    return NextResponse.json({ id: Number(result.lastInsertRowid) })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  updateTask(Number(body.id), session.userId, body)
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
    deleteTask(Number(id), session.userId)
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
}
