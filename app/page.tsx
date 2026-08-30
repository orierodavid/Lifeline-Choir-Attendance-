'use client'

import { useState } from 'react'

export default function Home(){
 const [name,setName]=useState(''); const [pin,setPin]=useState(''); const [status,setStatus]=useState(''); const [done,setDone]=useState(false); const [loading,setLoading]=useState(false); const [locationStatus,setLocationStatus]=useState('Location will be verified when you check in.')
 async function checkIn(){
  setLoading(true);setStatus('');setLocationStatus('Requesting your location...')
  try{
   if(!navigator.geolocation) throw new Error('Location services are not supported on this device.')
   const position=await new Promise<GeolocationPosition>((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:12000,maximumAge:30000}))
   setLocationStatus('Location received. Verifying attendance area...')
   const r=await fetch('/api/check-in',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,pin,lat:position.coords.latitude,lng:position.coords.longitude,accuracy:position.coords.accuracy})})
   const d=await r.json(); if(!r.ok) throw new Error(d.error||'Check-in failed')
   setLocationStatus('Location verified.');setName(d.member?.name||name.trim());setDone(true)
  }catch(e){const message=e instanceof GeolocationPositionError?'Please allow location access and try again.':e instanceof Error?e.message:'Unable to check in';setStatus(message);setLocationStatus('Location not verified.')}
  finally{setLoading(false)}
 }
 if(done)return <main className="shell"><section className="card success"><div className="brand">CALVARY BIBLE CHURCH</div><div className="logo-mark" aria-hidden="true">✦</div><div className="system-name">Lifeline Choir Attendance System</div><div className="check">✓</div><h1 className="title">You&apos;re marked present</h1><p className="sub">{name} · Your attendance has been recorded.</p></section></main>
 return <main className="shell"><section className="card"><div className="logo-mark" aria-hidden="true">✦</div><div className="brand">CALVARY BIBLE CHURCH</div><div className="system-name">Lifeline Choir Attendance System</div><div className="rule"/><h1 className="title">Choir Check-in</h1><p className="sub">Enter your first name or last name and PIN to record your attendance.</p><div className="field"><label className="label">First or Last Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" autoComplete="name" disabled={loading}/></div><div className="field"><label className="label">4-Digit PIN</label><input className="input pin" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,4))} inputMode="numeric" maxLength={4} placeholder="••••" disabled={loading}/></div><div className="location"><span className="dot"/> {locationStatus}</div>{status&&<p className="muted" role="alert" style={{marginBottom:16}}>{status}</p>}<button className="primary" disabled={loading||name.trim()===''||pin.length!==4} onClick={checkIn}>{loading?'VERIFYING...':'CHECK IN'}</button><p className="footer-note">Attendance is available within the church premises.</p></section></main>
}
