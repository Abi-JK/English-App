import React, { useState, useEffect, useMemo } from 'react';
import { Gamepad2, RotateCcw, Trophy, Clock, Zap, ArrowRight, Volume2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { wordBank } from '../data/vocabulary';
import { useSpeech } from '../hooks/useSpeech';

// ─── GAME 1: WORD MATCH ───────────────────────────────────────────────────────

const WordMatch = ({ onExit, onPlayAgain }) => {
  const { addXp } = useAppContext();
  const { speak } = useSpeech();
  const PAIRS = 6;
  const pool = useMemo(() => [...wordBank].sort(() => Math.random() - 0.5).slice(0, PAIRS), []);

  const tiles = useMemo(() => {
    const words = pool.map((w, i) => ({ id: `w${i}`, text: w.word, pairId: i, type: 'word' }));
    const meanings = pool.map((w, i) => ({ id: `m${i}`, text: w.meaning, pairId: i, type: 'meaning' }));
    return [...words, ...meanings].sort(() => Math.random() - 0.5);
  }, [pool]);

  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [finished]);

  useEffect(() => {
    if (matched.length === PAIRS * 2) {
      setFinished(true);
      addXp(50);
    }
  }, [matched]);

  const handleSelect = (tile) => {
    if (matched.includes(tile.id) || wrong.includes(tile.id) || selected.includes(tile.id)) return;
    const newSelected = [...selected, tile.id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [id1, id2] = newSelected;
      const t1 = tiles.find(t => t.id === id1);
      const t2 = tiles.find(t => t.id === id2);
      if (t1.pairId === t2.pairId && t1.type !== t2.type) {
        setMatched(prev => [...prev, id1, id2]);
        setSelected([]);
      } else {
        setWrong([id1, id2]);
        setTimeout(() => { setWrong([]); setSelected([]); }, 900);
      }
    }
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (finished) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🎉</div>
        <h2>All Matched!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Time: {fmt(timer)} · Moves: {moves} · +50 XP earned!</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <button className="btn-secondary" onClick={onExit}>← Games Menu</button>
          <button className="btn-primary" onClick={onPlayAgain}><RotateCcw size={14} /> Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>🔗 Word Match — Match word to meaning!</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}><Clock size={14} style={{ verticalAlign: 'middle' }} /> {fmt(timer)}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Moves: {moves}</span>
          <span style={{ fontSize: '13px', color: '#10b981' }}>✓ {matched.length / 2}/{PAIRS}</span>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onExit}>Quit</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {tiles.map(tile => {
          const isMatched = matched.includes(tile.id);
          const isSelected = selected.includes(tile.id);
          const isWrong = wrong.includes(tile.id);
          return (
            <button key={tile.id} onClick={() => handleSelect(tile)} disabled={isMatched}
              style={{
                padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                borderColor: isMatched ? '#10b981' : isWrong ? '#ef4444' : isSelected ? 'var(--primary-color)' : 'var(--border-color)',
                background: isMatched ? 'rgba(16,185,129,0.12)' : isWrong ? 'rgba(239,68,68,0.12)' : isSelected ? 'rgba(0,150,136,0.12)' : 'var(--surface-color)',
                color: isMatched ? '#10b981' : 'var(--text-main)',
                cursor: isMatched ? 'default' : 'pointer', fontSize: '13px', textAlign: 'left',
                transition: 'all 0.2s', fontWeight: tile.type === 'word' ? '700' : '400',
                minHeight: '70px', display: 'flex', alignItems: 'center',
                textDecoration: isMatched ? 'line-through' : 'none', opacity: isMatched ? 0.6 : 1,
              }}>
              {tile.text}
            </button>
          );
        })}
      </div>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', marginTop: '16px' }}>
        💡 Tap a word, then tap its matching meaning to connect them!
      </p>
    </div>
  );
};

// ─── GAME 2: HANGMAN ──────────────────────────────────────────────────────────

