'use client'

import { useEffect, useState } from 'react'
import { Check, Clock3, LockKeyhole, Save, ShieldCheck, X } from 'lucide-react'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
type Settings = { start_time:string; end_time:string; attendance_days:string[]; _password?:string; _confirm?:string }

export default function SettingsPage(){
  const [settings,setSettings] = useState<Settings>({start_time:'15:00',end_time:'16:30',attendance_days:DAYS})
  const [isSuper,setIsSuper] = useState(false)
  const [loading,setLoading] = useState(true)
  const [saving,setSaving] = useState(false)
  const [message,setMessage] = useState('')
  const [error,setError] = useState('')

  useEffect(()=>{
    ;(async()=>{
      try{
        const r=await fetch('/api/admin/settings',{credentials:'include',cache:'no-store'})
        const d=await r.json()
        if(!r.ok) throw new Error(d.error||'Unable to load settings')
        setSettings(s=>({...s,...d,attendance_days:d.attendance_days?.length?d.attendance_days:DAYS}))
        setIsSuper(d.is_super_admin===true)
      }catch(e:any){setError(e.message)}finally{setLoading(false)}
    })()
  },[])

  async function save(){
    setError('');setMessage('');setSaving(true)
    try{
      const payload=isSuper?{start_time:settings.start_time,end_time:settings.end_time,attendance_days:settings.attendance_days}:{start_time:settings.start_time,end_time:settings.end_time}
      const r=await fetch('/api/admin/settings',{method:'PATCH',headers:{'content-type':'application/json'},credentials:'include',body:JSON.stringify(payload)})
      const d=await r.json()
      if(!r.ok) throw new Error(d.error||'Unable to save settings')
      setMessage('Settings saved successfully.')
    }catch(e:any){setError(e.message)}finally{setSaving(false)}
  }

  async function updatePassword(){
    setError('');setMessage('')
    try{
      const r=await fetch('/api/admin/password',{method:'PATCH',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({password:settings._password,confirm:settings._confirm})})
      const d=await r.json()
      if(!r.ok) throw new Error(d.error||'Unable to update password')
      setSettings(s=>({...s,_password:'',_confirm:''}))
      setMessage('Administrator password updated')
    }catch(e:any){setError(e.message)}
  }

  if(loading) return <main className="saas-settings"><div className="settings-loading">Loading workspace settings…</div></main>

  if(isSuper) return (
    <main className="saas-settings">
      <section className="settings-main" style={{marginLeft:0,width:'100%'}}>
        <div className="settings-body">
          {(message||error) && <div className={error?'settings-alert':'settings-toast'}>{error?<X size={15}/>:<Check size={15}/>}<span>{error||message}</span><button onClick={()=>{setError('');setMessage('')}}>Dismiss</button></div>}
          <div className="settings-heading">
            <div><div className="crumb">ADMIN ACCOUNT <span>/</span> MY SETTINGS</div><h1>My Admin Settings</h1><p>Manage your administrator account and password.</p></div>
            <div className="system-pill"><i/> Account protected</div>
          </div>
          <section className="settings-hero">
            <div className="hero-icon"><ShieldCheck size={22}/></div>
            <div><span>MY ADMIN SETTINGS</span><h2>Manage your administrator access</h2><p>Only your administrator password can be changed from this account.</p></div>
            <div className="hero-metric"><b>SUPER</b><small>ACCESS LEVEL</small></div>
          </section>
          <div className="settings-layout">
            <nav className="settings-nav">
              <div className="nav-title">MY SETTINGS</div>
              <a className="active" href="#security"><LockKeyhole size={16}/> Security <span>›</span></a>
              <div className="nav-note"><ShieldCheck size={15}/><b>Secure workspace</b><span>Administrator credentials remain protected.</span></div>
            </nav>
            <div className="settings-stack">
              <section id="security" className="setting-card">
                <div className="card-head"><div className="setting-symbol purple"><LockKeyhole size={19}/></div><div><div className="card-kicker">SECURITY</div><h3>Administrator password</h3><p>Change your administrator password without exposing it.</p></div><span className="state secure">PROTECTED</span></div>
                <div className="field-grid">
                  <label><span>NEW PASSWORD</span><input id="super-password" type="password" value={settings._password||''} onChange={e=>setSettings({...settings,_password:e.target.value})} placeholder="Minimum 8 characters"/></label>
                  <label><span>CONFIRM PASSWORD</span><input id="super-confirm" type="password" value={settings._confirm||''} onChange={e=>setSettings({...settings,_confirm:e.target.value})} placeholder="Repeat password"/></label>
                </div>
                <div className="card-foot"><span><LockKeyhole size={13}/> Current password is never displayed.</span><button className="ghost" onClick={updatePassword}>Update password</button></div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  )

  return (
    <main className="saas-settings">
      <aside className="settings-rail"><div className="rail-brand"><div className="rail-logo">CB</div><div><b>CALVARY</b><span>Lifeline Choir</span></div></div><div className="rail-caption">ADMIN CONSOLE</div><a href="/admin">Dashboard</a><a href="/admin">Members</a><a href="/admin">Reports</a><a className="active" href="/admin/settings">Settings</a><div className="rail-footer"><span>Workspace</span><b>Operational</b><i/></div></aside>
      <section className="settings-main">
        <header className="settings-top"><div className="settings-search">⌕ <span>Search settings</span></div><div className="top-user"><div className="user-avatar">AD</div><div><b>Administrator</b><span>Calvary Bible Church</span></div></div></header>
        <div className="settings-body">
          {(message||error) && <div className={error?'settings-alert':'settings-toast'}>{error?<X size={15}/>:<Check size={15}/>}<span>{error||message}</span><button onClick={()=>{setError('');setMessage('')}}>Dismiss</button></div>}
          <div className="settings-heading"><div><div className="crumb">CONTROL CENTER <span>/</span> SETTINGS</div><h1>Settings</h1><p>Update your attendance time and administrator password.</p></div><div className="system-pill"><i/> All systems operational</div></div>
          <section className="settings-hero"><div className="hero-icon"><ShieldCheck size={22}/></div><div><span>ADMIN SETTINGS</span><h2>Manage your administrator access</h2><p>Only attendance time and your administrator password can be changed from this account.</p></div><div className="hero-metric"><b>ADMIN</b><small>ACCESS LEVEL</small></div></section>
          <div className="settings-layout">
            <nav className="settings-nav"><div className="nav-title">SETTINGS</div><a className="active" href="#attendance"><Clock3 size={16}/> Attendance <span>›</span></a><a href="#security"><LockKeyhole size={16}/> Security <span>›</span></a><div className="nav-note"><ShieldCheck size={15}/><b>Secure workspace</b><span>PINs remain private from administrators.</span></div></nav>
            <div className="settings-stack">
              <section id="attendance" className="setting-card featured"><div className="card-head"><div className="setting-symbol orange"><Clock3 size={19}/></div><div><div className="card-kicker">ATTENDANCE</div><h3>Attendance timeframe</h3><p>Set when members are permitted to check in for service.</p></div><span className="state active">ACTIVE</span></div><div className="time-row"><label><span>START TIME</span><div><Clock3 size={16}/><input type="time" value={settings.start_time||''} onChange={e=>setSettings({...settings,start_time:e.target.value})}/></div></label><div className="time-separator">TO</div><label><span>END TIME</span><div><Clock3 size={16}/><input type="time" value={settings.end_time||''} onChange={e=>setSettings({...settings,end_time:e.target.value})}/></div></label><button className="save" onClick={save} disabled={saving}><Save size={14}/>{saving?'Saving…':'Save changes'}</button></div><div className="card-foot"><span><i/> Members can check in only inside this window.</span><b>{settings.start_time} — {settings.end_time}</b></div></section>
              <section id="security" className="setting-card"><div className="card-head"><div className="setting-symbol purple"><LockKeyhole size={19}/></div><div><div className="card-kicker">SECURITY</div><h3>Administrator password</h3><p>Change your administrator password without exposing it.</p></div><span className="state secure">PROTECTED</span></div><div className="field-grid"><label><span>NEW PASSWORD</span><input type="password" value={settings._password||''} onChange={e=>setSettings({...settings,_password:e.target.value})} placeholder="Minimum 8 characters"/></label><label><span>CONFIRM PASSWORD</span><input type="password" value={settings._confirm||''} onChange={e=>setSettings({...settings,_confirm:e.target.value})} placeholder="Repeat password"/></label></div><div className="card-foot"><span><LockKeyhole size={13}/> Current password is never displayed.</span><button className="ghost" onClick={updatePassword}>Update password</button></div></section>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
