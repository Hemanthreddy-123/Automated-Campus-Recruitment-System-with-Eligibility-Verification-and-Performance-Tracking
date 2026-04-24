import { Link } from 'react-router-dom';
import { FiCheckCircle, FiBriefcase, FiCode, FiBarChart2, FiShield, FiUsers, FiArrowRight, FiCheck } from 'react-icons/fi';

const ACCENTS = [
    { from:'#6366f1', to:'#818cf8', glow:'rgba(99,102,241,0.15)',  bg:'#eef2ff', text:'#4f46e5' },
    { from:'#a855f7', to:'#c084fc', glow:'rgba(168,85,247,0.15)',  bg:'#faf5ff', text:'#7e22ce' },
    { from:'#0891b2', to:'#06b6d4', glow:'rgba(8,145,178,0.15)',   bg:'#ecfeff', text:'#0e7490' },
    { from:'#d97706', to:'#f59e0b', glow:'rgba(217,119,6,0.15)',   bg:'#fffbeb', text:'#b45309' },
    { from:'#059669', to:'#10b981', glow:'rgba(5,150,105,0.15)',   bg:'#ecfdf5', text:'#047857' },
    { from:'#e11d48', to:'#f43f5e', glow:'rgba(225,29,72,0.15)',   bg:'#fff1f2', text:'#be123c' },
];
const STEP_COLORS = [
    { from:'#6366f1', to:'#a855f7' },
    { from:'#0891b2', to:'#6366f1' },
    { from:'#a855f7', to:'#e11d48' },
    { from:'#059669', to:'#0891b2' },
];
const features = [
    { icon:<FiCheckCircle />, title:'Auto Eligibility Verification', desc:'System automatically filters students by CGPA, branch, year, and backlogs before allowing applications.' },
    { icon:<FiBriefcase />,   title:'Drive Management',              desc:'Placement officers can create, schedule and manage multiple job drives with granular eligibility controls.' },
    { icon:<FiCode />,        title:'Coding Competitions',           desc:'Built-in code editor with timer, real-time test cases, leaderboard and instant score feedback.' },
    { icon:<FiBarChart2 />,   title:'Performance Tracking',          desc:'Complete analytics on quiz scores, coding ratings, placement history and skill-wise breakdown.' },
    { icon:<FiShield />,      title:'Secure Role-Based Access',      desc:'JWT-secured login with separate Student and Officer portals and permission controls.' },
    { icon:<FiUsers />,       title:'Student Management',            desc:'Officers can add, update, and review students with advanced search and export functionality.' },
];
const stats = [
    { value:'500+', label:'Students Placed',   color:'#6366f1' },
    { value:'120+', label:'Companies Visited',  color:'#a855f7' },
    { value:'95%',  label:'Placement Rate',     color:'#0891b2' },
    { value:'8.2L', label:'Avg. Package',       color:'#059669' },
];
const steps = [
    { step:'01', title:'Register',        desc:'Create your account with academic details — CGPA, branch, and year.' },
    { step:'02', title:'Browse Drives',   desc:'System auto-verifies eligibility. See only drives you qualify for.' },
    { step:'03', title:'Apply & Compete', desc:'Apply, take coding tests, quizzes, and track your progress.' },
    { step:'04', title:'Get Placed',      desc:'Officers shortlist and finalize selections — all on one platform.' },
];
const studentFeatures = ['Auto eligibility check','Apply to drives','Coding & quiz modules','Performance dashboard'];
const officerFeatures  = ['Post job drives','Manage applications','Shortlist students','Reports & analytics'];

