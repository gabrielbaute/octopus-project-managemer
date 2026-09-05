import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const { user, token } = await loginUser(email, password)

    const response = NextResponse.json({ user })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
