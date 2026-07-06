import React, { useState, useEffect } from 'react';
import { Headphones, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, BarChart3, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { listeningExercises } from '../data/listeningData';

const getLevelColor = (level) => {
  switch (level) {
    case 'Beginner': return '#10b981';
    case 'Intermediate': return '#f59e0b';
    case 'Advanced': return '#ef4444';
    default: return 'var(--primary-color)';
  }
};

const ExerciseView = ({ exercise, onBack }) => {
  const { addXp } = useAppContext();
  const { speak } = useSpeech();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [listened, setListened] = useState(false);
  const [showPassage, setShowPassage] = useState(false);

  const current = exercise.questions[qIdx];
  const isLast = qIdx === exercise.questions.length - 1;

  const handleListen = () => {
    speak(exercise.passage, 0.8);
    setListened(true);
  };

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
    const pct = Math.round((score / exercise.questions.length) * 100);
    return (
      <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{pct >= 80 ? '🎧🌟' : pct >= 50 ? '👍' : '💪'}</div>
        <h2>Listening Exercise Complete!</h2>
        <div style={{ fontSize: '48px', fontWeight: '800', color: pct >= 80 ? '#10b981' : '#f59e0b', marginBottom: '8px' }}>
          {score}/{exercise.questions.length}
        </div>
        <p className="text-muted" style={{ marginBottom: '24px' }}>Score: {pct}%</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={onBack}>← All Exercises</button>
          <button className="btn-primary" onClick={() => { setQIdx(0); setSelected(null); setSubmitted(false); setScore(0); setFinished(false); setListened(false); }}>
            <RotateCcw size={15} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0 }}>🎧 {exercise.title}</h2>
        <button className="btn-secondary" onClick={onBack}>Quit</button>
      </div>

      <div className="progress-bar-bg" style={{ marginBottom: '20px' }}>
        <div className="progress-bar-fill" style={{ width: `${(qIdx / exercise.questions.length) * 100}%` }} />
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '20px', borderTop: `3px solid ${getLevelColor(exercise.level)}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: `${getLevelColor(exercise.level)}18`, color: getLevelColor(exercise.level), fontWeight: '700' }}>
            {exercise.level}
          </span>
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={handleListen}>
            <Volume2 size={16} /> {listened ? '🔊 Listen Again' : '▶ Listen'}
          </button>
        </div>

        {!showPassage ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
            💡 Listen to the audio carefully, then answer the questions below.
            <button onClick={() => setShowPassage(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginLeft: '6px', textDecoration: 'underline', fontSize: '13px' }}>
              Show passage text
            </button>
          </p>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', lineHeight: '1.8', color: 'var(--text-main)', marginBottom: '8px' }}>
            <BookOpen size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            {exercise.passage}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Question {qIdx + 1} of {exercise.questions.length}
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

const ListeningLab = () => {
  const [activeExercise, setActiveExercise] = useState(null);

  if (activeExercise) {
    return <ExerciseView exercise={activeExercise} onBack={() => setActiveExercise(null)} />;
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>🎧 Listening Lab</h1>
        <p className="text-muted" style={{ marginTop: '4px' }}>
          Improve your listening comprehension with audio passages. Listen carefully and answer the questions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {listeningExercises.map(ex => (
          <div key={ex.id} className="card"
            onClick={() => setActiveExercise(ex)}
            style={{ cursor: 'pointer', borderTop: `3px solid ${getLevelColor(ex.level)}`, transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎧</div>
            <h3 style={{ margin: '0 0 6px' }}>{ex.title}</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', background: `${getLevelColor(ex.level)}18`, color: getLevelColor(ex.level), fontWeight: '700' }}>
                {ex.level}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ex.questions.length} questions</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
              {ex.passage.slice(0, 100)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningLab;
