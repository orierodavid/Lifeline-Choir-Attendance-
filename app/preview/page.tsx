'use client'

export default function Preview(){
 return <main className="admin" style={{minHeight:'100vh'}}>
  <header className="adminbar"><div><div className="brand" style={{textAlign:'left'}}>LIFELINE CHOIR</div><h1 style={{margin:'6px 0'}}>Attendance Dashboard</h1><div className="muted">Sunday service attendance overview</div></div><a className="link" href="/">Member check-in →</a></header>
  <nav className="nav"><button className="active">Attendance</button><button>Members</button><button>PINs</button><button>Reports</button></nav>
  <section className="panel">
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap'}}><div><h2 style={{marginBottom:4}}>Today</h2><div className="muted">Attendance status at a glance</div></div><span className="pill">LIVE</span></div>
   <div className="stats"><div className="stat"><span className="muted">Present</span><strong>86</strong></div><div className="stat"><span className="muted">Absent</span><strong>18</strong></div><div className="stat"><span className="muted">Members</span><strong>104</strong></div></div>
   <h3 style={{marginTop:28}}>Recent check-ins</h3>
   {[['John Ade','Soprano','3:05 PM'],['Mary James','Alto','3:08 PM'],['Peter Cole','Tenor','3:14 PM'],['Grace David','Soprano','3:22 PM']].map(([n,p,t])=><div className="row" key={n}><div><strong>✓ {n}</strong><div className="muted">{p} · {t}</div></div><span className="pill">PRESENT</span></div>)}
   <div style={{marginTop:28,padding:20,borderRadius:14,background:'#f7f7f7'}}><strong>Member experience</strong><p className="muted" style={{marginBottom:0}}>Members enter their registered name and 4-digit PIN. The system verifies their identity and location, then records attendance automatically.</p></div>
  </section>
 </main>
}