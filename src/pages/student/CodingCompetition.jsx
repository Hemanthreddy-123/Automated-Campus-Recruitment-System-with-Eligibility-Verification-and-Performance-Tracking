import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import useStudentData from '../../hooks/useStudentData';
import { startCoding, getProblem, submitCode, getLeaderboard, getCodingHistory } from '../../services/api';
import { FiPlay, FiSend, FiAward, FiClock, FiCode, FiList, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };
const DIFF_BADGE  = { Easy: 'badge-success', Medium: 'badge-warning', Hard: 'badge-danger' };

export default function CodingCompetition() {
    const { student } = useStudentData();

    const [view, setView]                   = useState('home');   // home | contest | leaderboard
    const [contestMeta, setContestMeta]     = useState(null);
    const [problems, setProblems]           = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [fullProblem, setFullProblem]     = useState(null);
    const [code, setCode]                   = useState('# Write your solution here\n\ndef solution():\n    pass\n');
    const [language, setLanguage]           = useState('python');
    const [submitted, setSubmitted]         = useState({});   // { problem_id: result }
    const [timeLeft, setTimeLeft]           = useState(90 * 60);
    const [leaderboard, setLeaderboard]     = useState([]);
    const [history, setHistory]             = useState([]);
    const [loadingStart, setLoadingStart]   = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingProblem, setLoadingProblem] = useState(false);
    const [apiError, setApiError]           = useState('');
    const timerRef = useRef(null);

    // Load leaderboard + history on mount
    useEffect(() => {
        getLeaderboard().then(r => setLeaderboard(r.data || [])).catch(() => {});
        getCodingHistory().then(r => setHistory(r.data || [])).catch(() => {});
    }, []);

    // Timer
    useEffect(() => {
        if (view === 'contest' && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [view]);

    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const handleStart = async () => {
        setLoadingStart(true);
        setApiError('');
        try {
            const res = await startCoding();
            setContestMeta(res.data);
            setProblems(res.data.problems || []);
            setTimeLeft(res.data.duration_minutes * 60 || 5400);
            const first = res.data.problems?.[0];
            if (first) await loadProblem(first);
            setView('contest');
        } catch (e) {
            setApiError(e.message || 'Failed to start contest');
        } finally {
            setLoadingStart(false);
        }
    };

    const loadProblem = async (p) => {
        setLoadingProblem(true);
        setSelectedProblem(p);
        try {
            const res = await getProblem(p.id);
            setFullProblem(res.data);
            setCode(res.data.starter?.[language] || '# Write your solution here\n\ndef solution():\n    pass\n');
        } catch {
            setFullProblem(p);
        } finally {
            setLoadingProblem(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedProblem || !code.trim()) return;
        setLoadingSubmit(true);
        setApiError('');
        try {
            const res = await submitCode({
                problem_id: selectedProblem.id,
                language,
                code,
                contest_name: contestMeta?.contest_name || 'Campus Coding Championship',
            });
            setSubmitted(prev => ({ ...prev, [selectedProblem.id]: res.data }));
            // Refresh leaderboard + history
            getLeaderboard().then(r => setLeaderboard(r.data || [])).catch(() => {});
            getCodingHistory().then(r => setHistory(r.data || [])).catch(() => {});
        } catch (e) {
            setApiError(e.message || 'Submission failed');
        } finally {
            setLoadingSubmit(false);
        }
    };

    const sidebarUser = student
        ? { name: student.full_name, roll: `Roll: ${student.roll_number}`, sessionInfo: `${YEAR_LABELS[student.year] || ''} · ${student.branch?.split(' ')[0]}` }
        : { name: '...', roll: '' };

    // ── HOME ────────────────────────────────────────────────────
    if (view === 'home') return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">
                <div className="dashboard-topbar">
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <FiCode style={{ color:'var(--green)' }} />
                        <span style={{ fontSize:14, fontWeight:700, color:'var(--black)' }}>Coding Competition</span>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => setView('leaderboard')}><FiAward size={13} /> Leaderboard</button>
                </div>

                {/* Contest banner */}
                <div style={{ background:'linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 60%,#16213e 100%)', borderRadius:16, padding:'24px 28px', marginBottom:20, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:'-20%', right:'5%', width:180, height:180, background:'rgba(99,102,241,0.1)', borderRadius:'50%', pointerEvents:'none' }} />
                    <div style={{ position:'relative', zIndex:1 }}>
                        <div style={{ fontSize:36, marginBottom:8 }}>💻</div>
                        <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'#fff', marginBottom:6 }}>Campus Coding Championship</h2>
                        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:16 }}>5 Problems • 90 Minutes • Solve & earn points stored in DB</p>
                        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
                            <span className="badge badge-success">🟢 Live Now</span>
                            <span className="badge badge-muted">{leaderboard.length} Participants</span>
                        </div>
                        {apiError && (
                            <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#fca5a5', marginBottom:12 }}>
                                {apiError}
                            </div>
                        )}
                        <div style={{ display:'flex', gap:10 }}>
                            <button className="btn btn-sm" style={{ background:'#fff', color:'var(--black)', fontWeight:700 }} onClick={handleStart} disabled={loadingStart}>
                                <FiPlay size={13} /> {loadingStart ? 'Loading...' : 'Start Contest'}
                            </button>
                            <button className="btn btn-sm" style={{ background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)' }} onClick={() => setView('leaderboard')}>
                                <FiAward size={13} /> Leaderboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* My coding history */}
                <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                    <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ width:26, height:26, borderRadius:7, background:'#FEF3C7', display:'flex', alignItems:'center', justifyContent:'center', color:'#d97706' }}><FiCode size={13} /></span>
                        <span style={{ fontSize:13, fontWeight:700, color:'var(--black)' }}>My Submissions</span>
                    </div>
                    {history.length === 0 ? (
                        <div style={{ padding:'24px', textAlign:'center', color:'var(--gray-500)', fontSize:13 }}>No submissions yet. Start the contest!</div>
                    ) : (
                        <table style={{ width:'100%', borderCollapse:'collapse' }}>
                            <thead>
                                <tr style={{ background:'var(--gray-100)' }}>
                                    {['Problem','Score','Language','Date'].map(h => (
                                        <th key={h} style={{ padding:'9px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((c) => (
                                    <tr key={c.coding_id} style={{ borderBottom:'1px solid var(--gray-100)' }}>
                                        <td style={{ padding:'11px 16px', fontWeight:600, color:'var(--black)', fontSize:13 }}>{c.problem_title || c.contest_name}</td>
                                        <td style={{ padding:'11px 16px', fontWeight:700, fontSize:13, color:'var(--green)' }}>{c.score}/{c.max_score}</td>
                                        <td style={{ padding:'11px 16px' }}><span className="badge badge-muted" style={{ fontSize:10 }}>{c.language}</span></td>
                                        <td style={{ padding:'11px 16px', fontSize:11, color:'var(--gray-500)' }}>
                                            {new Date(c.submission_time).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );

    // ── LEADERBOARD ─────────────────────────────────────────────
    if (view === 'leaderboard') return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">
                <div className="dashboard-topbar">
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <FiAward style={{ color:'var(--green)' }} />
                        <span style={{ fontSize:14, fontWeight:700, color:'var(--black)' }}>Leaderboard</span>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => setView('home')}><FiList size={13} /> Back</button>
                </div>

                <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                    <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ width:26, height:26, borderRadius:7, background:'#FEF3C7', display:'flex', alignItems:'center', justifyContent:'center', color:'#d97706' }}><FiAward size={13} /></span>
                            <span style={{ fontSize:13, fontWeight:700, color:'var(--black)' }}>🏆 Top Rankings</span>
                        </div>
                        <span className="badge badge-success">🟢 Live</span>
                    </div>
                    {leaderboard.length === 0 ? (
                        <div style={{ padding:'28px', textAlign:'center', color:'var(--gray-500)', fontSize:13 }}>No submissions yet.</div>
                    ) : (
                        <table style={{ width:'100%', borderCollapse:'collapse' }}>
                            <thead>
                                <tr style={{ background:'var(--gray-100)' }}>
                                    {['Rank','Student','Branch','Coding Score','Submissions'].map(h => (
                                        <th key={h} style={{ padding:'9px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((s, i) => {
                                    const isMe = student && s.student_id === student.student_id;
                                    return (
                                        <tr key={s.student_id} style={{ borderBottom:'1px solid var(--gray-100)', background: isMe ? 'var(--soft-mint)' : undefined }}>
                                            <td style={{ padding:'11px 16px' }}>
                                                <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>
                                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                                </div>
                                            </td>
                                            <td style={{ padding:'11px 16px' }}>
                                                <div style={{ fontWeight:700, color:'var(--black)', fontSize:13 }}>{s.full_name} {isMe && <span className="badge badge-primary" style={{ fontSize:10 }}>You</span>}</div>
                                                <div style={{ fontSize:11, color:'var(--gray-500)' }}>{s.roll_number}</div>
                                            </td>
                                            <td style={{ padding:'11px 16px', fontSize:12, color:'var(--gray-700)' }}>{s.branch}</td>
                                            <td style={{ padding:'11px 16px', fontWeight:800, fontSize:15, color:'var(--green)' }}>{s.total_coding_score}</td>
                                            <td style={{ padding:'11px 16px', fontSize:13, color:'var(--gray-500)' }}>{s.coding_submissions}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );

    // ── CONTEST ─────────────────────────────────────────────────
    const display = fullProblem || selectedProblem;
    const subResult = submitted[selectedProblem?.id];

    return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">
                {/* Top bar */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:10 }}>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {problems.map(p => (
                            <button key={p.id} onClick={() => loadProblem(p)}
                                className={`btn btn-sm ${selectedProblem?.id === p.id ? 'btn-primary' : 'btn-outline'}`}
                                style={{ position:'relative' }}>
                                P{p.id}: {p.title}
                                {submitted[p.id] && (
                                    <span style={{ position:'absolute', top:-5, right:-5, width:14, height:14, background:'var(--green)', borderRadius:'50%', fontSize:9, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className={`timer-display${timeLeft < 600 ? ' danger' : ''}`} style={{ fontSize:14, padding:'7px 14px' }}>
                            <FiClock size={12} style={{ marginRight:5 }} />{formatTime(timeLeft)}
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={() => setView('leaderboard')}><FiAward size={12} /> Board</button>
                        <button className="btn btn-outline btn-sm" onClick={() => { clearInterval(timerRef.current); setView('home'); }}>Exit</button>
                    </div>
                </div>

                {apiError && (
                    <div style={{ background:'#fee2e2', border:'1px solid #fecdd3', borderRadius:8, padding:'8px 14px', fontSize:12, color:'#991b1b', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
                        <FiAlertCircle size={13} /> {apiError}
                    </div>
                )}

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, alignItems:'start' }}>
                    {/* Problem */}
                    <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'18px 20px', boxShadow:'var(--shadow-sm)' }}>
                        {loadingProblem ? (
                            <div style={{ textAlign:'center', padding:'40px', color:'var(--gray-500)', fontSize:13 }}>Loading problem...</div>
                        ) : display ? (
                            <>
                                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, color:'var(--black)', flex:1 }}>{display.title}</h3>
                                    <span className={`badge ${DIFF_BADGE[display.difficulty] || 'badge-muted'}`}>{display.difficulty}</span>
                                    <span style={{ fontWeight:800, fontSize:13, color:'var(--green)' }}>+{display.max_score} pts</span>
                                </div>
                                <p style={{ color:'var(--gray-700)', fontSize:13, lineHeight:1.75, marginBottom:16 }}>{display.description}</p>
                                <div style={{ fontSize:12, fontWeight:700, color:'var(--gray-500)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:8 }}>Examples</div>
                                {(display.examples || []).map((ex, i) => (
                                    <div key={i} style={{ background:'var(--gray-100)', borderRadius:8, padding:'10px 12px', marginBottom:8, fontFamily:'monospace', fontSize:12 }}>
                                        <div style={{ color:'var(--gray-500)', marginBottom:3 }}>Input: <span style={{ color:'var(--black)' }}>{ex.input}</span></div>
                                        <div style={{ color:'var(--gray-500)' }}>Output: <span style={{ color:'var(--green)', fontWeight:700 }}>{ex.output}</span></div>
                                        {ex.explanation && <div style={{ color:'var(--gray-500)', marginTop:3 }}>Note: {ex.explanation}</div>}
                                    </div>
                                ))}
                                <div style={{ fontSize:12, fontWeight:700, color:'var(--gray-500)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:8, marginTop:14 }}>Constraints</div>
                                {(display.constraints || []).map((c, i) => (
                                    <div key={i} style={{ fontSize:12, color:'var(--gray-700)', marginBottom:3 }}>• {c}</div>
                                ))}
                            </>
                        ) : null}
                    </div>

                    {/* Editor */}
                    <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'18px 20px', boxShadow:'var(--shadow-sm)', display:'flex', flexDirection:'column', gap:12 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <span style={{ fontSize:14, fontWeight:700, color:'var(--black)' }}>Code Editor</span>
                            <select className="form-select" style={{ width:110, fontSize:12, padding:'6px 10px' }}
                                value={language} onChange={e => {
                                    setLanguage(e.target.value);
                                    if (fullProblem?.starter?.[e.target.value]) setCode(fullProblem.starter[e.target.value]);
                                }}>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                            </select>
                        </div>

                        <textarea className="code-editor" value={code} onChange={e => setCode(e.target.value)}
                            spellCheck={false} disabled={!!subResult} style={{ minHeight:320, fontSize:12 }} />

                        {subResult ? (
                            <div style={{ background:'var(--soft-mint)', border:'1px solid var(--mint-mid)', borderRadius:10, padding:'14px 16px' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                                    <FiCheckCircle style={{ color:'var(--green)' }} />
                                    <span style={{ fontWeight:700, color:'var(--green-dark)', fontSize:14 }}>
                                        Submitted! Score: {subResult.score}/{subResult.max_score}
                                    </span>
                                </div>
                                <div style={{ fontSize:12, color:'var(--gray-700)' }}>
                                    Tests passed: {subResult.tests_passed}/{subResult.total_tests}
                                </div>
                            </div>
                        ) : (
                            <button className="btn btn-primary" onClick={handleSubmit} disabled={loadingSubmit || !code.trim()}>
                                <FiSend size={14} /> {loadingSubmit ? 'Submitting...' : 'Submit Code'}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
