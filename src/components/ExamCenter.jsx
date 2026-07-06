import React, { useState, useEffect } from 'react';
import {
  BookOpen, CheckCircle2, XCircle,
  ArrowRight, ArrowLeft, Clock, RotateCcw, Star
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { questionSets, examNotes, examStrategies } from '../data/examQuestions';

// ─── QUIZ ENGINE ─────────────────────────────────────────────────────────────

const QuizEngine = ({ set, onBack }) => {
  const { addXp, updateQuizScore } = useAppContext();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState({});

  const qs = set.questions;
  const current = qs[idx];

  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [finished]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const isCorrect = selected === current.answer;
    if (isCorrect) {
      setScore(s => s + 1);
      addXp(35);
    }
    setAnswers(prev => ({ ...prev, [idx]: { selected, correct: isCorrect } }));
  };

  const handleNext = () => {
    if (idx < qs.length - 1) {
      setIdx(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      const finalScoreStr = score + (selected === current.answer ? 1 : 0);
      const pct = Math.round((finalScoreStr / qs.length) * 100);
      updateQuizScore(set.label, pct);
      setFinished(true);
    }
  };

  if (finished) {
    const finalScore = score;
    const pct = Math.round((finalScore / qs.length) * 100);
    return (
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
        <h2>Quiz Complete!</h2>
        <div style={{ fontSize: '48px', fontWeight: '800', color: pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444', marginBottom: '8px' }}>
          {finalScore}/{qs.length}
        </div>
        <p className="text-muted" style={{ marginBottom: '16px' }}>Score: {pct}% · Time: {formatTime(timer)}</p>
        <p style={{ color: pct >= 80 ? '#10b981' : '#f59e0b', fontWeight: '600', marginBottom: '32px' }}>
          {pct >= 80 ? '🎉 Excellent! You are exam-ready!' : pct >= 50 ? '👍 Good job! Keep practising!' : '💪 Keep going! Review the explanations and try again.'}
        </p>
        
        {/* Answer Review */}
        <div style={{ textAlign: 'left', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>📝 Answer Review & Explanations (விளக்கங்கள்)</h3>
          {qs.map((q, i) => (
            <div key={q.id} style={{ padding: '16px', marginBottom: '12px', borderRadius: '10px', background: answers[i]?.correct ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', borderLeft: `4px solid ${answers[i]?.correct ? '#10b981' : '#ef4444'}` }}>
              <div style={{ fontWeight: '600', marginBottom: '6px', fontSize: '14px', color: 'white' }}>Q{i + 1}: {q.question}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Your answer: <span style={{ color: answers[i]?.correct ? '#10b981' : '#ef4444', fontWeight: '600' }}>{q.options[answers[i]?.selected ?? -1] ?? 'Not answered'}</span>
                {!answers[i]?.correct && <span style={{ marginLeft: '8px', color: '#10b981' }}> | Correct: {q.options[q.answer]}</span>}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', lineHeight: '1.6', borderLeft: '2.5px solid var(--primary-color)' }}>{q.explanation}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={onBack}><ArrowLeft size={16} /> All Exams</button>
          <button className="btn-primary" onClick={() => { setIdx(0); setSelected(null); setSubmitted(false); setScore(0); setTimer(0); setFinished(false); setAnswers({}); }}>
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0 }}>{set.emoji} {set.label}</h2>
          <p className="text-muted" style={{ fontSize: '14px' }}>Question {idx + 1} of {qs.length} · Topic: <strong>{current.topic}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '8px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '18px' }}>
            <Clock size={16} color="var(--accent-color)" /> {formatTime(timer)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', padding: '8px 14px', borderRadius: '8px', color: '#10b981', fontWeight: '700' }}>
            <Star size={16} /> {score}
          </div>
          <button className="btn-secondary" onClick={onBack}>Quit</button>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar-bg" style={{ marginBottom: '28px' }}>
        <div className="progress-bar-fill" style={{ width: `${((idx) / qs.length) * 100}%`, background: set.color }} />
      </div>

      {/* Question Card */}
      <div className="card" style={{ maxWidth: '760px', margin: '0 auto', borderTop: `3px solid ${set.color}` }}>
        <h3 style={{ fontSize: '18px', lineHeight: '1.7', marginBottom: '24px' }}>{current.question}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {current.options.map((opt, i) => {
            let bg = 'var(--surface-color)', border = 'var(--border-color)', textColor = 'var(--text-main)';
            if (submitted) {
              if (i === current.answer) { bg = 'rgba(16,185,129,0.12)'; border = '#10b981'; textColor = '#10b981'; }
              else if (i === selected) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; textColor = '#ef4444'; }
            } else if (i === selected) {
              bg = `${set.color}18`; border = set.color;
            }
            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                style={{
                  padding: '14px 18px', textAlign: 'left', borderRadius: '10px',
                  border: `1.5px solid ${border}`, background: bg, color: textColor,
                  cursor: submitted ? 'default' : 'pointer', transition: 'all 0.2s',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontWeight: i === selected ? '600' : '400', fontSize: '15px'
                }}
              >
                <span><strong style={{ marginRight: '8px', opacity: 0.6 }}>{String.fromCharCode(65 + i)}.</strong>{opt}</span>
                {submitted && i === current.answer && <CheckCircle2 size={18} />}
                {submitted && i === selected && i !== current.answer && <XCircle size={18} />}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '20px', borderLeft: `4px solid var(--primary-color)` }}>
            <div style={{ fontWeight: '700', marginBottom: '6px', color: 'var(--primary-color)' }}>📖 Explanation (விளக்கம்)</div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>{current.explanation}</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Score: {score} / {idx + 1}</span>
          {!submitted ? (
            <button className="btn-primary" disabled={selected === null} onClick={handleSubmit} style={{ opacity: selected === null ? 0.5 : 1 }}>
              Submit Answer
            </button>
          ) : (
            <button className="btn-primary" onClick={handleNext}>
              {idx === qs.length - 1 ? 'See Results' : 'Next Question'} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const ExamCenter = () => {
  const [activeSet, setActiveSet] = useState(null);
  const [activeTab, setActiveTab] = useState('quizzes');
  const [showBookmarkMsg, setShowBookmarkMsg] = useState(null);

  if (activeSet) {
    return <QuizEngine set={questionSets[activeSet]} onBack={() => setActiveSet(null)} />;
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>🎓 Competitive Exam Center</h1>
        <p className="text-muted" style={{ marginTop: '4px' }}>Previous Year Questions (PYQ) with detailed explanations in Tamil & English. Choose your exam and start practising!</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: 'var(--surface-color)', padding: '6px', borderRadius: '12px', width: 'fit-content' }}>
        <button
          onClick={() => setActiveTab('quizzes')}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'quizzes' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'quizzes' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
        >
          📝 Practice Quizzes
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'guide' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'guide' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
        >
          🎯 PYQ Crack Strategy
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'notes' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'notes' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
        >
          📖 Grammar Notes
        </button>
      </div>

      {/* PRACTICE QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {Object.entries(questionSets).map(([key, set]) => (
            <div
              key={key}
              className="card"
              onClick={() => setActiveSet(key)}
              style={{
                cursor: 'pointer', borderLeft: `4px solid ${set.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{set.emoji}</div>
              <h3 style={{ color: set.color, margin: '0 0 8px' }}>{set.label}</h3>
              <p className="text-muted" style={{ fontSize: '13px', marginBottom: '16px' }}>{set.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', background: `${set.color}18`, color: set.color, padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>
                  {set.questions.length} Questions
                </span>
                <span style={{ fontSize: '13px', color: set.color, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Start <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STRATEGY GUIDE TAB */}
      {activeTab === 'guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {examStrategies.map((st, i) => (
            <div key={i} className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
              <h3 style={{ color: 'var(--primary-color)', margin: '0 0 12px 0', fontSize: '16px' }}>{st.title}</h3>
              <p style={{ lineHeight: '1.7', fontSize: '14.5px', marginBottom: '12px' }}>{st.desc}</p>
              <div style={{ padding: '12px', background: 'rgba(0,150,136,0.06)', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                {st.tamil}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GRAMMAR NOTES TAB */}
      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {examNotes.map((n, i) => (
            <div key={i} className="card" style={{ borderTop: '3px solid var(--primary-color)' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '16px' }}>{n.title}</h3>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.9', color: 'var(--text-main)' }}>{n.content}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamCenter;
