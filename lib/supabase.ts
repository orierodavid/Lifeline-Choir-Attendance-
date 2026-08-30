const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xfavyaytmevprehrawwf.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_f23eAfGzVz-ec6O_50C0qw_5FRKdn9q'

export async function supabaseFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('apikey', SUPABASE_KEY)
  headers.set('Authorization', `Bearer ${SUPABASE_KEY}`)
  headers.set('Content-Type', 'application/json')
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers, cache: 'no-store' })
}
