import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import useStudentData from '../../hooks/useStudentData';
import { startQuiz, submitQuiz, getQuizHistory } from '../../services/api';
import { FiPlay, FiSend, FiArrowRight, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiBookOpen } from 'react-icons/fi';

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };

export default function QuizModule() {
    const { student, loading: studentLoading } = useStudentData();

    const [view, setView]           = useState('home');   // home | quiz | result
    const [questions, setQuestions] = useState([]);
    const [quizMeta, setQuizMeta]   = useState(null);
    const [current, setCurrent]     = useState(0);
    const [selected, setSelected]   = useState({});
    const [timeLeft, setTimeLeft]   = useState(900);
    const [history, setHistory]     = useState([]);
    const [histLoading, setHistLoading] = useState(true);
    const [result, setResult]       = useState(null);
    const [starting, setStarting]   = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError]   = useState('');
    const timerRef = useRef(null);

    // Load quiz history on mount
    useEffect(() => {
        getQuizHistory()
            .then(r => setHistory(r.data || []))
            .catch(() => setHistory([]))
            .finally(() => setHistLoading(false));
    }, []);

    // Timer
    useEffect(() => {
        if (view === 'quiz' && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(t => {
                if (t <= 1) { handleSubmit(); return 0; }
                return t - 1;
            }), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [view]);

    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const handleStart = async () => {
        setStarting(true);
        setApiError('');
        try {
            const res = await startQuiz();
            setQuizMeta(res.data);
            setQuestions(res.data.questions || []);
            setTimeLeft(res.data.time_limit_seconds || 900);
            setSelected({});
            setCurrent(0);
            setResult(null);
            setView('quiz');
        } catch (e) {
            setApiError(e.message || 'Failed to start quiz');
        } finally {
            setStarting(false);
        }
    };

    const handleSubmit = async () => {
        clearInterval(timerRef.current);
        if (submitting) return;
        setSubmitting(true);
        try {
            const answers = Object.entries(selected).map(([question_id, selected_option]) => ({
                question_id: parseInt(question_id),
                selected_option,
            }));
            const timeTaken = (quizMeta?.time_limit_seconds || 900) - timeLeft;
            const res = await submitQuiz({
                answers,
                time_taken: timeTaken,
                quiz_name: quizMeta?.quiz_name || 'General Aptitude & Technical Quiz',
            });
            setResult(res.data);
            // Refresh history
            getQuizHistory().then(r => setHistory(r.data || [])).catch(() => {});
            setView('result');
        } catch (e) {
            setApiError(e.message || 'Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const sidebarUser = student
        ? { name: student.full_name, roll: `Roll: ${student.roll_number}`, sessionInfo: `${YEAR_LABELS[student.year] || ''} · ${student.branch?.split(' ')[0]}` }
        : { name: '...', roll: '' };

    const q = questions[current];

    // ── HOME ────────────────────────────────────────────────────
    if (view === 'home') return (
        <div className="dashboard-layout">
            <style>{`
                .qm-opt { border:2px solid var(--gray-200); border-radius:10px; padding:12px 16px; cursor:pointer; background:#fff; text-align:left; font-family:var(--font-sans); font-size:13px; font-weight:500; color:var(--gray-700); transition:all .18s; display:flex; align-items:center; gap:12px; }
                .qm-opt:hover { border-color:var(--green); color:var(--green-dark); background:var(--soft-mint); }
                .qm-opt.selected { border-color:var(--green); background:var(--soft-mint); color:var(--green-dark); font-weight:700; }
                .qm-num { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; flex-shrink:0; }
            `}</style>
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">
                <div className="dashboard-topbar">
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <FiBookOpen style={{ color:'var(--green)' }} />
                        <span style={{ fontSize:14, fontWeight:700, color:'var(--black)' }}>Quiz Module</span>
                    </div>
                </div>

                <div style={{ maxWidth:680, margin:'0 auto' }}>
                    {/* Quiz card */}
                    <div style={{ background:'linear-gradient(135deg,#0a4a2d 0%,#00A63F 60%,#009688 100%)', borderRadius:16, padding:'28px 32px', marginBottom:20, position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', top:'-20%', right:'5%', width:180, height:180, background:'rgba(255,255,255,0.06)', borderRadius:'50%', pointerEvents:'none' }} />
                        <div style={{ position:'relative', zIndex:1 }}>
                            <div style={{ fontSize:40, marginBottom:10 }}>📝</div>
                            <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'#fff', marginBottom:6 }}>Technical Aptitude Quiz</h2>
                            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:13, marginBottom:20 }}>Data Structures • Algorithms • DBMS • OOP • Networking</p>
                            <div style={{ display:'flex', gap:16, marginBottom:22, flexWrap:'wrap' }}>
                                {[['📊','10','Questions'],['⏱','15 min','Duration'],['🎯','50%','Pass Mark'],['⭐','100','Max Score']].map(([icon,val,lbl],i) => (
                                    <div key={i} style={{ background:'rgba(255,255,255,0.12)', borderRadius:10, padding:'10px 16px', textAlign:'center', minWidth:70 }}>
                                        <div style={{ fontSize:18, marginBottom:3 }}>{icon}</div>
                                        <div style={{ fontWeight:800, fontSize:15, color:'#fff' }}>{val}</div>
                                        <div style={{ fontSize:10, color:'rgba(255,255,255,0.55)' }}>{lbl}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, padding:'10px 14px', fontSize:12, color:'rgba(255,255,255,0.75)', marginBottom:20 }}>
                                ⚠ Once started, the timer cannot be paused. Each question has one correct answer.
                            </div>
                            {apiError && (
                                <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#fca5a5', marginBottom:12 }}>
                                    {apiError}
                                </div>
                            )}
                            <button className="btn btn-dark" onClick={handleStart} disabled={starting} style={{ background:'#fff', color:'var(--green-dark)', fontWeight:700 }}>
                                {starting ? 'Loading...' : <><FiPlay size={14} /> Start Quiz</>}
                            </button>
                        </div>
                    </div>

                    {/* History */}
                    <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ width:26, height:26, borderRadius:7, background:'var(--soft-mint)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--green)' }}><FiBookOpen size={13} /></span>
                            <span style={{ fontSize:13, fontWeight:700, color:'var(--black)' }}>Quiz History</span>
                        </div>
                        {histLoading ? (
                            <div style={{ padding:'24px', textAlign:'center', color:'var(--gray-500)', fontSize:13 }}>Loading...</div>
                        ) : history.length === 0 ? (
                            <div style={{ padding:'24px', textAlign:'center', color:'var(--gray-500)', fontSize:13 }}>No quizzes taken yet. Start your first quiz!</div>
                        ) : (
                            <table style={{ width:'100%', borderCollapse:'collapse' }}>
                                <thead>
                                    <tr style={{ background:'var(--gray-100)' }}>
                                        {['Quiz Name','Date','Score','Result'].map(h => (
                                            <th key={h} style={{ padding:'9px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((r) => (
                                        <tr key={r.quiz_id} style={{ borderBottom:'1px solid var(--gray-100)' }}>
                                            <td style={{ padding:'11px 16px', fontWeight:600, color:'var(--black)', fontSize:13 }}>{r.quiz_name}</td>
                                            <td style={{ padding:'11px 16px', fontSize:12, color:'var(--gray-500)' }}>
                                                {new Date(r.attempt_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })}
                                            </td>
                                            <td style={{ padding:'11px 16px', fontWeight:700, fontSize:13, color: r.passed ? 'var(--green)' : '#ef4444' }}>
                                                {r.score}/{r.total_marks}
                                            </td>
                                            <td style={{ padding:'11px 16px' }}>
                                                <span className={`badge ${r.passed ? 'badge-success' : 'badge-danger'}`}>{r.passed ? 'Pass' : 'Fail'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );

    // ── RESULT ──────────────────────────────────────────────────
    if (view === 'result') return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">
                <div style={{ maxWidth:720, margin:'0 auto' }}>
                    {/* Score banner */}
                    <div style={{
                        background: result?.passed
                            ? 'linear-gradient(135deg,#0a4a2d,#00A63F)'
                            : 'linear-gradient(135deg,#7f1d1d,#ef4444)',
                        borderRadius:16, padding:'28px 32px', marginBottom:20, textAlign:'center', position:'relative', overflow:'hidden',
                    }}>
                        <div style={{ position:'absolute', top:'-20%', right:'5%', width:160, height:160, background:'rgba(255,255,255,0.06)', borderRadius:'50%', pointerEvents:'none' }} />
                        <div style={{ fontSize:48, marginBottom:8 }}>{result?.passed ? '🏆' : '😔'}</div>
                        <h2 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'#fff', marginBottom:6 }}>Quiz Completed!</h2>
                        <div style={{ fontSize:48, fontWeight:900, color:'#fff', lineHeight:1, marginBottom:6 }}>{result?.score ?? 0}<span style={{ fontSize:20, opacity:0.7 }}>/{result?.total_marks ?? 100}</span></div>
                        <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, marginBottom:16 }}>
                            {result?.percentage ?? 0}% — {result?.passed ? '✅ Passed' : '❌ Failed'}
                        </p>
                        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
                            <button className="btn btn-sm" style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)' }}
                                onClick={() => { setView('home'); setResult(null); }}>
                                <FiPlay size={13} /> Take Again
                            </button>
                            <button className="btn btn-sm" style={{ background:'#fff', color:'var(--green-dark)', fontWeight:700 }}
                                onClick={() => setView('review')}>
                                Review Answers <FiArrowRight size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Answer review */}
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--black)', marginBottom:12 }}>Answer Review</h3>
                    {(result?.review || []).map((r, i) => (
                        <div key={r.question_id} style={{ background:'#fff', border:`1px solid ${r.is_correct ? 'var(--mint-mid)' : '#fecdd3'}`, borderRadius:12, padding:'16px 18px', marginBottom:10 }}>
                            <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                                {r.is_correct ? <FiCheckCircle style={{ color:'var(--green)', flexShrink:0, marginTop:2 }} /> : <FiXCircle style={{ color:'#ef4444', flexShrink:0, marginTop:2 }} />}
                                <p style={{ fontWeight:600, color:'var(--black)', fontSize:13, margin:0 }}>Q{i+1}. {r.question}</p>
                            </div>
                            <div style={{ paddingLeft:26 }}>
                                {questions[i]?.options?.map((opt, oi) => (
                                    <div key={oi} style={{
                                        padding:'5px 10px', borderRadius:7, fontSize:12, marginBottom:3,
                                        background: oi === r.correct_option ? 'var(--soft-mint)' : oi === r.selected_option && !r.is_correct ? '#fee2e2' : 'transparent',
                                        color: oi === r.correct_option ? 'var(--green-dark)' : oi === r.selected_option && !r.is_correct ? '#991b1b' : 'var(--gray-600)',
                                        fontWeight: oi === r.correct_option ? 700 : 400,
                                    }}>
                                        {oi === r.correct_option ? '✓ ' : oi === r.selected_option && !r.is_correct ? '✗ ' : '  '}{opt}
                                    </div>
                                ))}
                                <p style={{ fontSize:11, color:'var(--gray-500)', marginTop:6, fontStyle:'italic' }}>💡 {r.explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );

    // ── ACTIVE QUIZ ─────────────────────────────────────────────
    return (
        <div className="dashboard-layout">
            <style>{`
                .qm-opt { border:2px solid var(--gray-200); border-radius:10px; padding:12px 16px; cursor:pointer; background:#fff; text-align:left; font-family:var(--font-sans); font-size:13px; font-weight:500; color:var(--gray-700); transition:all .18s; display:flex; align-items:center; gap:12px; width:100%; }
                .qm-opt:hover { border-color:var(--green); color:var(--green-dark); background:var(--soft-mint); }
                .qm-opt.selected { border-color:var(--green); background:var(--soft-mint); color:var(--green-dark); font-weight:700; }
            `}</style>
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">
                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
                    <div>
                        <h2 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:800, color:'var(--black)', marginBottom:2 }}>{quizMeta?.quiz_name}</h2>
                        <p style={{ fontSize:12, color:'var(--gray-500)' }}>Question {current + 1} of {questions.length}</p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className={`timer-display${timeLeft < 120 ? ' danger' : ''}`} style={{ fontSize:15, padding:'8px 16px' }}>
                            <FiClock size={13} style={{ marginRight:6 }} />{formatTime(timeLeft)}
                        </div>
                        <button className="btn btn-danger btn-sm" onClick={handleSubmit} disabled={submitting}>
                            <FiSend size={13} /> {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>

                {/* Progress */}
                <div style={{ background:'var(--gray-200)', borderRadius:99, height:5, marginBottom:20, overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:99, background:'var(--green)', width:`${((current + 1) / questions.length) * 100}%`, transition:'width .3s' }} />
                </div>

                {q && (
                    <div style={{ maxWidth:700, margin:'0 auto' }}>
                        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'22px 24px', marginBottom:16, boxShadow:'var(--shadow-sm)' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                                <span className="badge badge-primary">Q {current + 1}</span>
                                <span style={{ fontSize:12, color:'var(--gray-500)' }}>{Object.keys(selected).length} answered</span>
                            </div>
                            <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'var(--black)', marginBottom:18, lineHeight:1.55 }}>{q.question}</h3>
                            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                                {q.options.map((opt, i) => (
                                    <button key={i} className={`qm-opt${selected[q.id] === i ? ' selected' : ''}`}
                                        onClick={() => setSelected(prev => ({ ...prev, [q.id]: i }))}>
                                        <span style={{ width:26, height:26, borderRadius:'50%', background: selected[q.id] === i ? 'var(--green)' : 'var(--gray-100)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color: selected[q.id] === i ? '#fff' : 'var(--gray-500)', flexShrink:0 }}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Prev</button>
                            <div style={{ display:'flex', gap:5 }}>
                                {questions.map((_, i) => (
                                    <button key={i} onClick={() => setCurrent(i)} style={{
                                        width:28, height:28, borderRadius:'50%', border:'none', cursor:'pointer', fontSize:11, fontWeight:700,
                                        background: i === current ? 'var(--green)' : selected[questions[i]?.id] !== undefined ? 'var(--soft-mint)' : 'var(--gray-100)',
                                        color: i === current ? '#fff' : selected[questions[i]?.id] !== undefined ? 'var(--green-dark)' : 'var(--gray-500)',
                                        transition:'all .15s',
                                    }}>{i + 1}</button>
                                ))}
                            </div>
                            {current < questions.length - 1
                                ? <button className="btn btn-primary btn-sm" onClick={() => setCurrent(c => c + 1)}>Next <FiArrowRight size={13} /></button>
                                : <button className="btn btn-success btn-sm" onClick={handleSubmit} disabled={submitting}><FiSend size={13} /> Submit</button>
                            }
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
