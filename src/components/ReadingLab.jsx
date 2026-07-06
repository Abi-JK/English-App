import React, { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, RotateCcw, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { readingPassages } from '../data/readingData';

const getLevelColor = (level) => {
  switch (level) {
    case 'Beginner': return '#10b981';
    case 'Intermediate': return '#f59e0b';
    case 'Advanced': return '#ef4444';
    default: return 'var(--primary-color)';
  }
};

const PassageView = ({ passage, onBack }) => {
  const { addXp } = useAppContext();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = passage.questions[qIdx];
  const isLast = qIdx === passage.questions.length - 1;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === current.answer) {
      setScore(s => s + 1);
      addXp(20);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
    } else {
      setQIdx(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  if (finished) {
    const pct = Math.round((score / passage.questions.length) * 100);
    return (
      <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{pct >= 80 ? '📚🌟' : pct >= 50 ? '👍' : '💪'}</div>
        <h2>Reading Exercise Complete!</h2>
        <div style={{ fontSize: '48px', fontWeight: '800', color: pct >= 80 ? '#10b981' : '#f59e0b', marginBottom: '8px' }}>
          {score}/{passage.questions.length}
        </div>
        <p className="text-muted" style={{ marginBottom: '24px' }}>Score: {pct}%</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={onBack}>← All Passages</button>
          <button className="btn-primary" onClick={() => { setQIdx(0); setSelected(null); setSubmitted(false); setScore(0); setFinished(false); }}>
            <RotateCcw size={15} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0 }}>📖 {passage.title}</h2>
          <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '10px', background: `${getLevelColor(passage.level)}18`, color: getLevelColor(passage.level), fontWeight: '700' }}>
            {passage.level}
          </span>
        </div>
        <button className="btn-secondary" onClick={onBack}>Quit</button>
      </div>

      <div className="progress-bar-bg" style={{ marginBottom: '20px' }}>
        <div className="progress-bar-fill" style={{ width: `${(qIdx / passage.questions.length) * 100}%` }} />
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '20px', borderLeft: '4px solid var(--primary-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <BookOpen size={18} color="var(--primary-color)" />
          <strong style={{ fontSize: '14px' }}>Read the passage below:</strong>
        </div>
        <p style={{ fontSize: '14.5px', lineHeight: '2', color: 'var(--text-main)' }}>{passage.passage}</p>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Question {qIdx + 1} of {passage.questions.length}
        </div>
        <h3 style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>{current.question}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {current.options.map((opt, i) => {
            let bg = 'var(--surface-color)', border = 'var(--border-color)', color = 'var(--text-main)';
            if (submitted) {
              if (i === current.answer) { bg = 'rgba(16,185,129,0.12)'; border = '#10b981'; color = '#10b981'; }
              else if (i === selected) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; color = '#ef4444'; }
            } else if (i === selected) { bg = 'rgba(0,150,136,0.1)'; border = 'var(--primary-color)'; }
            return (
              <button key={i} onClick={() => !submitted && setSelected(i)} disabled={submitted}
                style={{ padding: '12px 16px', textAlign: 'left', borderRadius: '8px', border: `1.5px solid ${border}`, background: bg, color, cursor: submitted ? 'default' : 'pointer', transition: 'all 0.2s', fontSize: '14px', fontWeight: i === selected ? '600' : '400' }}>
                <strong style={{ opacity: 0.5, marginRight: '8px' }}>{String.fromCharCode(65 + i)}.</strong>{opt}
                {submitted && i === current.answer && <CheckCircle2 size={16} style={{ float: 'right' }} />}
                {submitted && i === selected && i !== current.answer && <XCircle size={16} style={{ float: 'right' }} />}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!submitted ? (
            <button className="btn-primary" disabled={selected === null} onClick={handleSubmit}>
              Submit Answer
            </button>
          ) : (
            <button className="btn-primary" onClick={handleNext}>
              {isLast ? 'See Results' : 'Next Question'} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ReadingLab = () => {
  const [activePassage, setActivePassage] = useState(null);

  if (activePassage) {
    return <PassageView passage={activePassage} onBack={() => setActivePassage(null)} />;
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>📖 Reading Lab</h1>
        <p className="text-muted" style={{ marginTop: '4px' }}>
          Read passages and test your comprehension. Topics range from science to Indian culture and current affairs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {readingPassages.map(p => (
          <div key={p.id} className="card"
            onClick={() => setActivePassage(p)}
            style={{ cursor: 'pointer', borderTop: `3px solid ${getLevelColor(p.level)}`, transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📖</div>
            <h3 style={{ margin: '0 0 6px' }}>{p.title}</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', background: `${getLevelColor(p.level)}18`, color: getLevelColor(p.level), fontWeight: '700' }}>
                {p.level}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.questions.length} questions</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
              {p.passage.slice(0, 100)}...
            </p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '28px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 6px' }}>💡 Reading Tip</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0, lineHeight: '1.7' }}>
          For competitive exams, practice reading comprehension daily. Start by skimming the passage, then read the questions, and finally scan for answers. Regular practice improves speed and accuracy.
        </p>
      </div>
    </div>
  );
};

export default ReadingLab;
