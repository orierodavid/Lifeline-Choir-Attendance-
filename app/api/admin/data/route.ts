import { NextResponse } from 'next/server'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkxvcphlrvaheccjraxm.supabase.co'
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const ADMIN = (process.env.ADMIN_EMAIL || 'orierodavid@gmail.com').toLowerCase()

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(/(?:^|; )(?:lifeline_admin_token|admin_access_token)=([^;]+)/)
    if (!match) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const token = decodeURIComponent(match[1])
    const auth = await fetch(`${URL}/auth/v1/user`, { headers: { apikey: KEY, Authorization: `Bearer ${token}` }, cache: 'no-store' })
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await auth.json()
    if (String(user.email || '').toLowerCase() !== ADMIN) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    const headers = { apikey: KEY, Authorization: `Bearer ${token}` }
    const [mr, ar] = await Promise.all([
      fetch(`${URL}/rest/v1/choir_members?select=id,full_name,voice_part,active&order=full_name.asc`, { headers, cache: 'no-store' }),
      fetch(`${URL}/rest/v1/choir_attendance?select=id,member_id,attendance_date,checked_in_at,latitude,longitude,accuracy&order=checked_in_at.desc&limit=500`, { headers, cache: 'no-store' })
    ])
    if (!mr.ok || !ar.ok) return NextResponse.json({ error: 'Unable to load admin data' }, { status: 502 })
    const members = await mr.json(); const attendance = await ar.json()
    const names = new Map(members.map((m:any)=>[m.id,m.full_name]))
    return NextResponse.json({ members, attendance: attendance.map((a:any)=>({...a,member_name:names.get(a.member_id)||a.member_id})) })
  } catch { return NextResponse.json({ error: 'Unable to load admin data' }, { status: 500 }) }
}