export default function LandingPage() {
    return (
        <div style={{ background:'#fff', minHeight:'100vh', fontFamily:'var(--font-sans)' }}>
            <style>{`
                @keyframes floatA  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.03)} }
                @keyframes floatB  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(18px) scale(0.97)} }
                @keyframes floatC  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.02)} }
                @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
                @keyframes shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
                @keyframes pulse2  { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.5)} 70%{box-shadow:0 0 0 8px rgba(99,102,241,0)} }
                @keyframes gridDrift { from{background-position:0 0} to{background-position:40px 40px} }
                @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes countUp { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }

                .lp-nav-link { color:#4b5563; text-decoration:none; font-size:14px; font-weight:500; transition:color .2s; position:relative; padding-bottom:3px; }
                .lp-nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:linear-gradient(90deg,#6366f1,#a855f7); border-radius:2px; transition:width .25s ease; }
                .lp-nav-link:hover { color:#6366f1; }
                .lp-nav-link:hover::after { width:100%; }

                .lp-footer-link { color:#6b7280; text-decoration:none; font-size:14px; font-weight:500; transition:all .2s; display:block; }
                .lp-footer-link:hover { color:#6366f1; transform:translateX(4px); }

                .lp-stat-item { transition:background .3s; cursor:default; }
                .lp-stat-item:hover { background:rgba(99,102,241,0.05) !important; }

                .lp-feature-card { transition:all .3s ease; background:#fff; }
                .lp-feature-card:hover { transform:translateY(-6px) !important; box-shadow:0 20px 48px rgba(0,0,0,0.1) !important; }
                .lp-feature-bar { transform:scaleX(0); transform-origin:left; transition:transform .35s ease; }
                .lp-feature-card:hover .lp-feature-bar { transform:scaleX(1); }
                .lp-feature-icon { transition:transform .3s ease; }
                .lp-feature-card:hover .lp-feature-icon { transform:scale(1.12) rotate(-4deg); }

                .lp-step-card { transition:all .3s ease; }
                .lp-step-card:hover { transform:translateY(-6px) !important; }

                .lp-role-card { transition:all .35s ease; }
                .lp-role-card:hover { transform:translateY(-8px) scale(1.01) !important; }

                .lp-btn-primary { transition:all .3s ease; }
                .lp-btn-primary:hover { transform:translateY(-3px) scale(1.02) !important; box-shadow:0 14px 36px rgba(99,102,241,0.45) !important; }
                .lp-btn-outline { transition:all .3s ease; }
                .lp-btn-outline:hover { transform:translateY(-3px) !important; background:#eef2ff !important; border-color:#6366f1 !important; }

                .lp-scroll-indicator { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:5px; animation:fadeIn 1s ease 1.5s both; }
                .lp-scroll-dot { width:5px; height:5px; border-radius:50%; background:rgba(99,102,241,0.4); animation:floatA 1.5s ease-in-out infinite; }
                .lp-scroll-dot:nth-child(2) { animation-delay:.2s; opacity:.6; }
                .lp-scroll-dot:nth-child(3) { animation-delay:.4s; opacity:.3; }
            `}</style>

            {/* ── NAVBAR ── */}
            <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:1000, height:64, padding:'0 48px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.92)', backdropFilter:'blur(16px)', borderBottom:'1px solid #e5e7eb', boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
                <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff', boxShadow:'0 3px 12px rgba(99,102,241,0.4)' }}>C</div>
                    <span style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:800, color:'#111827', letterSpacing:'-0.3px' }}>
                        Campus<span style={{ background:'linear-gradient(90deg,#6366f1,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Hire</span>
                    </span>
                </Link>
                <ul style={{ display:'flex', alignItems:'center', gap:32, listStyle:'none', margin:0, padding:0 }}>
                    <li><a href="#features" className="lp-nav-link">Features</a></li>
                    <li><a href="#how" className="lp-nav-link">How It Works</a></li>
                    <li><a href="#stats" className="lp-nav-link">About</a></li>
                </ul>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Link to="/login" style={{ padding:'7px 18px', borderRadius:8, fontSize:13, fontWeight:600, color:'#374151', textDecoration:'none', border:'1.5px solid #e5e7eb', transition:'all .2s', background:'#fff' }}
                        onMouseEnter={e=>{ e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.color='#6366f1'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#374151'; }}
                    >Sign In</Link>
                    <Link to="/register" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'7px 18px', borderRadius:8, fontSize:13, fontWeight:700, background:'linear-gradient(135deg,#6366f1,#a855f7)', color:'#fff', textDecoration:'none', boxShadow:'0 3px 12px rgba(99,102,241,0.35)', transition:'all .2s' }}
                        onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(99,102,241,0.45)'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 3px 12px rgba(99,102,241,0.35)'; }}
                    >Get Started <FiArrowRight /></Link>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'120px 48px 100px', background:'linear-gradient(145deg,#fafafa 0%,#f0f0ff 40%,#fdf4ff 70%,#f0fffe 100%)', position:'relative', overflow:'hidden' }}>
                {/* Soft color blobs */}
                <div style={{ position:'absolute', top:'5%',   left:'0%',   width:500, height:500, background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)',  borderRadius:'50%', filter:'blur(80px)', animation:'floatA 10s ease-in-out infinite', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:'5%', right:'0%', width:440, height:440, background:'radial-gradient(circle,rgba(168,85,247,0.1) 0%,transparent 70%)',  borderRadius:'50%', filter:'blur(70px)', animation:'floatB 12s ease-in-out infinite', pointerEvents:'none' }} />
                <div style={{ position:'absolute', top:'35%',  right:'12%', width:280, height:280, background:'radial-gradient(circle,rgba(8,145,178,0.09) 0%,transparent 70%)',   borderRadius:'50%', filter:'blur(55px)', animation:'floatC 8s ease-in-out infinite', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:'20%',left:'12%', width:240, height:240, background:'radial-gradient(circle,rgba(5,150,105,0.08) 0%,transparent 70%)',   borderRadius:'50%', filter:'blur(50px)', animation:'floatA 14s ease-in-out infinite reverse', pointerEvents:'none' }} />

                {/* Dot grid */}
                <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(99,102,241,0.07) 1px,transparent 1px)', backgroundSize:'40px 40px', animation:'gridDrift 28s linear infinite', pointerEvents:'none' }} />

                {/* Rotating rings */}
                <div style={{ position:'absolute', top:'10%', right:'7%', width:160, height:160, border:'1.5px solid rgba(99,102,241,0.12)', borderRadius:'50%', animation:'rotateSlow 20s linear infinite', pointerEvents:'none' }}>
                    <div style={{ position:'absolute', top:-4, left:'50%', transform:'translateX(-50%)', width:8, height:8, borderRadius:'50%', background:'#6366f1', boxShadow:'0 0 10px rgba(99,102,241,0.5)' }} />
                </div>
                <div style={{ position:'absolute', bottom:'12%', left:'5%', width:110, height:110, border:'1.5px solid rgba(168,85,247,0.12)', borderRadius:'50%', animation:'rotateSlow 15s linear infinite reverse', pointerEvents:'none' }}>
                    <div style={{ position:'absolute', top:-3, left:'50%', transform:'translateX(-50%)', width:6, height:6, borderRadius:'50%', background:'#a855f7', boxShadow:'0 0 8px rgba(168,85,247,0.5)' }} />
                </div>

                <div style={{ position:'relative', zIndex:1, maxWidth:900, margin:'0 auto', textAlign:'center' }}>
                    {/* Eyebrow */}
                    <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(99,102,241,0.08)', backdropFilter:'blur(8px)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:50, padding:'9px 22px', fontSize:11, fontWeight:700, color:'#6366f1', letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:28, boxShadow:'0 2px 16px rgba(99,102,241,0.1)', animation:'fadeUp 0.7s ease 0.1s both' }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:'#6366f1', display:'inline-block', animation:'pulse2 2s infinite' }} />
                        Automated Campus Recruitment Platform
                        <span style={{ width:7, height:7, borderRadius:'50%', background:'#a855f7', display:'inline-block', animation:'pulse2 2s infinite 1s' }} />
                    </div>

                    {/* Heading */}
                    <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(40px,6vw,72px)', fontWeight:800, lineHeight:1.1, color:'#111827', marginBottom:20, letterSpacing:'-2px', animation:'fadeUp 0.8s ease 0.25s both' }}>
                        Transform Your<br />
                        <span style={{ background:'linear-gradient(135deg,#6366f1 0%,#a855f7 35%,#0891b2 65%,#6366f1 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', backgroundSize:'300% 100%', animation:'shimmer 5s ease-in-out infinite', display:'inline-block' }}>Campus Placements</span>
                    </h1>

                    <p style={{ fontSize:18, color:'#6b7280', lineHeight:1.8, maxWidth:620, margin:'0 auto 44px', fontWeight:400, animation:'fadeUp 0.8s ease 0.4s both' }}>
                        Streamline eligibility verification, drive management, coding competitions, and performance tracking — all in one powerful platform.
                    </p>

                    {/* CTAs */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, flexWrap:'wrap', marginBottom:60, animation:'fadeUp 0.8s ease 0.55s both' }}>
                        <Link to="/register" className="lp-btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'15px 36px', background:'linear-gradient(135deg,#6366f1,#a855f7)', color:'#fff', borderRadius:12, fontSize:16, fontWeight:700, textDecoration:'none', boxShadow:'0 8px 28px rgba(99,102,241,0.4)' }}>
                            Student Register <FiArrowRight style={{ fontSize:17 }} />
                        </Link>
                        <Link to="/login" className="lp-btn-outline" style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'15px 36px', background:'#fff', color:'#374151', borderRadius:12, fontSize:16, fontWeight:600, textDecoration:'none', border:'2px solid #e5e7eb' }}>
                            Officer Login <FiArrowRight style={{ fontSize:17 }} />
                        </Link>
                    </div>

                    {/* Stats bar */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', background:'#fff', border:'1px solid #e5e7eb', borderRadius:20, overflow:'hidden', maxWidth:700, margin:'0 auto', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', animation:'fadeUp 0.8s ease 0.7s both' }}>
                        {stats.map((s, i) => (
                            <div key={i} className="lp-stat-item" style={{ flex:1, textAlign:'center', padding:'26px 16px', borderRight: i < stats.length-1 ? '1px solid #f3f4f6' : 'none' }}>
                                <span style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:800, color:s.color, display:'block', marginBottom:5, letterSpacing:'-0.5px', animation:'countUp 0.6s ease both' }}>{s.value}</span>
                                <span style={{ fontSize:11, color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px' }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lp-scroll-indicator">
                    <div className="lp-scroll-dot" /><div className="lp-scroll-dot" /><div className="lp-scroll-dot" />
                </div>
            </section>

            {/* ── ROLE CARDS ── */}
            <section style={{ background:'#f9fafb', padding:'88px 48px' }}>
                <div style={{ maxWidth:1000, margin:'0 auto' }}>
                    <SectionHeader tag="Quick Access" title="Choose Your Role" desc="Two dedicated portals — built for students and placement officers." tagColor="#6366f1" light />
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(360px,1fr))', gap:24, maxWidth:860, margin:'0 auto' }}>
                        <RoleCard emoji="🎓" title="Student" desc="View eligible drives, apply, take quizzes, join coding contests, and track your performance in real-time." features={studentFeatures} linkTo="/login" linkLabel="Student Login" gradFrom="#6366f1" gradTo="#a855f7" glowColor="rgba(99,102,241,0.18)" />
                        <RoleCard emoji="🏢" title="Placement Officer" desc="Create drives, auto-filter eligible students, review applications, shortlist candidates, and download reports." features={officerFeatures} linkTo="/login" linkLabel="Officer Login" gradFrom="#0891b2" gradTo="#6366f1" glowColor="rgba(8,145,178,0.18)" />
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" style={{ padding:'88px 48px', background:'#fff' }}>
                <div style={{ maxWidth:1180, margin:'0 auto' }}>
                    <SectionHeader tag="Platform Features" title="Everything Built In" desc="A complete automated recruitment solution — no integrations needed." tagColor="#a855f7" light />
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:20 }}>
                        {features.map((f, i) => (
                            <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} accent={ACCENTS[i]} delay={0.07 * i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" style={{ padding:'88px 48px', background:'#f9fafb' }}>
                <div style={{ maxWidth:1120, margin:'0 auto' }}>
                    <SectionHeader tag="How It Works" title="From Register to Placed" desc="Four simple steps to get your students placed efficiently." tagColor="#0891b2" light />
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
                        {steps.map((s, i) => (
                            <div key={i} style={{ position:'relative' }}>
                                <div className="lp-step-card" style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:20, padding:'30px 24px', height:'100%', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}
                                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=STEP_COLORS[i].from; e.currentTarget.style.boxShadow=`0 12px 36px ${STEP_COLORS[i].from}22`; }}
                                    onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'; }}
                                >
                                    <div style={{ fontFamily:'var(--font-display)', fontSize:44, fontWeight:900, background:`linear-gradient(135deg,${STEP_COLORS[i].from},${STEP_COLORS[i].to})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:14, letterSpacing:'-1px', lineHeight:1 }}>{s.step}</div>
                                    <h4 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, color:'#111827', marginBottom:10 }}>{s.title}</h4>
                                    <p style={{ fontSize:14, color:'#6b7280', lineHeight:1.75 }}>{s.desc}</p>
                                </div>
                                {i < steps.length-1 && (
                                    <div style={{ position:'absolute', right:-12, top:'50%', transform:'translateY(-50%)', fontSize:20, zIndex:1, opacity:0.35, background:`linear-gradient(90deg,${STEP_COLORS[i].from},${STEP_COLORS[i].to})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background:'#111827', padding:'56px 48px 28px', borderTop:'1px solid #1f2937' }}>
                <div style={{ maxWidth:1180, margin:'0 auto' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:36, marginBottom:40 }}>
                        <div style={{ flex:1, minWidth:260 }}>
                            <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'#fff', marginBottom:12, letterSpacing:'-0.3px' }}>
                                Campus<span style={{ background:'linear-gradient(90deg,#818cf8,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Hire</span>
                            </div>
                            <p style={{ fontSize:14, maxWidth:300, lineHeight:1.75, color:'rgba(255,255,255,0.4)' }}>
                                Automated Campus Recruitment System with Eligibility Verification and Performance Tracking.
                            </p>
                        </div>
                        <div style={{ display:'flex', gap:44, flexWrap:'wrap' }}>
                            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                                <a href="#features" className="lp-footer-link">Features</a>
                                <a href="#how" className="lp-footer-link">How It Works</a>
                                <a href="#stats" className="lp-footer-link">About</a>
                            </div>
                            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                                <Link to="/login" className="lp-footer-link">Login</Link>
                                <Link to="/register" className="lp-footer-link">Register</Link>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingTop:24, borderTop:'1px solid #1f2937', textAlign:'center' }}>
                        <p style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontWeight:500 }}>
                            © 2025 CampusHire — Automated Campus Recruitment System. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

