import { NextResponse } from 'next/server'
import { supabaseFetch } from '@/lib/supabase'

// Calvary Bible Church, Rehoboth Multi-Purpose Hall, Calvary Bus Stop,
// 257 Ikotun - Idimu Rd, Ikotun, Lagos 102213.
// Venue coordinates can be overridden with Vercel environment variables.
const CHURCH_LAT = Number(process.env.CHURCH_LAT || '6.5667')
const CHURCH_LNG = Number(process.env.CHURCH_LNG || '3.2667')
const RADIUS = Number(process.env.CHURCH_RADIUS_METERS || '150')

function distance(a:number,b:number,c:number,d:number) {
  const r=6371000,p=Math.PI/180,x=(c-a)*p,y=(d-b)*p
  const q=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2
  return 2*r*Math.asin(Math.sqrt(q))
}
function lagosNow() {
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Lagos',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date())
  const get=(type:string)=>parts.find(p=>p.type===type)?.value||''
  return {day:get('weekday'),minutes:Number(get('hour'))*60+Number(get('minute'))}
}
function lagosDate() { return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Lagos',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()) }

export async function POST(req:Request) {
  try {
    const {name,pin,lat,lng,accuracy}=await req.json()
    const cleanName=typeof name==='string'?name.trim().replace(/\s+/g,' '):''
    if(!cleanName||typeof pin!=='string'||!/^\d{4}$/.test(pin)) return NextResponse.json({error:'Enter your first or last name and 4-digit PIN.'},{status:400})

    // Match either first name OR last name, with the PIN identifying the member.
    const safe=encodeURIComponent(cleanName)
    const memberResponse=await supabaseFetch(`choir_members?select=id,full_name&active=eq.true&or=(first_name.ilike.${safe},last_name.ilike.${safe})&pin=eq.${encodeURIComponent(pin)}&limit=1`)
    if(!memberResponse.ok) return NextResponse.json({error:'Attendance service is temporarily unavailable.'},{status:503})
    const members=await memberResponse.json(); const member=members[0]
    if(!member) return NextResponse.json({error:'Name or PIN is incorrect. Please try again.'},{status:401})

    const now=lagosNow()
    if(now.day!=='Sat') return NextResponse.json({error:'Attendance is available on Saturdays only.'},{status:403})
    if(now.minutes<15*60||now.minutes>16*60+30) return NextResponse.json({error:'Check-in is open from 3:00 PM to 4:30 PM.'},{status:403})
    if(typeof lat!=='number'||typeof lng!=='number'||!Number.isFinite(lat)||!Number.isFinite(lng)) return NextResponse.json({error:'A valid location is required.'},{status:400})
    const metres=distance(CHURCH_LAT,CHURCH_LNG,lat,lng)
    if(metres>RADIUS) return NextResponse.json({error:'You must be at Calvary Bible Church — Rehoboth Multi-Purpose Hall to check in.'},{status:403})

    const attendanceDate=lagosDate()
    const existing=await supabaseFetch(`choir_attendance?select=id&member_id=eq.${member.id}&attendance_date=eq.${attendanceDate}&limit=1`)
    if(existing.ok&&(await existing.json()).length) return NextResponse.json({error:'You have already checked in for today.'},{status:409})
    const insert=await supabaseFetch('choir_attendance',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({member_id:member.id,attendance_date:attendanceDate,checked_in_at:new Date().toISOString(),latitude:lat,longitude:lng,accuracy:typeof accuracy==='number'?accuracy:null})})
    if(!insert.ok) return NextResponse.json({error:'Unable to record attendance. Please try again.'},{status:503})
    return NextResponse.json({ok:true,message:'Attendance recorded',member:{name:member.full_name},checkedInAt:new Date().toISOString()})
  } catch { return NextResponse.json({error:'Unable to process check-in.'},{status:500}) }
}
