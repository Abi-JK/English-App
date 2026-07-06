import React, { useState, useMemo } from 'react';
import { Search, Volume2, Shuffle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { phrasalVerbsData, allBases } from '../data/phrasalVerbs';

// ─── QUIZ COMPONENT ───────────────────────────────────────────────────────────

const QuizMode = ({ verbs, onBack }) => {
  const { addXp } = useAppContext();
  const { speak } = useSpeech();
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const shuffled = useMemo(() => [...verbs].sort(() => Math.random() - 0.5).slice(0, 8), []);

  const current = shuffled[qIndex];

  const getOptions = (correct) => {
    const wrong = verbs.filter(v => v.verb !== correct.verb).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...wrong, correct].sort(() => Math.random() - 0.5);
  };

  const options = useMemo(() => getOptions(current), [qIndex]);

  const handleSelect = (opt) => {
    if (submitted) return;
    setSelected(opt.verb);
    setSubmitted(true);
    if (opt.verb === current.verb) {
      setScore(s => s + 1);
      addXp(20);
    }
  };

  const handleNext = () => {
    if (qIndex < shuffled.length - 1) {
      setQIndex(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((score / shuffled.length) * 100);
    return (
      <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{pct >= 75 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
        <h2>Quiz Complete!</h2>
        <div style={{ fontSize: '48px', fontWeight: '800', color: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444', marginBottom: '8px' }}>
          {score}/{shuffled.length}
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{pct}% accuracy</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={onBack}>← Back</button>
          <button className="btn-primary" onClick={() => { setQIndex(0); setSelected(null); setSubmitted(false); setScore(0); setFinished(false); }}>
            <RotateCcw size={15} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Question {qIndex + 1} / {shuffled.length}</h3>
        <button className="btn-secondary" onClick={onBack}>Quit</button>
      </div>
      <div className="progress-bar-bg" style={{ marginBottom: '24px' }}>
        <div className="progress-bar-fill" style={{ width: `${(qIndex / shuffled.length) * 100}%` }} />
      </div>
      <div className="card" style={{ borderTop: '3px solid var(--primary-color)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>What does this phrasal verb mean?</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>{current.verb}</h2>
          <button onClick={() => speak(current.verb)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <Volume2 size={18} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map((opt, i) => {
            let border = 'var(--border-color)', bg = 'var(--surface-color)', color = 'var(--text-main)';
            if (submitted) {
              if (opt.verb === current.verb) { border = '#10b981'; bg = 'rgba(16,185,129,0.1)'; color = '#10b981'; }
              else if (opt.verb === selected) { border = '#ef4444'; bg = 'rgba(239,68,68,0.1)'; color = '#ef4444'; }
            } else if (opt.verb === selected) { border = 'var(--primary-color)'; bg = 'rgba(0,150,136,0.1)'; }
            return (
              <button key={i} onClick={() => handleSelect(opt)} disabled={submitted}
                style={{ padding: '14px 18px', textAlign: 'left', borderRadius: '10px', border: `1.5px solid ${border}`, background: bg, color, cursor: submitted ? 'default' : 'pointer', transition: 'all 0.2s', fontSize: '14px' }}>
                <strong style={{ opacity: 0.5, marginRight: '8px' }}>{String.fromCharCode(65 + i)}.</strong>
                {opt.meaning}
                {submitted && opt.verb === current.verb && <CheckCircle2 size={16} style={{ float: 'right', marginTop: '2px' }} />}
                {submitted && opt.verb === selected && opt.verb !== current.verb && <XCircle size={16} style={{ float: 'right', marginTop: '2px' }} />}
              </button>
            );
          })}
        </div>
        {submitted && (
          <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(0,150,136,0.06)', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
            <div style={{ fontWeight: '700', color: 'var(--primary-color)', marginBottom: '4px' }}>📖 {current.verb} — {current.meaning}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>🇮🇳 {current.tamil}</div>
            <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{current.example}"</div>
          </div>
        )}
        {submitted && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn-primary" onClick={handleNext}>
              {qIndex === shuffled.length - 1 ? 'See Results' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const PhrasalVerbs = () => {
  const { speak } = useSpeech();
  const [search, setSearch] = useState('');
  const [selectedBase, setSelectedBase] = useState('all');
  const [quizMode, setQuizMode] = useState(false);

  const filtered = useMemo(() => {
    return phrasalVerbsData.filter(v => {
      const matchesBase = selectedBase === 'all' || v.base === selectedBase;
      const matchesSearch = !search || v.verb.toLowerCase().includes(search.toLowerCase()) || v.meaning.toLowerCase().includes(search.toLowerCase());
      return matchesBase && matchesSearch;
    });
  }, [search, selectedBase]);

  if (quizMode) {
    return <QuizMode verbs={phrasalVerbsData} onBack={() => setQuizMode(false)} />;
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>📖 Phrasal Verbs Dictionary</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          {phrasalVerbsData.length}+ phrasal verbs with Tamil meanings, examples & pronunciation. Most common in MNC and daily English!
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search phrasal verb or meaning..."
            style={{ width: '100%', paddingLeft: '38px', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-main)', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {allBases.map(b => (
            <button key={b} onClick={() => setSelectedBase(b)} style={{
              padding: '8px 14px', borderRadius: '20px', border: '1.5px solid',
              borderColor: selectedBase === b ? 'var(--primary-color)' : 'var(--border-color)',
              background: selectedBase === b ? 'var(--primary-color)' : 'transparent',
              color: selectedBase === b ? 'white' : 'var(--text-muted)',
              fontWeight: '600', fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s'
            }}>
              {b === 'all' ? 'All Verbs' : b + '...'}
            </button>
          ))}
        </div>
        <button className="btn-primary" style={{ padding: '9px 18px', whiteSpace: 'nowrap' }} onClick={() => setQuizMode(true)}>
          <Shuffle size={15} /> Quiz Me!
        </button>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
        Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Verb Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
        {filtered.map((v, i) => (
          <div key={i} className="card" style={{ borderLeft: '4px solid var(--primary-color)', margin: 0, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-color)' }}>{v.verb}</span>
                <span style={{ marginLeft: '8px', fontSize: '11px', background: 'rgba(0,150,136,0.12)', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '10px', fontWeight: '600', textTransform: 'capitalize' }}>{v.base}...</span>
              </div>
              <button onClick={() => speak(`${v.verb}. ${v.meaning}. Example: ${v.example}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <Volume2 size={16} />
              </button>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px', fontWeight: '600' }}>{v.meaning}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--primary-color)', marginBottom: '8px', fontWeight: '600' }}>🇮🇳 {v.tamil}</div>
            <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '6px', lineHeight: '1.5' }}>
              "{v.example}"
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Search size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p>No phrasal verbs found for "{search}". Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default PhrasalVerbs;
