import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { FiPlay, FiSend, FiAward, FiClock, FiCode, FiList, FiArrowRight } from 'react-icons/fi';

const problems = [
    {
        id: 1, title: 'Two Sum', difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
        ],
        constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
        points: 100,
    },
    {
        id: 2, title: 'Reverse Linked List', difficulty: 'Medium',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        examples: [
            { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
        ],
        constraints: ['0 ≤ nodes ≤ 5000', '-5000 ≤ node.val ≤ 5000'],
        points: 200,
    },
    {
        id: 3, title: 'Longest Common Subsequence', difficulty: 'Hard',
        description: 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
        examples: [
            { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'The longest common subsequence is "ace" with length 3.' },
        ],
        constraints: ['1 ≤ text1.length, text2.length ≤ 1000'],
        points: 300,
    },
];

const leaderboard = [
    { rank: 1, name: 'Priya Patel', score: 580, time: '42:15', college: 'CS-4A' },
    { rank: 2, name: 'Arjun Mehta', score: 520, time: '48:33', college: 'CS-4B' },
    { rank: 3, name: 'Sneha Reddy', score: 480, time: '51:10', college: 'IT-4A' },
    { rank: 4, name: 'Rahul Sharma', score: 380, time: '55:22', college: 'CS-4A', isYou: true },
    { rank: 5, name: 'Kavya Singh', score: 300, time: '58:01', college: 'IT-4B' },
];

const TOTAL_TIME = 90 * 60; // 90 minutes

