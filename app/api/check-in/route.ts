import { NextResponse } from 'next/server'

const CHURCH_LAT = Number(process.env.CHURCH_LAT || '6.5667')
const CHURCH_LNG = Number(process.env.CHURCH_LNG || '3.2667')
const RADIUS = Number(process.env.CHURCH_RADIUS_METERS || '150')

type Member = { name: string; pin: string; part: string }
const members: Member[] = [
  { name:'John Ade', pin:'4821', part:'Soprano' }, { name:'Mary James', pin:'3157', part:'Alto' },
  { name:'Peter Cole', pin:'6248', part:'Tenor' }, { name:'Grace David', pin:'7314', part:'Soprano' },
  { name:'Daniel Okoro', pin:'9052', part:'Tenor' }, { name:'Esther Michael', pin:'2468', part:'Alto' },
  { name:'Samuel Joseph', pin:'5173', part:'Tenor' }, { name:'Ruth Emeka', pin:'8391', part:'Alto' },
  { name:'David Paul', pin:'1542', part:'Soprano' }, { name:'Joy Samuel', pin:'6835', part:'Alto' },
  { name:'Michael Peter', pin:'4207', part:'Tenor' }, { name:'Deborah John', pin:'7964', part:'Soprano' },
]

function distance(a:number,b:number,c:number,d:number) {
  const r=6371000,p=Math.PI/180,x=(c-a)*p,y=(d-b)*p
  const q=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2
  return 2*r*Math.asin(Math.sqrt(q))
}

function lagosNow() {
  const parts = new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Lagos',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date())
  const get=(type:string)=>parts.find(p=>p.type===type)?.value || ''
  return { day:get('weekday'), minutes:Number(get('hour'))*60+Number(get('minute')) }
}

export async function POST(req:Request) {
  try {
    const {name,pin,lat,lng}=await req.json()
    const cleanName=typeof name==='string' ? name.trim().replace(/\s+/g,' ') : ''
    if(!cleanName || typeof pin!=='string' || !/^\d{4}$/.test(pin)) return NextResponse.json({error:'Enter your registered name and 4-digit PIN.'},{status:400})
    const member=members.find(m=>m.name.toLowerCase()===cleanName.toLowerCase() && m.pin===pin)
    if(!member) return NextResponse.json({error:'Name or PIN is incorrect. Use your registered details.'},{status:401})
    const now=lagosNow()
    if(now.day!=='Sat') return NextResponse.json({error:'Attendance is available on Saturdays only.'},{status:403})
    if(now.minutes<15*60 || now.minutes>16*60+30) return NextResponse.json({error:'Check-in is open from 3:00 PM to 4:30 PM.'},{status:403})
    if(typeof lat!=='number'||typeof lng!=='number'||!Number.isFinite(lat)||!Number.isFinite(lng)) return NextResponse.json({error:'A valid location is required.'},{status:400})
    if(distance(CHURCH_LAT,CHURCH_LNG,lat,lng)>RADIUS) return NextResponse.json({error:'You must be at the church venue to check in.'},{status:403})
    return NextResponse.json({ok:true,message:'Attendance recorded',member:{name:member.name,part:member.part},checkedInAt:new Date().toISOString()})
  } catch { return NextResponse.json({error:'Unable to process check-in.'},{status:500}) }
}
