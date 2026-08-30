import { NextResponse } from 'next/server'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkxvcphlrvaheccjraxm.supabase.co'
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
const ADMIN = process.env.ADMIN_EMAIL || 'admin@example.com'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (String(email).toLowerCase() !== ADMIN.toLowerCase() || typeof password !== 'string' || !password) return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 })
    const r = await fetch(`${URL}/auth/v1/token?grant_type=password`, { method:'POST', headers:{ apikey: KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ email: ADMIN, password }) })
    const d = await r.json()
    if (!r.ok || !d.access_token) return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 })
    const res = NextResponse.json({ ok:true })
    res.cookies.set('lifeline_admin_token', d.access_token, { httpOnly:true, secure:true, sameSite:'lax', path:'/', maxAge: d.expires_in || 3600 })
    return res
  } catch { return NextResponse.json({ error:'Unable to sign in.' }, { status:500 }) }
}