export default function CodingCompetition() {
    const [view, setView] = useState('home'); // home | contest | leaderboard
    const [selectedProblem, setSelectedProblem] = useState(problems[0]);
    const [code, setCode] = useState('# Write your solution here\n\ndef solution():\n    pass\n');
    const [submitted, setSubmitted] = useState({});
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [running, setRunning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (running && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [running, timeLeft]);

    const startContest = () => { setView('contest'); setRunning(true); };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const handleSubmit = () => {
        setSubmitted(prev => ({ ...prev, [selectedProblem.id]: true }));
    };

    const diffColor = { Easy: 'badge-success', Medium: 'badge-warning', Hard: 'badge-danger' };

    if (view === 'home') return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: 'Rahul Sharma', roll: 'Roll: 21CS047' }} />
            <main className="dashboard-main">
                <div className="page-header">
                    <h1 className="page-title">Coding Competition</h1>
                    <p className="page-subtitle">Test your problem-solving skills in timed coding challenges</p>
                </div>

                {/* Active Contest Card */}
                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(168,85,247,0.1) 100%)', borderColor: 'rgba(108,99,255,0.3)', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 28 }}>💻</span>
                                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>College Coding Contest #12</h2>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12 }}>3 Problems • 90 Minutes • Total 600 Points</p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                <span className="badge badge-success">🟢 Live Now</span>
                                <span className="badge badge-muted">248 Participants</span>
                                <span className="badge badge-warning">Ends: Feb 28, 11:59 PM</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-primary btn-lg" onClick={startContest}><FiPlay /> Start Competition</button>
                            <button className="btn btn-secondary" onClick={() => setView('leaderboard')}><FiAward /> Leaderboard</button>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="table-container">
                    <div className="table-header-bar">
                        <span className="table-title">Problem Set</span>
                        <span className="badge badge-primary">3 Problems</span>
                    </div>
                    <table>
                        <thead>
                            <tr><th>#</th><th>Title</th><th>Difficulty</th><th>Points</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {problems.map(p => (
                                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedProblem(p); startContest(); }}>
                                    <td style={{ color: 'var(--text-muted)', fontWeight: 700 }}>P{p.id}</td>
                                    <td><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</span></td>
                                    <td><span className={`badge ${diffColor[p.difficulty]}`}>{p.difficulty}</span></td>
                                    <td><span style={{ color: 'var(--accent2)', fontWeight: 700 }}>+{p.points}</span></td>
                                    <td>{submitted[p.id] ? <span className="badge badge-success">✓ Solved</span> : <span className="badge badge-muted">Unsolved</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );

    if (view === 'leaderboard') return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: 'Rahul Sharma', roll: 'Roll: 21CS047' }} />
            <main className="dashboard-main">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Leaderboard</h1>
                        <p className="page-subtitle">College Coding Contest #12 — Live Rankings</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setView('home')}><FiList /> Back to Problems</button>
                </div>
                <div className="table-container">
                    <div className="table-header-bar">
                        <span className="table-title">🏆 Top Rankings</span>
                        <span className="badge badge-success">🟢 Live</span>
                    </div>
                    <table>
                        <thead><tr><th>Rank</th><th>Student</th><th>Section</th><th>Score</th><th>Time</th></tr></thead>
                        <tbody>
                            {leaderboard.map(s => (
                                <tr key={s.rank} style={{ background: s.isYou ? 'rgba(108,99,255,0.08)' : undefined }}>
                                    <td>
                                        <div className={`rank-badge ${s.rank === 1 ? 'rank-1' : s.rank === 2 ? 'rank-2' : s.rank === 3 ? 'rank-3' : 'rank-other'}`}>
                                            {s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : s.rank}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: s.isYou ? 'var(--primary-light)' : 'var(--text-primary)' }}>
                                            {s.name} {s.isYou && <span className="badge badge-primary" style={{ fontSize: 10 }}>You</span>}
                                        </span>
                                    </td>
                                    <td>{s.college}</td>
                                    <td><span style={{ fontWeight: 800, color: 'var(--accent2)', fontSize: 15 }}>{s.score}</span></td>
                                    <td style={{ color: 'var(--text-muted)' }}>{s.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );

    // Contest view
    return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: 'Rahul Sharma', roll: 'Roll: 21CS047' }} />
            <main className="dashboard-main">
                {/* Top Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {problems.map(p => (
                            <button key={p.id} onClick={() => setSelectedProblem(p)} className={`btn btn-sm ${selectedProblem.id === p.id ? 'btn-primary' : 'btn-secondary'}`} style={{ position: 'relative' }}>
                                P{p.id}: {p.title}
                                {submitted[p.id] && <span style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, background: 'var(--secondary)', borderRadius: '50%', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className={`timer-display ${timeLeft < 600 ? 'danger' : ''}`}>⏱ {formatTime(timeLeft)}</div>
                        <button className="btn btn-secondary btn-sm" onClick={() => setView('leaderboard')}><FiAward /> Board</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setView('home')}>Exit</button>
                    </div>
                </div>

                <div className="grid-2" style={{ gap: 20, alignItems: 'start' }}>
                    {/* Problem Description */}
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, flex: 1 }}>{selectedProblem.title}</h3>
                            <span className={`badge ${diffColor[selectedProblem.difficulty]}`}>{selectedProblem.difficulty}</span>
                            <span style={{ color: 'var(--accent2)', fontWeight: 800, fontSize: 15 }}>+{selectedProblem.points} pts</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>{selectedProblem.description}</p>
                        <h4 style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Examples</h4>
                        {selectedProblem.examples.map((ex, i) => (
                            <div key={i} style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
                                <div style={{ fontSize: 13, fontFamily: 'monospace' }}>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Input: <span style={{ color: 'var(--text-primary)' }}>{ex.input}</span></div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: ex.explanation ? 4 : 0 }}>Output: <span style={{ color: 'var(--secondary)' }}>{ex.output}</span></div>
                                    {ex.explanation && <div style={{ color: 'var(--text-muted)' }}>Explanation: <span style={{ color: 'var(--text-secondary)' }}>{ex.explanation}</span></div>}
                                </div>
                            </div>
                        ))}
                        <h4 style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 16 }}>Constraints</h4>
                        {selectedProblem.constraints.map((c, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>• {c}</div>)}
                    </div>

                    {/* Code Editor */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700 }}>Code Editor</h3>
                            <select className="form-select" style={{ width: 120 }}>
                                <option>Python</option><option>Java</option><option>C++</option><option>JavaScript</option>
                            </select>
                        </div>
                        <textarea
                            className="code-editor"
                            value={submitted[selectedProblem.id] ? `# ✅ Solution submitted for ${selectedProblem.title}!\n\n${code}` : code}
                            onChange={e => setCode(e.target.value)}
                            spellCheck={false}
                            disabled={submitted[selectedProblem.id]}
                            style={{ minHeight: 350 }}
                        />
                        {submitted[selectedProblem.id] ? (
                            <div style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                                <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: 15 }}>✅ Solution Submitted! +{selectedProblem.points} Points</span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSubmit}><FiSend /> Submit Code</button>
                                <button className="btn btn-secondary"><FiPlay /> Run Test</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
