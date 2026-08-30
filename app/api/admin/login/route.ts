import { NextResponse } from 'next/server'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkxvcphlrvaheccjraxm.supabase.co'
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const ADMIN = (process.env.ADMIN_EMAIL || 'orierodavid@gmail.com').toLowerCase()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (String(email || '').trim().toLowerCase() !== ADMIN || typeof password !== 'string' || !password) return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 })
    if (!KEY) return NextResponse.json({ error: 'Supabase authentication is not configured.' }, { status: 500 })
    const r = await fetch(`${URL}/auth/v1/token?grant_type=password`, { method:'POST', headers:{ apikey:KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ email:ADMIN, password }), cache:'no-store' })
    const d = await r.json()
    if (!r.ok || !d.access_token) return NextResponse.json({ error:'Invalid admin credentials.' }, { status:401 })
    const res = NextResponse.json({ ok:true })
    res.cookies.set('lifeline_admin_token', d.access_token, { httpOnly:true, secure:true, sameSite:'lax', path:'/', maxAge:Math.max(Number(d.expires_in)||3600,3600) })
    return res
  } catch { return NextResponse.json({error:'Unable to sign in.'},{status:500}) }
}
