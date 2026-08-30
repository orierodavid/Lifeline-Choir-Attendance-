'use client'

import { useMemo, useState } from 'react'

const initialMembers = [
  ['John Ade', 'Soprano'], ['Mary James', 'Alto'], ['Peter Cole', 'Tenor'],
  ['Grace David', 'Soprano'], ['Daniel Okoro', 'Tenor'], ['Esther Michael', 'Alto'],
  ['Samuel Joseph', 'Tenor'], ['Ruth Emeka', 'Alto'], ['David Paul', 'Soprano'],
  ['Joy Samuel', 'Alto'], ['Michael Peter', 'Tenor'], ['Deborah John', 'Soprano'],
]

export default function Admin() {
  const [tab, setTab] = useState('Attendance')
  const [members, setMembers] = useState(initialMembers)
  const [search, setSearch] = useState('')
  const [confirm, setConfirm] = useState<string | null>(null)

  const filtered = useMemo(() => members.filter(([name]) => name.toLowerCase().includes(search.toLowerCase())), [members, search])
  const removeMember = (name: string) => { setMembers(m => m.filter(([n]) => n !== name)); setConfirm(null) }

  return <main className="admin">
    <header className="adminbar"><div><div className="brand" style={{textAlign:'left'}}>LIFELINE CHOIR</div><h1 style={{margin:'6px 0'}}>Attendance</h1></div><a className="link" href="/">Member check-in →</a></header>
    <nav className="nav">{['Attendance','Members','PINs','Reports'].map(x => <button className={tab===x?'active':''} onClick={()=>setTab(x)} key={x}>{x}</button>)}</nav>
    <section className="panel">
      {tab==='Attendance' && <><h2>Saturday, August 30</h2><div className="stats"><div className="stat"><span className="muted">Present</span><strong>86</strong></div><div className="stat"><span className="muted">Absent</span><strong>{Math.max(members.length-4,0)}</strong></div><div className="stat"><span className="muted">Members</span><strong>{members.length}</strong></div></div>{members.slice(0,4).map((m,i)=><div className="row" key={m[0]}><div><strong>✓ {m[0]}</strong><div className="muted">{m[1]} · {['3:05 PM','3:08 PM','3:14 PM','3:22 PM'][i]}</div></div><span className="pill">CHECK-IN</span></div>)}</>}
      {tab==='Members' && <><h2>Members</h2><p className="muted">Dummy members are loaded for testing. Delete them before importing the real choir list.</p><div style={{display:'flex',gap:10,margin:'18px 0',flexWrap:'wrap'}}><input className="input" style={{flex:1,minWidth:220}} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search member"/><button className="primary" style={{width:'auto',padding:'0 20px'}}>IMPORT MEMBERS CSV</button></div><p><strong>{members.length} members loaded</strong></p><div className="table"><div className="row"><strong>Name</strong><strong>Part</strong><span /></div>{filtered.map(([name,part])=><div className="row" key={name}><div><strong>{name}</strong><div className="muted">Choir member</div></div><span className="pill">{part}</span><button className="danger" onClick={()=>setConfirm(name)} style={{background:'none',border:0,fontWeight:700}}>Delete</button></div>)}</div>{confirm && <div className="panel" style={{marginTop:18,padding:18,border:'1px solid #e6d2d2'}}><strong>Delete {confirm}?</strong><p className="muted">This removes the member from this test list.</p><button className="danger" onClick={()=>removeMember(confirm)} style={{marginRight:10}}>Delete</button><button onClick={()=>setConfirm(null)}>Cancel</button></div>}</>}
      {tab==='PINs' && <><h2>PINs</h2><p className="muted">Search a member to change or send their PIN.</p><input className="input" placeholder="Search member"/><div className="row"><strong>John Ade</strong><button>Change PIN</button></div></>}
      {tab==='Reports' && <><h2>Attendance Report</h2><p className="muted">August 2026</p>{[['Aug 1','92'],['Aug 8','101'],['Aug 15','88'],['Aug 22','97'],['Aug 29','94']].map(r=><div className="row" key={r[0]}><span>{r[0]}</span><strong>{r[1]}</strong></div>)}<button style={{marginTop:18}}>Download CSV</button></>}
    </section>
  </main>
}