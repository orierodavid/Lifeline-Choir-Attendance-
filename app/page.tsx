'use client'

import { useState } from 'react'

export default function Home(){
 const [name,setName]=useState(''); const [pin,setPin]=useState(''); const [status,setStatus]=useState(''); const [done,setDone]=useState(false); const [loading,setLoading]=useState(false); const [locationStatus,setLocationStatus]=useState('Location access is required to check in.')
 async function requestLocation(){
  if(!window.isSecureContext){setStatus('Location access requires a secure HTTPS connection. Please open the official Vercel HTTPS address.');return}
  if(!navigator.geolocation){setStatus('This browser does not support location services. Please enable Location Services or try another browser.');return}
  setLoading(true);setStatus('');setLocationStatus('Requesting location permission…')
  try{
   const position=await new Promise<GeolocationPosition>((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:20000,maximumAge:0}))
   setLocationStatus(`Location ready · ±${Math.round(position.coords.accuracy)}m accuracy`)
   return position
  }catch(e:any){
   const code=e?.code
   if(code===1){setStatus('Location permission was denied. In your browser site settings, allow Location for this website, then tap CHECK IN again.');setLocationStatus('Location permission denied.')}
   else if(code===2){setStatus('Your device could not determine its location. Turn on Location Services and try again.');setLocationStatus('Location unavailable.')}
   else if(code===3){setStatus('Location request timed out. Make sure Location Services are on and try again.');setLocationStatus('Location request timed out.')}
   else{setStatus(e?.message||'Unable to access your location.');setLocationStatus('Location not verified.')}
   return null
  }finally{setLoading(false)}
 }
 async function checkIn(){
  setStatus('');
  const position=await requestLocation(); if(!position)return
  setLoading(true)
  try{
   const r=await fetch('/api/check-in',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,pin,lat:position.coords.latitude,lng:position.coords.longitude,accuracy:position.coords.accuracy})})
   const d=await r.json(); if(!r.ok) throw new Error(d.error||'Check-in failed')
   setLocationStatus('Location verified.');setName(d.member?.name||name.trim());setDone(true)
  }catch(e:any){setStatus(e?.message||'Unable to complete check-in.');setLocationStatus('Location verified, but check-in failed.')}
  finally{setLoading(false)}
 }
 if(done)return <main className="shell"><section className="card success"><div className="logo-mark" aria-hidden="true">✦</div><div className="brand">CALVARY BIBLE CHURCH</div><div className="system-name">Lifeline Choir Attendance System</div><div className="check">✓</div><h1 className="title">You&apos;re marked present</h1><p className="sub">{name} · Your attendance has been recorded.</p></section></main>
 return <main className="shell"><section className="card"><div className="logo-mark" aria-hidden="true">✦</div><div className="brand">CALVARY BIBLE CHURCH</div><div className="system-name">Lifeline Choir Attendance System</div><div className="rule"/><h1 className="title">Choir Check-in</h1><p className="sub">Enter your first name or last name and PIN. Your browser will then ask for permission to use your location.</p><div className="field"><label className="label">First or Last Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" autoComplete="name" disabled={loading}/></div><div className="field"><label className="label">4-Digit PIN</label><input className="input pin" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,4))} inputMode="numeric" maxLength={4} placeholder="••••" disabled={loading}/></div><div className="location"><span className="dot"/> {locationStatus}</div>{status&&<p className="muted" role="alert" style={{marginBottom:16}}>{status}</p>}<button className="primary" disabled={loading||name.trim()===''||pin.length!==4} onClick={checkIn}>{loading?'REQUESTING LOCATION…':'CHECK IN'}</button><p className="footer-note">Location is checked within 300m of Calvary Bible Church.</p></section></main>
}
