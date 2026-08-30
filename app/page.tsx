'use client'

import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Factory,
  Filter,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Thermometer,
  UserRound,
  Wifi,
  X,
  Zap,
} from 'lucide-react'

const machines = [
  { id: 'MCH-042', model: 'CNC Mill X4', state: 'Online', prediction: 'comp3', probability: 87, time: 'in 18h', color: 'blue' },
  { id: 'MCH-019', model: 'Hydraulic Press H2', state: 'Online', prediction: 'comp1', probability: 72, time: 'in 21h', color: 'violet' },
  { id: 'MCH-087', model: 'Lathe Pro 8', state: 'Maintenance', prediction: 'none', probability: 12, time: '—', color: 'green' },
  { id: 'MCH-031', model: 'CNC Mill X2', state: 'Online', prediction: 'comp4', probability: 64, time: 'in 23h', color: 'orange' },
]

const telemetry = [42, 46, 43, 49, 52, 48, 57, 54, 62, 58, 64, 60, 66, 61, 68, 72, 67, 74, 71, 77, 73, 79, 76, 81]

function NavItem({ icon: Icon, label, active, badge, onClick }: { icon: typeof Activity; label: string; active?: boolean; badge?: string; onClick?: () => void }) {
  return <button onClick={onClick} className={`nav-item ${active ? 'active' : ''}`}><Icon size={18} strokeWidth={active ? 2.2 : 1.8} /><span>{label}</span>{badge && <span className="nav-badge">{badge}</span>}</button>
}

function PredictionBadge({ prediction, probability }: { prediction: string; probability: number }) {
  if (prediction === 'none') return <span className="prediction none"><ShieldCheck size={14} /> No component risk</span>
  return <span className={`prediction ${probability >= 80 ? 'high' : 'medium'}`}><AlertTriangle size={14} /> {prediction.toUpperCase()} · {probability}%</span>
}

function TelemetryChart() {
  const max = 90
  const min = 30
  const points = telemetry.map((value, index) => `${(index / (telemetry.length - 1)) * 100},${100 - ((value - min) / (max - min)) * 100}`).join(' ')
  return <div className="chart-wrap"><div className="chart-grid"><span>90</span><span>70</span><span>50</span><span>30</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="telemetry-chart" aria-label="Temperature telemetry chart"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".25" /><stop offset="100%" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs><polygon points={`0,100 ${points} 100,100`} fill="url(#chart-fill)" /><polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" /></svg><div className="chart-x"><span>−6h</span><span>−4h</span><span>−2h</span><span>Now</span></div></div>
}

