'use client'

import { useEffect, useState } from 'react'

export default function Admin() {
  const [authorized, setAuthorized] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('Attendance')
  const [members, setMembers] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])

  const login = () => {
    if (password === 'admin123') setAuthorized(true)
  }

  useEffect(() => {
    if (!authorized) return
    fetch('/api/admin/data').then(r => r.ok ? r.json() : Promise.reject()).then(d => {
      setMembers(d.members || [])
      setAttendance(d.attendance || [])
    }).catch(() => {})
  }, [authorized])

  if (!authorized) return <main className="admin"><section className="panel" style={{maxWidth:480,margin:'12vh auto'}}><div className="brand">LIFELINE CHOIR</div><h1>Admin Login</h1><p className="muted">Authorized administrators only.</p><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Admin password" /><button className="primary" style={{marginTop:12}} onClick={login}>SIGN IN</button></section></main>

  const today = new Date().toISOString().slice(0,10)
  const present = attendance.filter(a => a.attendance_date === today).length

  return <main className="admin">
    <header className="adminbar"><div><div className="brand" style={{textAlign:'left'}}>LIFELINE CHOIR</div><h1 style={{margin:'6px 0'}}>Admin Dashboard</h1></div><a className="link" href="/">Member check-in →</a></header>
    <nav className="nav">{['Attendance','Members','PINs','Reports'].map(x => <button className={tab===x?'active':''} onClick={()=>setTab(x)} key={x}>{x}</button>)}</nav>
    <section className="panel">
      {tab==='Attendance' && <><h2>Today’s Attendance</h2><div className="stats"><div className="stat"><span className="muted">Present</span><strong>{present}</strong></div><div className="stat"><span className="muted">Absent</span><strong>{Math.max(members.length-present,0)}</strong></div><div className="stat"><span className="muted">Members</span><strong>{members.length}</strong></div></div>{attendance.slice(0,12).map((a:any)=><div className="row" key={a.id}><div><strong>✓ {a.member_name || a.member_id}</strong><div className="muted">{a.checked_in_at ? new Date(a.checked_in_at).toLocaleTimeString() : ''}</div></div><span className="pill">CHECK-IN</span></div>)}</>}
      {tab==='Members' && <><h2>Members</h2><p className="muted">Live members from the attendance database.</p><p><strong>{members.length} registered members</strong></p>{members.map((m:any)=><div className="row" key={m.id}><div><strong>{m.full_name || m.name}</strong><div className="muted">{m.voice_part || 'Choir member'}</div></div><span className="pill">{m.active === false ? 'INACTIVE' : 'ACTIVE'}</span></div>)}</>}
      {tab==='PINs' && <><h2>PIN Management</h2><p className="muted">PIN administration is restricted to this protected dashboard.</p>{members.map((m:any)=><div className="row" key={m.id}><strong>{m.full_name || m.name}</strong><span className="muted">PIN protected</span></div>)}</>}
      {tab==='Reports' && <><h2>Attendance Reports</h2><p className="muted">Live attendance records: {attendance.length}</p><button onClick={()=>{const csv=['Member,Date,Checked In'].concat(attendance.map((a:any)=>`${JSON.stringify(a.member_name||a.member_id)},${a.attendance_date},${a.checked_in_at}`)).join('\n');const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const el=document.createElement('a');el.href=url;el.download='lifeline-attendance.csv';el.click();URL.revokeObjectURL(url)}}>Download CSV</button></>}
    </section>
  </main>
}
