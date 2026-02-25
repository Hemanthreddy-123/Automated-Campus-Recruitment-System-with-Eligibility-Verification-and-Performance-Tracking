import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { FiPlay, FiSend, FiArrowRight, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const quizBank = [
    { id: 1, question: 'What is the time complexity of Binary Search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 1, explanation: 'Binary search divides the search space in half each step, giving O(log n) time complexity.' },
    { id: 2, question: 'Which data structure uses LIFO (Last In First Out) principle?', options: ['Queue', 'Tree', 'Stack', 'Heap'], answer: 2, explanation: 'Stack follows LIFO — the last element pushed is the first to be popped.' },
    { id: 3, question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Library'], answer: 0, explanation: 'SQL stands for Structured Query Language, used to manage relational databases.' },
    { id: 4, question: 'Which sorting algorithm has the best average case time complexity?', options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Merge Sort'], answer: 3, explanation: 'Merge Sort guarantees O(n log n) in all cases, making it consistently efficient.' },
    { id: 5, question: 'What is the output of: print(type(3.14)) in Python?', options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'decimal'>"], answer: 1, explanation: "3.14 is a floating-point number in Python, so its type is 'float'." },
    { id: 6, question: 'In OSI model, which layer handles routing?', options: ['Data Link Layer', 'Transport Layer', 'Network Layer', 'Session Layer'], answer: 2, explanation: 'The Network Layer (Layer 3) is responsible for logical addressing and routing.' },
    { id: 7, question: 'What is a Foreign Key in a relational database?', options: ['Primary key of the same table', 'A key that references the primary key of another table', 'A unique identifier', 'An indexed column'], answer: 1, explanation: 'A Foreign Key is a column that references the primary key of another table, creating a relationship.' },
    { id: 8, question: 'Which OOP concept allows a class to inherit properties from multiple classes?', options: ['Encapsulation', 'Polymorphism', 'Multiple Inheritance', 'Abstraction'], answer: 2, explanation: 'Multiple Inheritance allows a class to derive from more than one parent class.' },
    { id: 9, question: 'What is the worst-case space complexity of Quick Sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, explanation: 'In the worst case, Quick Sort recursion depth can be O(n), requiring O(n) stack space.' },
    { id: 10, question: 'Which HTTP method is used to UPDATE a resource?', options: ['GET', 'POST', 'DELETE', 'PUT'], answer: 3, explanation: 'PUT is used to completely replace/update an existing resource in REST APIs.' },
];

const QUIZ_TIME = 15 * 60; // 15 minutes

export default function QuizModule() {
    const [view, setView] = useState('home'); // home | quiz | result
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState({});
    const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
    const [submitted, setSubmitted] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (view === 'quiz' && !submitted && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { handleSubmit(); return 0; } return t - 1; }), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [view, submitted]);

    const handleSubmit = () => {
        clearInterval(timerRef.current);
        setSubmitted(true);
        setView('result');
    };

    const score = quizBank.filter(q => selected[q.id] === q.answer).length;

    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const q = quizBank[current];

    if (view === 'home') return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: 'Rahul Sharma', roll: 'Roll: 21CS047' }} />
            <main className="dashboard-main">
                <div className="page-header">
                    <h1 className="page-title">Quiz Module</h1>
                    <p className="page-subtitle">Test your knowledge with timed multiple-choice questions</p>
                </div>

                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    {/* Quiz Info Card */}
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1) 0%, rgba(0,151,167,0.05) 100%)', borderColor: 'rgba(0,212,170,0.3)', marginBottom: 24, textAlign: 'center', padding: 48 }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>📝</div>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Technical Aptitude Quiz</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Topics: Data Structures, Algorithms, DBMS, OOP, Networking</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32 }}>
                            {[
                                { icon: '📊', label: 'Questions', value: '10' },
                                { icon: '⏱', label: 'Duration', value: '15 mins' },
                                { icon: '🎯', label: 'Pass Score', value: '60%' },
                                { icon: '⭐', label: 'Max Score', value: '100 pts' },
                            ].map((info, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, marginBottom: 6 }}>{info.icon}</div>
                                    <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>{info.value}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{info.label}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.2)', borderRadius: 10, padding: 14, marginBottom: 28, fontSize: 13, color: 'var(--accent2)', textAlign: 'left' }}>
                            ⚠ <strong>Note:</strong> Once started, the quiz timer cannot be paused. Each question has only one correct answer.
                        </div>
                        <button className="btn btn-success btn-lg" onClick={() => setView('quiz')}><FiPlay /> Start Quiz</button>
                    </div>

                    {/* Past Quiz Results */}
                    <div className="table-container">
                        <div className="table-header-bar"><span className="table-title">Past Quiz History</span></div>
                        <table>
                            <thead><tr><th>Quiz Name</th><th>Date</th><th>Score</th><th>Result</th></tr></thead>
                            <tbody>
                                {[
                                    { name: 'Core Java Quiz', date: 'Feb 10', score: '85%', pass: true },
                                    { name: 'Aptitude Test #3', date: 'Feb 5', score: '72%', pass: true },
                                    { name: 'DBMS Concepts', date: 'Jan 25', score: '55%', pass: false },
                                ].map((r, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</td>
                                        <td>{r.date}</td>
                                        <td style={{ fontWeight: 700, color: r.pass ? 'var(--secondary)' : 'var(--accent)' }}>{r.score}</td>
                                        <td><span className={`badge ${r.pass ? 'badge-success' : 'badge-danger'}`}>{r.pass ? 'Pass' : 'Fail'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );

    if (view === 'result') return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: 'Rahul Sharma', roll: 'Roll: 21CS047' }} />
            <main className="dashboard-main">
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    {/* Score Banner */}
                    <div className="card" style={{ textAlign: 'center', padding: 48, marginBottom: 24, background: score >= 6 ? 'linear-gradient(135deg, rgba(0,212,170,0.12) 0%, rgba(0,151,167,0.05) 100%)' : 'linear-gradient(135deg, rgba(255,101,132,0.12) 0%, rgba(255,142,83,0.05) 100%)' }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>{score >= 6 ? '🏆' : '😔'}</div>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
                            Quiz Completed!
                        </h2>
                        <div style={{ fontSize: 56, fontWeight: 900, background: score >= 6 ? 'var(--gradient-secondary)' : 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '10px 0' }}>
                            {score * 10}/100
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 20 }}>
                            You answered <strong style={{ color: 'var(--text-primary)' }}>{score} out of {quizBank.length}</strong> questions correctly
                        </p>
                        <span className={`badge ${score >= 6 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 15, padding: '8px 24px' }}>
                            {score >= 6 ? '✅ PASSED' : '❌ FAILED'}
                        </span>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                            <button className="btn btn-primary" onClick={() => { setView('home'); setSelected({}); setCurrent(0); setTimeLeft(QUIZ_TIME); setSubmitted(false); }}><FiPlay /> Retake Quiz</button>
                            <button className="btn btn-secondary" onClick={() => setView('review')}>Review Answers <FiArrowRight /></button>
                        </div>
                    </div>

                    {/* Answer Review */}
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Answer Review</h3>
                    {quizBank.map((q, i) => {
                        const userAns = selected[q.id];
                        const isCorrect = userAns === q.answer;
                        return (
                            <div key={q.id} className="card" style={{ marginBottom: 12, borderColor: isCorrect ? 'rgba(0,212,170,0.3)' : 'rgba(255,101,132,0.3)' }}>
                                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                    <span style={{ fontSize: 20 }}>{isCorrect ? <FiCheckCircle style={{ color: 'var(--secondary)' }} /> : <FiXCircle style={{ color: 'var(--accent)' }} />}</span>
                                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>Q{i + 1}. {q.question}</p>
                                </div>
                                <div style={{ paddingLeft: 32 }}>
                                    {q.options.map((opt, oi) => (
                                        <div key={oi} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, marginBottom: 4, background: oi === q.answer ? 'rgba(0,212,170,0.1)' : oi === userAns && !isCorrect ? 'rgba(255,101,132,0.1)' : 'transparent', color: oi === q.answer ? 'var(--secondary)' : oi === userAns && !isCorrect ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: oi === q.answer ? 700 : 400 }}>
                                            {oi === q.answer ? '✓ ' : oi === userAns && !isCorrect ? '✗ ' : '  '}{opt}
                                        </div>
                                    ))}
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, fontStyle: 'italic' }}>💡 {q.explanation}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );

    // Active Quiz
    return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: 'Rahul Sharma', roll: 'Roll: 21CS047' }} />
            <main className="dashboard-main">
                {/* Progress Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 className="page-title">Technical Aptitude Quiz</h1>
                        <p className="page-subtitle">Question {current + 1} of {quizBank.length}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className={`timer-display ${timeLeft < 120 ? 'danger' : ''}`}><FiClock style={{ marginRight: 8 }} />{formatTime(timeLeft)}</div>
                        <button className="btn btn-danger btn-sm" onClick={handleSubmit}><FiSend /> Submit Quiz</button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container" style={{ marginBottom: 24 }}>
                    <div className="progress-bar-fill" style={{ width: `${((current + 1) / quizBank.length) * 100}%` }} />
                </div>

                {/* Question Card */}
                <div style={{ maxWidth: 760, margin: '0 auto' }}>
                    <div className="card" style={{ padding: 36, marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <span className="badge badge-primary">Q {current + 1}</span>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                {Object.keys(selected).length} answered
                            </span>
                        </div>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 28, lineHeight: 1.5 }}>
                            {q.question}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {q.options.map((opt, i) => (
                                <button key={i} onClick={() => setSelected(prev => ({ ...prev, [q.id]: i }))} style={{
                                    background: selected[q.id] === i ? 'rgba(108,99,255,0.2)' : 'var(--bg-card2)',
                                    border: `2px solid ${selected[q.id] === i ? 'var(--primary)' : 'var(--border)'}`,
                                    borderRadius: 12, padding: '14px 20px', textAlign: 'left', cursor: 'pointer', color: selected[q.id] === i ? 'var(--primary-light)' : 'var(--text-secondary)',
                                    fontWeight: selected[q.id] === i ? 700 : 400, fontSize: 14, transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 14,
                                }}>
                                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: selected[q.id] === i ? 'var(--primary)' : 'var(--bg-card3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: selected[q.id] === i ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="btn btn-outline" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Previous</button>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {quizBank.map((_, i) => (
                                <button key={i} onClick={() => setCurrent(i)} style={{
                                    width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                                    background: i === current ? 'var(--primary)' : selected[quizBank[i].id] !== undefined ? 'rgba(0,212,170,0.3)' : 'var(--bg-card2)',
                                    color: i === current ? 'white' : selected[quizBank[i].id] !== undefined ? 'var(--secondary)' : 'var(--text-muted)',
                                    transition: 'all 0.2s'
                                }}>{i + 1}</button>
                            ))}
                        </div>
                        {current < quizBank.length - 1 ? (
                            <button className="btn btn-primary" onClick={() => setCurrent(c => Math.min(quizBank.length - 1, c + 1))}>Next <FiArrowRight /></button>
                        ) : (
                            <button className="btn btn-success" onClick={handleSubmit}><FiSend /> Submit Quiz</button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