/* ── Sub-components ── */

function SectionHeader({ tag, title, desc, tagColor }) {
    return (
        <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-block', background:`${tagColor}12`, color:tagColor, border:`1px solid ${tagColor}30`, padding:'6px 18px', borderRadius:50, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1.1px', marginBottom:12 }}>{tag}</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px,4vw,40px)', fontWeight:800, color:'#111827', marginBottom:10, letterSpacing:'-0.5px', lineHeight:1.2 }}>{title}</h2>
            <p style={{ color:'#6b7280', fontSize:16, maxWidth:500, margin:'0 auto', lineHeight:1.75 }}>{desc}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc, accent, delay }) {
    return (
        <div className="lp-feature-card" style={{ border:`1.5px solid #f3f4f6`, borderRadius:18, padding:'28px 24px', position:'relative', overflow:'hidden', animation:`fadeUp 0.6s ease ${delay}s both`, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=accent.from; e.currentTarget.style.background=accent.bg; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#f3f4f6'; e.currentTarget.style.background='#fff'; }}
        >
            <div className="lp-feature-bar" style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${accent.from},${accent.to})` }} />
            <div className="lp-feature-icon" style={{ width:50, height:50, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:16, background:accent.bg, color:accent.text }}>
                {icon}
            </div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'#111827', marginBottom:8 }}>{title}</h3>
            <p style={{ color:'#6b7280', fontSize:14, lineHeight:1.75 }}>{desc}</p>
        </div>
    );
}

function RoleCard({ emoji, title, desc, features, linkTo, linkLabel, gradFrom, gradTo, glowColor }) {
    return (
        <div className="lp-role-card" style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:22, padding:'40px 32px', textAlign:'center', position:'relative', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=gradFrom; e.currentTarget.style.boxShadow=`0 16px 48px ${glowColor}`; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; }}
        >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${gradFrom},${gradTo})` }} />
            <div style={{ width:72, height:72, borderRadius:18, background:`linear-gradient(135deg,${gradFrom}15,${gradTo}22)`, border:`1px solid ${gradFrom}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, margin:'0 auto 20px', boxShadow:`0 6px 20px ${gradFrom}20` }}>{emoji}</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'#111827', marginBottom:12 }}>{title}</h3>
            <p style={{ color:'#6b7280', fontSize:14, marginBottom:24, lineHeight:1.75 }}>{desc}</p>
            <ul style={{ textAlign:'left', marginBottom:28, display:'flex', flexDirection:'column', gap:10 }}>
                {features.map((f, i) => (
                    <li key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:'#374151', fontWeight:500 }}>
                        <div style={{ width:20, height:20, borderRadius:'50%', background:`${gradFrom}15`, border:`1px solid ${gradFrom}35`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <FiCheck style={{ color:gradFrom, fontSize:11 }} />
                        </div>
                        {f}
                    </li>
                ))}
            </ul>
            <Link to={linkTo} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'13px 20px', background:`linear-gradient(135deg,${gradFrom},${gradTo})`, color:'#fff', borderRadius:10, fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:`0 6px 20px ${gradFrom}35`, transition:'all .3s ease' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 10px 28px ${gradFrom}50`; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 6px 20px ${gradFrom}35`; }}
            >
                {linkLabel} <FiArrowRight style={{ fontSize:15 }} />
            </Link>
        </div>
    );
}