function RouteView({ section }: { section: string }) {
  const content = {
    Machines: { eyebrow: 'FLEET DIRECTORY', title: 'Machines', description: 'Browse operational state, telemetry and maintenance history for every asset.', metrics: ['52 total machines', '48 online', '2 maintenance', '2 offline'], rows: ['MCH-042 · CNC Mill X4', 'MCH-019 · Hydraulic Press H2', 'MCH-087 · Lathe Pro 8', 'MCH-031 · CNC Mill X2'] },
    Predictions: { eyebrow: 'ML OUTPUTS', title: 'Predictions', description: 'Review component-level failure risks generated for the next 24 hours.', metrics: ['12 active risks', '87% highest risk', 'COMP3 most predicted', 'v2.4.1 active'], rows: ['MCH-042 · COMP3 · 87%', 'MCH-019 · COMP1 · 72%', 'MCH-031 · COMP4 · 64%', 'MCH-087 · No component risk'] },
    Alerts: { eyebrow: 'REQUIRES ATTENTION', title: 'Alerts', description: 'Component risks above the configured threshold. These are predictions, not current failures.', metrics: ['3 open alerts', '1 high risk', '2 medium risk', '24h horizon'], rows: ['MCH-042 — Risk of COMP3 failure within 24 hours', 'MCH-019 — Risk of COMP1 failure within 24 hours', 'MCH-031 — Risk of COMP4 failure within 24 hours'] },
  }[section as 'Machines' | 'Predictions' | 'Alerts']
  if (!content) return null
  return <div className="content-wrap"><div className="page-heading"><div><div className="eyebrow"><span className="live-dot" /> {content.eyebrow}</div><h1>{content.title}<span className="heading-period">.</span></h1><p>{content.description}</p></div><button className="outline-button"><Filter size={16} /> Filters</button></div><section className="metric-grid">{content.metrics.map((metric, index) => <article className="metric-card" key={metric}><div className="metric-top"><span>{index === 0 ? 'Overview' : 'Signal'}</span><span className="metric-icon blue"><Activity size={17} /></span></div><div className="metric-value">{metric.split(' ')[0]} <small>{metric.split(' ').slice(1).join(' ')}</small></div><div className="metric-caption">Live from Sentinel API</div></article>)}</section><article className="panel fleet-panel"><div className="panel-header"><div><h2>{section === 'Alerts' ? 'Active component alerts' : `${section} overview`}</h2><p>{section === 'Alerts' ? 'Prioritized by probability and prediction horizon' : 'Data contract ready for the Spring Boot API'}</p></div></div><div className="table-wrap"><table><thead><tr><th>Asset / signal</th><th>Status</th><th>Horizon</th><th /></tr></thead><tbody>{content.rows.map((row, index) => <tr key={row}><td><div className="machine-cell"><div className="machine-icon blue"><Factory size={16} /></div><div><strong>{row}</strong><small>{section === 'Machines' ? 'Operational telemetry available' : 'Model v2.4.1 · component probability'}</small></div></div></td><td><span className={`state ${index === 3 ? 'maintenance' : 'online'}`}><span /> {index === 3 ? 'Maintenance' : section === 'Alerts' ? 'Open' : 'Monitored'}</span></td><td><span className="horizon">{section === 'Machines' ? 'Live' : 'Next 24h'}</span></td><td><button className="row-more"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></article></div>
}

export default function Page() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState(() => typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('view') || 'Overview' : 'Overview')
  const selectNav = (label: string) => { setActiveNav(label); if (typeof window !== 'undefined') window.history.pushState({}, '', label === 'Overview' ? '/' : `/?view=${label.toLowerCase()}`) }
  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get('view')
    if (view) setActiveNav(view.charAt(0).toUpperCase() + view.slice(1))
  }, [])
  const [range, setRange] = useState('6 hours')
  const [showProfile, setShowProfile] = useState(false)

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Zap size={16} fill="currentColor" /></div><span>Sentinel<span className="brand-dot">.</span></span><button className="close-mobile" onClick={() => setMobileOpen(false)}><X size={19} /></button></div>
      <div className="workspace"><div className="workspace-icon">N</div><div><strong>Northstar Plant</strong><small>Operations workspace</small></div><ChevronDown size={15} /></div>
      <nav className="nav-group"><small className="nav-label">WORKSPACE</small><NavItem icon={LayoutDashboard} label="Overview" active={activeNav === 'Overview'} onClick={() => { selectNav('Overview'); setMobileOpen(false) }} /><NavItem icon={Factory} label="Machines" active={activeNav === 'Machines'} onClick={() => selectNav('Machines')} /><NavItem icon={Sparkles} label="Predictions" active={activeNav === 'Predictions'} onClick={() => selectNav('Predictions')} badge="12" /><NavItem icon={Bell} label="Alerts" active={activeNav === 'Alerts'} onClick={() => selectNav('Alerts')} badge="3" /></nav>
      <nav className="nav-group secondary"><small className="nav-label">SYSTEM</small><NavItem icon={Activity} label="ML pipeline" active={activeNav === 'ML pipeline'} onClick={() => setActiveNav('ML pipeline')} /><NavItem icon={Settings} label="Settings" active={activeNav === 'Settings'} onClick={() => setActiveNav('Settings')} /><NavItem icon={CircleHelp} label="Help center" /></nav>
      <div className="sidebar-bottom"><div className="pipeline-status"><span className="live-dot" /><div><strong>Pipeline healthy</strong><small>Last run 8 min ago</small></div><ChevronRight size={15} /></div><div className="user-card" onClick={() => setShowProfile(!showProfile)}><div className="avatar">AM</div><div><strong>Alex Morgan</strong><small>Plant manager</small></div><MoreHorizontal size={17} /></div>{showProfile && <div className="profile-popover"><UserRound size={15} /> Account settings <LogOut size={15} /> Sign out</div>}</div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
    <main className="main-content">
      <header className="topbar"><button className="menu-button" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>Overview</strong></div><div className="top-actions"><div className="search"><Search size={17} /><input placeholder="Search machines..." aria-label="Search machines" /></div><button className="icon-button notification"><Bell size={18} /><i>3</i></button><div className="top-avatar">AM</div></div></header>
      {activeNav !== 'Overview' ? <RouteView section={activeNav} /> : <div className="content-wrap"><div className="page-heading"><div><div className="eyebrow"><span className="live-dot" /> LIVE MONITORING</div><h1>Good morning, Alex<span className="heading-period">.</span></h1><p>Here&apos;s what&apos;s happening across your plant today.</p></div><button className="outline-button"><SlidersHorizontal size={16} /> Customize view</button></div>
        <section className="metric-grid"><article className="metric-card"><div className="metric-top"><span>Fleet status</span><span className="metric-icon blue"><Factory size={17} /></span></div><div className="metric-value">48 <small>/ 52</small></div><div className="metric-caption"><span className="status-pill success"><span /> 92.3% operational</span></div></article><article className="metric-card"><div className="metric-top"><span>Predicted risks</span><span className="metric-icon orange"><AlertTriangle size={17} /></span></div><div className="metric-value">12</div><div className="metric-caption"><ArrowUpRight size={14} /> 3 new since yesterday</div></article><article className="metric-card"><div className="metric-top"><span>Avg. confidence</span><span className="metric-icon violet"><Gauge size={17} /></span></div><div className="metric-value">78.4<span className="unit">%</span></div><div className="metric-caption positive"><ArrowUpRight size={14} /> 4.2% vs last week</div></article><article className="metric-card"><div className="metric-top"><span>Last model run</span><span className="metric-icon green"><Clock3 size={17} /></span></div><div className="metric-value time-value">08:42 <small>AM</small></div><div className="metric-caption">Model v2.4.1 · Completed</div></article></section>
        <section className="main-grid"><article className="panel fleet-panel"><div className="panel-header"><div><h2>Machines needing attention</h2><p>Prioritized by predicted component risk</p></div><button className="text-button" onClick={() => setActiveNav('Machines')}>View all <ArrowUpRight size={15} /></button></div><div className="table-wrap"><table><thead><tr><th>Machine</th><th>Operational state</th><th>Latest ML prediction</th><th>Horizon</th><th /></tr></thead><tbody>{machines.map((machine) => <tr key={machine.id}><td><div className="machine-cell"><div className={`machine-icon ${machine.color}`}><Factory size={16} /></div><div><strong>{machine.id}</strong><small>{machine.model}</small></div></div></td><td><span className={`state ${machine.state.toLowerCase()}`}><span /> {machine.state}</span></td><td><PredictionBadge prediction={machine.prediction} probability={machine.probability} /></td><td><span className="horizon">{machine.time}</span></td><td><button className="row-more"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing 4 of 52 machines</span><div><button className="pagination" disabled>Previous</button><button className="pagination">Next <ChevronRight size={14} /></button></div></div></article>
          <article className="panel activity-panel"><div className="panel-header"><div><h2>Recent activity</h2><p>Latest events from your fleet</p></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="activity-list"><div className="activity-item"><div className="activity-icon orange"><AlertTriangle size={16} /></div><div><strong>New component risk detected</strong><p>MCH-042 · COMP3 probability reached 87%</p><time>8 min ago</time></div></div><div className="activity-item"><div className="activity-icon blue"><Sparkles size={16} /></div><div><strong>Prediction batch completed</strong><p>52 machines analyzed · Model v2.4.1</p><time>18 min ago</time></div></div><div className="activity-item"><div className="activity-icon green"><Wifi size={16} /></div><div><strong>Machine back online</strong><p>MCH-087 completed scheduled maintenance</p><time>42 min ago</time></div></div><button className="activity-link">View activity log <ArrowUpRight size={14} /></button></div></article></section>
        <section className="bottom-grid"><article className="panel chart-panel"><div className="panel-header"><div><h2>Telemetry overview</h2><p>Average temperature across selected fleet</p></div><div className="range-tabs">{['6 hours', '24 hours', '7 days'].map((item) => <button key={item} className={range === item ? 'selected' : ''} onClick={() => setRange(item)}>{item}</button>)}</div></div><div className="chart-legend"><span><i className="legend-line" /> Average temperature</span><span><i className="legend-dot" /> Threshold 75°C</span><b><Thermometer size={15} /> 71.4°C <small>Current avg.</small></b></div><TelemetryChart /></article><article className="panel model-panel"><div className="panel-header"><div><h2>Model performance</h2><p>Validation metrics · v2.4.1</p></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="model-score"><div className="score-ring"><span>94<span>%</span></span></div><div><strong>Excellent accuracy</strong><p>Model is performing above<br />the 90% target threshold.</p></div></div><div className="model-stats"><div><span>Precision</span><strong>91.8%</strong></div><div><span>Recall</span><strong>88.6%</strong></div><div><span>F1 score</span><strong>90.2%</strong></div></div><div className="model-footer"><span><span className="live-dot" /> All systems nominal</span><button className="text-button">Details <ChevronRight size={14} /></button></div></article></section>
      </div>}
    </main>
  </div>
}