const Hangman = ({ onExit }) => {
  const { addXp } = useAppContext();
  const { speak } = useSpeech();
  const [wordIndex, setWordIndex] = useState(() => Math.floor(Math.random() * wordBank.length));
  const [guessed, setGuessed] = useState(new Set());
  const [wrong, setWrong] = useState(0);
  const MAX_WRONG = 6;

  const current = wordBank[wordIndex];
  const word = current.word.toUpperCase();

  const isWon = [...word].every(c => c === ' ' || guessed.has(c));
  const isLost = wrong >= MAX_WRONG;

  useEffect(() => {
    if (isWon) addXp(40);
  }, [isWon]);

  const handleGuess = (letter) => {
    if (guessed.has(letter) || isWon || isLost) return;
    const newGuessed = new Set([...guessed, letter]);
    setGuessed(newGuessed);
    if (!word.includes(letter)) setWrong(w => w + 1);
  };

  const nextWord = () => {
    setWordIndex(Math.floor(Math.random() * wordBank.length));
    setGuessed(new Set());
    setWrong(0);
  };

  const hangmanParts = [
    // head, body, left arm, right arm, left leg, right leg
    <circle key="head" cx="100" cy="30" r="12" stroke="var(--text-main)" strokeWidth="3" fill="none" />,
    <line key="body" x1="100" y1="42" x2="100" y2="80" stroke="var(--text-main)" strokeWidth="3" />,
    <line key="larm" x1="100" y1="55" x2="78" y2="68" stroke="var(--text-main)" strokeWidth="3" />,
    <line key="rarm" x1="100" y1="55" x2="122" y2="68" stroke="var(--text-main)" strokeWidth="3" />,
    <line key="lleg" x1="100" y1="80" x2="80" y2="105" stroke="var(--text-main)" strokeWidth="3" />,
    <line key="rleg" x1="100" y1="80" x2="120" y2="105" stroke="var(--text-main)" strokeWidth="3" />,
  ];

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>🪢 Hangman — Guess the English word!</h3>
        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onExit}>Quit</button>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
        {/* Gallows */}
        <div>
          <svg width="200" height="130" style={{ display: 'block' }}>
            <line x1="20" y1="125" x2="180" y2="125" stroke="var(--text-muted)" strokeWidth="3" />
            <line x1="60" y1="125" x2="60" y2="10" stroke="var(--text-muted)" strokeWidth="3" />
            <line x1="60" y1="10" x2="100" y2="10" stroke="var(--text-muted)" strokeWidth="3" />
            <line x1="100" y1="10" x2="100" y2="18" stroke="var(--text-muted)" strokeWidth="3" />
            {hangmanParts.slice(0, wrong)}
          </svg>
          <div style={{ textAlign: 'center', color: wrong >= MAX_WRONG ? '#ef4444' : '#f59e0b', fontSize: '13px', fontWeight: '700' }}>
            {wrong}/{MAX_WRONG} wrong guesses
          </div>
        </div>

        {/* Word + Hint */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          {/* Hint */}
          <div style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: 'var(--text-muted)', borderLeft: '3px solid #6366f1' }}>
            💡 Hint: {current.hint} | 🇮🇳 {current.tamil}
          </div>

          {/* Word display */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', justifyContent: 'center' }}>
            {[...word].map((ch, i) => (
              <div key={i} style={{ width: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: isLost && !guessed.has(ch) ? '#ef4444' : 'var(--primary-color)', minHeight: '28px' }}>
                  {ch === ' ' ? ' ' : guessed.has(ch) ? ch : isLost ? ch : '_'}
                </div>
                {ch !== ' ' && <div style={{ height: '2px', background: 'var(--border-color)', marginTop: '4px' }} />}
              </div>
            ))}
          </div>

          {(isWon || isLost) && (
            <div style={{ textAlign: 'center', padding: '16px', marginBottom: '16px', background: isWon ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: '10px', border: `1px solid ${isWon ? '#10b981' : '#ef4444'}` }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{isWon ? '🎉' : '😢'}</div>
              <div style={{ fontWeight: '700', color: isWon ? '#10b981' : '#ef4444' }}>
                {isWon ? `+40 XP! You got it!` : `The word was: ${word}`}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{current.meaning}</div>
              <button className="btn-primary" style={{ marginTop: '12px', padding: '8px 20px' }} onClick={nextWord}>
                Next Word →
              </button>
            </div>
          )}

          {/* Keyboard */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            {letters.map(l => (
              <button key={l} onClick={() => handleGuess(l)} disabled={guessed.has(l) || isWon || isLost}
                style={{
                  width: '36px', height: '36px', borderRadius: '6px', border: '1.5px solid',
                  borderColor: guessed.has(l) ? (word.includes(l) ? '#10b981' : '#ef4444') : 'var(--border-color)',
                  background: guessed.has(l) ? (word.includes(l) ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)') : 'var(--surface-color)',
                  color: guessed.has(l) ? (word.includes(l) ? '#10b981' : '#ef4444') : 'var(--text-main)',
                  cursor: guessed.has(l) || isWon || isLost ? 'default' : 'pointer',
                  fontSize: '13px', fontWeight: '700', transition: 'all 0.15s',
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── GAME 3: FLASHCARD BLITZ ───────────────────────────────────────────────────

const FlashcardBlitz = ({ onExit, onPlayAgain }) => {
  const { addXp } = useAppContext();
  const { speak } = useSpeech();
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ knew: 0, learn: 0 });
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(0);

  const shuffled = useMemo(() => [...wordBank].sort(() => Math.random() - 0.5).slice(0, 10), []);
  const current = shuffled[cardIndex];

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [finished]);

  const handleKnew = () => {
    setScore(s => ({ ...s, knew: s.knew + 1 }));
    addXp(15);
    advance();
  };

  const handleLearn = () => {
    setScore(s => ({ ...s, learn: s.learn + 1 }));
    advance();
  };

  const advance = () => {
    if (cardIndex < shuffled.length - 1) {
      setCardIndex(i => i + 1);
      setFlipped(false);
    } else {
      setFinished(true);
    }
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (finished) {
    const total = score.knew + score.learn;
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>{score.knew >= 7 ? '🌟' : score.knew >= 5 ? '💪' : '📚'}</div>
        <h2>Blitz Complete!</h2>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', margin: '20px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981' }}>{score.knew}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>✅ I Knew It</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#f59e0b' }}>{score.learn}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📖 Need to Learn</div>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Time: {fmt(timer)} · XP earned: +{score.knew * 15}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <button className="btn-secondary" onClick={onExit}>← Games Menu</button>
          <button className="btn-primary" onClick={onPlayAgain}><RotateCcw size={14} /> Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>⚡ Flashcard Blitz — Know it or learn it?</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{cardIndex + 1} / {shuffled.length}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{fmt(timer)}</span>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onExit}>Quit</button>
        </div>
      </div>

      <div className="progress-bar-bg" style={{ marginBottom: '28px' }}>
        <div className="progress-bar-fill" style={{ width: `${(cardIndex / shuffled.length) * 100}%` }} />
      </div>

      {/* Flip Card */}
      <div onClick={() => setFlipped(!flipped)} style={{
        maxWidth: '500px', margin: '0 auto 24px', cursor: 'pointer',
        minHeight: '200px', borderRadius: '20px',
        background: flipped ? 'linear-gradient(135deg, rgba(0,150,136,0.15), rgba(99,102,241,0.15))' : 'var(--surface-color)',
        border: `2px solid ${flipped ? 'var(--primary-color)' : 'var(--border-color)'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', textAlign: 'center', transition: 'all 0.35s', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
          {flipped ? 'MEANING' : 'WORD — Tap to reveal'}
        </div>

        {!flipped ? (
          <>
            <h2 style={{ fontSize: '32px', margin: '0 0 8px', color: 'var(--primary-color)' }}>{current.word}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>💡 {current.hint}</p>
            <button onClick={(e) => { e.stopPropagation(); speak(current.word); }} style={{ marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
              <Volume2 size={14} /> Pronounce
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 10px', color: 'var(--text-main)', lineHeight: '1.5' }}>{current.meaning}</p>
            <p style={{ color: 'var(--primary-color)', fontSize: '14px', fontWeight: '600', margin: '0 0 10px' }}>🇮🇳 {current.tamil}</p>
            <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>"{current.word} shows {current.hint.toLowerCase()}."</p>
          </>
        )}
      </div>

      {flipped && (
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <button onClick={handleLearn} style={{
            flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #f59e0b',
            background: 'rgba(245,158,11,0.1)', color: '#f59e0b', cursor: 'pointer', fontWeight: '700', fontSize: '15px', transition: 'all 0.2s'
          }}>
            📖 Still Learning
          </button>
          <button onClick={handleKnew} style={{
            flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #10b981',
            background: 'rgba(16,185,129,0.1)', color: '#10b981', cursor: 'pointer', fontWeight: '700', fontSize: '15px', transition: 'all 0.2s'
          }}>
            ✅ I Knew It! +15 XP
          </button>
        </div>
      )}

      {!flipped && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', marginTop: '16px' }}>
          Tap the card to reveal the meaning
        </p>
      )}
    </div>
  );
};

// ─── GAME 4: SPELLING BEE ─────────────────────────────────────────────────────

const SpellingBee = ({ onExit, onPlayAgain }) => {
  const { addXp } = useAppContext();
  const { speak } = useSpeech();
  const [qIndex, setQIndex] = useState(0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const shuffled = useMemo(() => [...wordBank].sort(() => Math.random() - 0.5).slice(0, 8), []);
  const current = shuffled[qIndex];

  const handleSpeak = () => speak(current.word);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setSubmitted(true);
    if (input.trim().toLowerCase() === current.word.toLowerCase()) {
      setScore(s => s + 1);
      addXp(25);
    }
  };

  const handleNext = () => {
    if (qIndex < shuffled.length - 1) {
      setQIndex(i => i + 1);
      setInput('');
      setSubmitted(false);
    } else {
      setFinished(true);
    }
  };

  const isCorrect = input.trim().toLowerCase() === current.word.toLowerCase();

  if (finished) {
    const pct = Math.round((score / shuffled.length) * 100);
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>{pct >= 75 ? '🐝✨' : '🐝'}</div>
        <h2>Spelling Bee Done!</h2>
        <div style={{ fontSize: '48px', fontWeight: '800', color: pct >= 75 ? '#10b981' : '#f59e0b', marginBottom: '8px' }}>{score}/{shuffled.length}</div>
        <p style={{ color: 'var(--text-muted)' }}>{pct}% correct · +{score * 25} XP earned</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <button className="btn-secondary" onClick={onExit}>← Games Menu</button>
          <button className="btn-primary" onClick={onPlayAgain}><RotateCcw size={14} /> Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>🐝 Spelling Bee — Type what you hear!</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{qIndex + 1}/{shuffled.length}</span>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onExit}>Quit</button>
        </div>
      </div>

      <div className="progress-bar-bg" style={{ marginBottom: '28px' }}>
        <div className="progress-bar-fill" style={{ width: `${(qIndex / shuffled.length) * 100}%` }} />
      </div>

      <div className="card" style={{ textAlign: 'center', borderTop: '3px solid var(--primary-color)' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Listen carefully, then type the correct spelling:</p>
        <div style={{ background: 'rgba(0,150,136,0.06)', borderRadius: '10px', padding: '14px', marginBottom: '16px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          <strong>Meaning:</strong> {current.meaning}<br />
          <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>🇮🇳 {current.tamil}</span>
        </div>

        <button className="btn-primary" style={{ marginBottom: '20px', padding: '12px 28px', fontSize: '16px' }} onClick={handleSpeak}>
          <Volume2 size={18} /> 🔊 Play Word
        </button>

        {!submitted ? (
          <>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Type the spelling here..."
              autoFocus
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid var(--border-color)',
                background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '18px', textAlign: 'center',
                marginBottom: '16px', boxSizing: 'border-box', letterSpacing: '2px',
              }}
            />
            <button className="btn-primary" onClick={handleSubmit} disabled={!input.trim()} style={{ width: '100%', justifyContent: 'center', opacity: input.trim() ? 1 : 0.5 }}>
              Submit Spelling
            </button>
          </>
        ) : (
          <>
            <div style={{
              padding: '16px', borderRadius: '12px', marginBottom: '16px',
              background: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{isCorrect ? '✅ Correct! +25 XP' : '❌ Incorrect'}</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-color)', letterSpacing: '3px' }}>{current.word}</div>
              {!isCorrect && <div style={{ fontSize: '14px', color: '#ef4444', marginTop: '6px' }}>You typed: "{input}"</div>}
            </div>
            <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center' }}>
              {qIndex === shuffled.length - 1 ? 'See Results' : 'Next Word →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── GAME 5: WORD SCRAMBLE ─────────────────────────────────────────────────────

const WordScramble = ({ onExit, onPlayAgain }) => {
  const { addXp } = useAppContext();
  const { speak } = useSpeech();
  const [qIndex, setQIndex] = useState(0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const shuffled = useMemo(() => [...wordBank].sort(() => Math.random() - 0.5).slice(0, 8), []);

  const scramble = (word) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const [scrambled, setScrambled] = useState('');
  const current = shuffled[qIndex];

  useEffect(() => {
    if (current) {
      let s = scramble(current.word);
      while (s === current.word && s.length > 1) s = scramble(current.word);
      setScrambled(s);
      setHintUsed(false);
    }
  }, [qIndex, current]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setSubmitted(true);
    if (input.trim().toLowerCase() === current.word.toLowerCase()) {
      setScore(s => s + 1);
      addXp(hintUsed ? 15 : 25);
    }
  };

  const handleNext = () => {
    if (qIndex < shuffled.length - 1) {
      setQIndex(i => i + 1);
      setInput('');
      setSubmitted(false);
    } else {
      setFinished(true);
    }
  };

  const useHint = () => {
    setHintUsed(true);
    speak(current.word);
  };

  const isCorrect = input.trim().toLowerCase() === current.word.toLowerCase();

  if (finished) {
    const pct = Math.round((score / shuffled.length) * 100);
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>{pct >= 75 ? '🧩✨' : '🧩'}</div>
        <h2>Word Scramble Done!</h2>
        <div style={{ fontSize: '48px', fontWeight: '800', color: pct >= 75 ? '#10b981' : '#f59e0b', marginBottom: '8px' }}>{score}/{shuffled.length}</div>
        <p style={{ color: 'var(--text-muted)' }}>{pct}% correct · +{score * (hintUsed ? 15 : 25)} XP earned</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <button className="btn-secondary" onClick={onExit}>← Games Menu</button>
          <button className="btn-primary" onClick={onPlayAgain}><RotateCcw size={14} /> Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>🧩 Word Scramble — Unscramble the word!</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{qIndex + 1}/{shuffled.length}</span>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onExit}>Quit</button>
        </div>
      </div>

      <div className="progress-bar-bg" style={{ marginBottom: '28px' }}>
        <div className="progress-bar-fill" style={{ width: `${(qIndex / shuffled.length) * 100}%` }} />
      </div>

      <div className="card" style={{ textAlign: 'center', borderTop: '3px solid #8b5cf6' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Rearrange the letters to form a correct English word:</p>

        <div style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '12px', color: 'var(--primary-color)', marginBottom: '16px', fontFamily: 'monospace', padding: '20px', background: 'rgba(139,92,246,0.08)', borderRadius: '12px' }}>
          {scrambled.toUpperCase()}
        </div>

        <div style={{ background: 'rgba(0,150,136,0.06)', borderRadius: '8px', padding: '10px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <strong>Hint:</strong> {current.hint}
        </div>

        {!submitted ? (
          <>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Type the unscrambled word..."
              autoFocus
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid var(--border-color)',
                background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '18px', textAlign: 'center',
                marginBottom: '12px', boxSizing: 'border-box', letterSpacing: '2px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={useHint} style={{ flex: 1, fontSize: '13px' }}>
                <Volume2 size={14} /> Hear Word ({hintUsed ? 'Used' : 'Available'})
              </button>
              <button className="btn-primary" onClick={handleSubmit} disabled={!input.trim()} style={{ flex: 1, opacity: input.trim() ? 1 : 0.5 }}>
                Submit
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{
              padding: '16px', borderRadius: '12px', marginBottom: '16px',
              background: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{isCorrect ? `✅ Correct! +${hintUsed ? 15 : 25} XP` : '❌ Incorrect'}</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-color)' }}>{current.word}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>{current.meaning} · 🇮🇳 {current.tamil}</div>
            </div>
            <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center' }}>
              {qIndex === shuffled.length - 1 ? 'See Results' : 'Next Word →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── GAME 6: FILL IN THE BLANKS ───────────────────────────────────────────────

const fillBlankQuestions = [
  { sentence: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'went'], correct: 1, explanation: 'Third person singular (she) + present simple = goes' },
  { sentence: 'They ___ playing cricket now.', options: ['is', 'am', 'are', 'was'], correct: 2, explanation: 'Plural subject (they) + present continuous = are' },
  { sentence: 'I have ___ finished my homework.', options: ['already', 'yet', 'since', 'for'], correct: 0, explanation: '"Already" is used in affirmative present perfect sentences' },
  { sentence: 'He is good ___ mathematics.', options: ['in', 'at', 'on', 'with'], correct: 1, explanation: '"Good at" is the correct preposition for skills' },
  { sentence: 'If I ___ you, I would accept the offer.', options: ['was', 'were', 'am', 'be'], correct: 1, explanation: 'Subjunctive mood uses "were" for hypothetical situations' },
  { sentence: 'The book ___ on the table.', options: ['is', 'are', 'am', 'be'], correct: 0, explanation: 'Singular subject (book) + singular verb (is)' },
  { sentence: 'We ___ waiting for the bus since 6 AM.', options: ['are', 'were', 'have been', 'will be'], correct: 2, explanation: '"Since" indicates a duration from past to present = present perfect continuous' },
  { sentence: 'Can you ___ me the salt, please?', options: ['pass', 'passed', 'passing', 'passes'], correct: 0, explanation: 'After "can you" use the base form of the verb' },
  { sentence: 'Neither the teacher ___ the students were present.', options: ['or', 'nor', 'and', 'but'], correct: 1, explanation: '"Neither" is always paired with "nor"' },
  { sentence: 'She speaks English ___ than before.', options: ['good', 'better', 'best', 'well'], correct: 1, explanation: 'Comparative form "better" is used with "than"' },
  { sentence: 'The children are ___ in the garden.', options: ['play', 'plays', 'playing', 'played'], correct: 2, explanation: 'Present continuous: are + playing' },
  { sentence: 'I ___ her since 2010.', options: ['know', 'knew', 'have known', 'am knowing'], correct: 2, explanation: '"Since 2010" requires present perfect: have known' },
  { sentence: 'This is the ___ movie I have ever seen.', options: ['good', 'better', 'best', 'well'], correct: 2, explanation: 'Superlative "best" with "ever" + present perfect' },
  { sentence: 'You ___ finish your homework before playing.', options: ['must', 'can', 'may', 'might'], correct: 0, explanation: '"Must" expresses necessity/obligation' },
  { sentence: 'He drove ___ despite the rain.', options: ['careful', 'carefully', 'more careful', 'care'], correct: 1, explanation: 'Adverb "carefully" modifies the verb "drove"' },
  { sentence: 'The meeting ___ at 10 AM tomorrow.', options: ['starts', 'started', 'will start', 'is starting'], correct: 0, explanation: 'Present simple for scheduled future events' },
];

const FillBlanks = ({ onExit, onPlayAgain }) => {
  const { addXp } = useAppContext();
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const shuffled = useMemo(() => [...fillBlankQuestions].sort(() => Math.random() - 0.5).slice(0, 10), []);
  const current = shuffled[qIndex];

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === current.correct) {
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
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>{pct >= 80 ? '📝✨' : pct >= 50 ? '📝' : '📖'}</div>
        <h2>Fill in the Blanks Done!</h2>
        <div style={{ fontSize: '48px', fontWeight: '800', color: pct >= 80 ? '#10b981' : '#f59e0b', marginBottom: '8px' }}>{score}/{shuffled.length}</div>
        <p style={{ color: 'var(--text-muted)' }}>{pct}% correct · +{score * 20} XP earned</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <button className="btn-secondary" onClick={onExit}>← Games Menu</button>
          <button className="btn-primary" onClick={onPlayAgain}><RotateCcw size={14} /> Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>📝 Fill in the Blanks — Complete the sentence!</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{qIndex + 1}/{shuffled.length}</span>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onExit}>Quit</button>
        </div>
      </div>

      <div className="progress-bar-bg" style={{ marginBottom: '24px' }}>
        <div className="progress-bar-fill" style={{ width: `${(qIndex / shuffled.length) * 100}%` }} />
      </div>

      <div className="card" style={{ borderTop: '3px solid #f59e0b' }}>
        <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', lineHeight: '1.6', color: 'var(--text-main)' }}>
          {current.sentence.split('___').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <span style={{ color: 'var(--primary-color)', fontWeight: '800', textDecoration: 'underline', textDecorationStyle: 'dotted' }}> ______ </span>}
            </span>
          ))}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {current.options.map((opt, idx) => {
            let border = 'var(--border-color)', bg = 'var(--surface-color)', color = 'var(--text-main)';
            if (submitted) {
              if (idx === current.correct) { border = '#10b981'; bg = 'rgba(16,185,129,0.1)'; color = '#10b981'; }
              else if (idx === selected) { border = '#ef4444'; bg = 'rgba(239,68,68,0.1)'; color = '#ef4444'; }
            } else if (idx === selected) { border = 'var(--primary-color)'; bg = 'rgba(0,150,136,0.1)'; }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} disabled={submitted}
                style={{ padding: '12px 16px', borderRadius: '10px', border: `2px solid ${border}`, background: bg, color, cursor: submitted ? 'default' : 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }}>
                {String.fromCharCode(65 + idx)}) {opt}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <button className="btn-primary" onClick={handleSubmit} disabled={selected === null} style={{ width: '100%', justifyContent: 'center', opacity: selected === null ? 0.5 : 1 }}>
            Check Answer
          </button>
        ) : (
          <>
            <div style={{ padding: '14px', background: 'rgba(0,150,136,0.06)', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)', marginBottom: '16px', fontSize: '13.5px', lineHeight: '1.5' }}>
              <strong>💡 Explanation:</strong> {current.explanation}
            </div>
            <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center' }}>
              {qIndex === shuffled.length - 1 ? 'See Results' : 'Next Question →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── MAIN GAMES MENU ─────────────────────────────────────────────────────────

const games = [
  {
    id: 'match', emoji: '🔗', title: 'Word Match',
    desc: 'Tap words and meanings to connect matching pairs. Race against the clock!',
    color: '#009688', xp: '+50 XP',
    component: WordMatch,
  },
  {
    id: 'hangman', emoji: '🪢', title: 'Hangman',
    desc: 'Classic letter-guessing game with English vocabulary words. Use hints!',
    color: '#8b5cf6', xp: '+40 XP',
    component: Hangman,
  },
  {
    id: 'blitz', emoji: '⚡', title: 'Flashcard Blitz',
    desc: 'Flip through vocab cards. Mark what you know — learn what you don\'t!',
    color: '#f59e0b', xp: '+15 XP/card',
    component: FlashcardBlitz,
  },
  {
    id: 'spelling', emoji: '🐝', title: 'Spelling Bee',
    desc: 'Listen to the word pronunciation and type the correct spelling!',
    color: '#06b6d4', xp: '+25 XP/word',
    component: SpellingBee,
  },
  {
    id: 'scramble', emoji: '🧩', title: 'Word Scramble',
    desc: 'Unscramble jumbled English letters. Improves spelling and word recognition!',
    color: '#8b5cf6', xp: '+25 XP/word',
    component: WordScramble,
  },
  {
    id: 'fillblanks', emoji: '📝', title: 'Fill in the Blanks',
    desc: 'Complete English sentences with the correct grammar. Perfect for exam prep!',
    color: '#f59e0b', xp: '+20 XP/answer',
    component: FillBlanks,
  },
];

const VocabGames = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  const handlePlayAgain = () => setGameKey(k => k + 1);

  const ActiveComponent = activeGame ? games.find(g => g.id === activeGame)?.component : null;

  if (ActiveComponent) {
    return (
      <div key={activeGame + gameKey}>
        <div style={{ marginBottom: '24px' }}>
          <button onClick={() => setActiveGame(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', padding: 0 }}>
            ← Back to Games
          </button>
        </div>
        <ActiveComponent onExit={() => setActiveGame(null)} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>🎮 Vocabulary Games</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Learn English the fun way! Play games that test and build your vocabulary, spelling, and word memory.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {games.map(game => (
          <div
            key={game.id}
            className="card"
            onClick={() => setActiveGame(game.id)}
            style={{
              cursor: 'pointer', borderTop: `4px solid ${game.color}`, textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${game.color}25`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{game.emoji}</div>
            <h3 style={{ color: game.color, margin: '0 0 8px' }}>{game.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '16px' }}>{game.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', background: `${game.color}18`, color: game.color, padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>
                {game.xp}
              </span>
              <span style={{ fontSize: '13px', color: game.color, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Play Now <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '28px', background: 'linear-gradient(135deg, rgba(0,150,136,0.08), rgba(99,102,241,0.08))', border: '1px solid rgba(0,150,136,0.2)', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌟</div>
        <h3 style={{ margin: '0 0 6px' }}>Why play vocabulary games?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
          Research shows that <strong>active recall through games</strong> improves vocabulary retention by up to 70% compared to passive reading. Every game you play helps words stick longer in your memory!
        </p>
      </div>
    </div>
  );
};

export default VocabGames;
