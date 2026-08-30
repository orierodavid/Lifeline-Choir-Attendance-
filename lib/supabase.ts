const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkxvcphlrvaheccjraxm.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_vPtLpKakT9q8nVswLZ294Q_2PNLc11Q'
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function supabaseFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  const isAdminServerRequest = path.startsWith('admin_settings') && Boolean(SUPABASE_SECRET)
  const key = isAdminServerRequest ? SUPABASE_SECRET : SUPABASE_KEY
  headers.set('apikey', key)
  headers.set('Authorization', `Bearer ${key}`)
  headers.set('Content-Type', 'application/json')
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers, cache: 'no-store' })
}