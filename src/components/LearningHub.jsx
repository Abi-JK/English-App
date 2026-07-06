import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Zap, MessageCircle, RotateCcw, CheckCircle2, Volume2, Gamepad2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { vocabularyDecks, matchGamePool } from '../data/vocabulary';
import { grammarRules } from '../data/grammarRules';
import { idioms } from '../data/idioms';
import { useSpeech } from '../hooks/useSpeech';
import { useBookmarks } from '../hooks/useBookmarks';

// Speak Text helper (uses useSpeech internally via component props)

// ─── FLASHCARD SUB-VIEW ──────────────────────────────────────────────────────

const FlashcardView = ({ deck, onBack }) => {
  const { addXp } = useAppContext();
  const { speak } = useSpeech();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());

  const card = deck.cards[idx];
  const progress = Math.round((known.size / deck.cards.length) * 100);

  const handleFlip = () => setFlipped(!flipped);

  const handleSpeak = (e) => {
    e.stopPropagation();
    speak(card.word);
  };

  const handleKnow = () => {
    if (!known.has(idx)) {
      const newKnown = new Set(known);
      newKnown.add(idx);
      setKnown(newKnown);
      addXp(10);
    }
    next();
  };

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIdx(i => (i + 1) % deck.cards.length), 50);
  };
  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIdx(i => (i - 1 + deck.cards.length) % deck.cards.length), 50);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0 }}>{deck.emoji} {deck.title}</h2>
          <p className="text-muted" style={{ fontSize: '14px' }}>Card {idx + 1} of {deck.cards.length} · {known.size} learned (+10 XP each)</p>
        </div>
        <button className="btn-secondary" onClick={onBack}><ChevronLeft size={16} /> Back to Decks</button>
      </div>

      <div className="progress-bar-bg" style={{ marginBottom: '24px' }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%`, background: deck.color }} />
      </div>

      <div
        onClick={handleFlip}
        style={{
          minHeight: '280px', borderRadius: '16px', border: `2px solid ${deck.color}40`,
          background: flipped ? `${deck.color}12` : 'var(--surface-color)',
          cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '40px',
          textAlign: 'center', transition: 'all 0.35s ease', marginBottom: '24px',
          boxShadow: `0 8px 32px ${deck.color}20`, position: 'relative'
        }}
      >
        <button
          onClick={handleSpeak}
          title="Listen Pronunciation"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.05)', border: 'none',
            borderRadius: '50%', padding: '10px', color: 'white',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Volume2 size={20} />
        </button>

        {!flipped ? (
          <>
            <div style={{ fontSize: '13px', color: deck.color, fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>WORD</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>{card.word}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tap to reveal meaning & translation</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '13px', color: deck.color, fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>MEANING</div>
            <div style={{ fontSize: '20px', color: 'var(--text-main)', fontWeight: '600', marginBottom: '12px', lineHeight: '1.5' }}>{card.meaning}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '12px' }}>"{card.example}"</div>
            <div style={{ fontSize: '14px', background: `${deck.color}20`, color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: '600' }}>தமிழ்: {card.tamil}</div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button className="btn-secondary" onClick={prev}><ChevronLeft size={18} /> Prev</button>
        <button
          onClick={handleKnow}
          style={{ background: '#10b98120', border: '1px solid #10b981', color: '#10b981', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <CheckCircle2 size={18} /> I Know This
        </button>
        <button className="btn-secondary" onClick={next}>Next <ChevronRight size={18} /></button>
      </div>
    </div>
  );
};

// ─── VOCAB QUIZ SUB-VIEW ─────────────────────────────────────────────────────

const VocabQuizView = () => {
  const { addXp, updateQuizScore } = useAppContext();
  const { speak } = useSpeech();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const initQuiz = () => {
    const allCards = vocabularyDecks.flatMap(deck => deck.cards);
    if (allCards.length < 4) return;

    // Shuffle and pick 5 random vocabulary cards
    const shuffled = [...allCards].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 5);

    const quizQuestions = selectedCards.map(card => {
      const correctOption = `${card.meaning} (Tamil: ${card.tamil})`;
      
      const incorrects = allCards
        .filter(c => c.word !== card.word)
        .map(c => `${c.meaning} (Tamil: ${c.tamil})`);
      
      const chosenIncorrects = [...incorrects].sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [correctOption, ...chosenIncorrects].sort(() => 0.5 - Math.random());
      
      return {
        word: card.word,
        example: card.example,
        options,
        answer: options.indexOf(correctOption),
        correctText: correctOption
      };
    });

    setQuestions(quizQuestions);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  useEffect(() => {
    initQuiz();
  }, []);

  const handleSubmit = () => {
    if (selectedOpt === null) return;
    setSubmitted(true);
    if (selectedOpt === questions[currentIdx].answer) {
      setScore(s => s + 1);
      addXp(25);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      setQuizFinished(true);
      updateQuizScore('Vocab Practice Quiz', Math.round((score / questions.length) * 100));
    }
  };

  if (questions.length === 0) return <div>Generating questions...</div>;

  if (quizFinished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
        <h2>Quiz Complete!</h2>
        <div style={{ fontSize: '36px', fontWeight: '800', color: pct >= 80 ? 'var(--success-color)' : 'var(--accent-color)', marginBottom: '12px' }}>
          {score} / {questions.length}
        </div>
        <p className="text-muted" style={{ marginBottom: '24px' }}>Accuracy: {pct}%</p>
        <button className="btn-primary" onClick={initQuiz} style={{ margin: '0 auto' }}>Restart Quiz</button>
      </div>
    );
  }

  const current = questions[currentIdx];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Question {currentIdx + 1} of {questions.length}</h3>
          <button className="btn-secondary" style={{ padding: '6px', borderRadius: '50%' }} onClick={() => speak(current.word)}>
          <Volume2 size={16} />
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h4 style={{ fontSize: '18px', color: 'var(--primary-color)', marginBottom: '12px' }}>What is the correct meaning of the word:</h4>
        <h2 style={{ fontSize: '28px', color: 'white', marginBottom: '20px', textAlign: 'center' }}>{current.word}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {current.options.map((opt, i) => {
            let border = 'var(--border-color)';
            let bg = 'var(--surface-color)';
            let color = 'white';

            if (submitted) {
              if (i === current.answer) {
                border = 'var(--success-color)';
                bg = 'rgba(16, 185, 129, 0.1)';
                color = 'var(--success-color)';
              } else if (i === selectedOpt) {
                border = 'var(--danger-color)';
                bg = 'rgba(239, 68, 68, 0.1)';
                color = 'var(--danger-color)';
              }
            } else if (i === selectedOpt) {
              border = 'var(--primary-color)';
              bg = 'rgba(0, 150, 136, 0.1)';
            }

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelectedOpt(i)}
                style={{
                  padding: '12px 14px', borderRadius: '8px', border: `1.5px solid ${border}`,
                  background: bg, color: color, textAlign: 'left', cursor: submitted ? 'default' : 'pointer',
                  fontSize: '14px', lineHeight: '1.4', fontWeight: i === selectedOpt ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            <strong>Example Usage:</strong> "{current.example}"
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!submitted ? (
            <button className="btn-primary" disabled={selectedOpt === null} onClick={handleSubmit}>
              Submit Answer
            </button>
          ) : (
            <button className="btn-primary" onClick={handleNext}>
              {currentIdx === questions.length - 1 ? 'See Results' : 'Next Question'} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── VOCAB MATCH GAME SUB-VIEW ───────────────────────────────────────────────

const VocabMatchGame = () => {
  const { addXp } = useAppContext();
  const { speak } = useSpeech();
  const [items, setItems] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedMeaning, setSelectedMeaning] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [wrongMatch, setWrongMatch] = useState(null);
  const [gameWon, setGameWon] = useState(false);

  const gamePool = matchGamePool;

  const initGame = () => {
    setSelectedWord(null);
    setSelectedMeaning(null);
    setMatchedIds(new Set());
    setWrongMatch(null);
    setGameWon(false);

    const shuffledPool = [...gamePool].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    const words = shuffledPool.map(item => ({ id: item.id, text: item.word, type: 'word' }));
    const meanings = shuffledPool.map(item => ({ id: item.id, text: item.meaning, type: 'meaning' }));

    const combined = [...words.sort(() => 0.5 - Math.random()), ...meanings.sort(() => 0.5 - Math.random())];
    setItems(combined);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (item) => {
    if (matchedIds.has(item.id)) return;
    if (wrongMatch) return;

    if (item.type === 'word') {
      setSelectedWord(item);
      speak(item.text);
    } else {
      setSelectedMeaning(item);
    }
  };

  useEffect(() => {
    if (selectedWord && selectedMeaning) {
      if (selectedWord.id === selectedMeaning.id) {
        const newMatched = new Set(matchedIds);
        newMatched.add(selectedWord.id);
        setMatchedIds(newMatched);
        setSelectedWord(null);
        setSelectedMeaning(null);

        if (newMatched.size === items.length / 2) {
          setGameWon(true);
          addXp(40);
        }
      } else {
        setWrongMatch({ wordId: selectedWord.id, meaningId: selectedMeaning.id });
        setTimeout(() => {
          setSelectedWord(null);
          setSelectedMeaning(null);
          setWrongMatch(null);
        }, 1000);
      }
    }
  }, [selectedWord, selectedMeaning]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Gamepad2 size={24} color="var(--primary-color)" /> Addictive Vocab Match Game
        </h3>
        <p className="text-muted" style={{ fontSize: '13.5px' }}>Match the English words with their correct Tamil definitions to lock in vocabulary.</p>
      </div>

      {gameWon ? (
        <div className="card" style={{ padding: '40px', background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid var(--success-color)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: 'var(--success-color)' }}>Matching Completed!</h2>
          <p style={{ marginBottom: '24px' }}>You earned <strong>+40 XP</strong>! Great job keeping your focus active.</p>
          <button className="btn-primary" onClick={initGame} style={{ margin: '0 auto' }}>Play Again</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
          {items.map((item, idx) => {
            const isWordSelected = selectedWord && selectedWord.id === item.id && item.type === 'word';
            const isMeaningSelected = selectedMeaning && selectedMeaning.id === item.id && item.type === 'meaning';
            const isSelected = isWordSelected || isMeaningSelected;
            const isMatched = matchedIds.has(item.id);

            let border = 'var(--border-color)';
            let bg = 'var(--surface-color)';
            let color = 'white';

            if (isMatched) {
              bg = 'rgba(16, 185, 129, 0.1)';
              border = 'var(--success-color)';
              color = 'rgba(255,255,255,0.4)';
            } else if (isSelected) {
              bg = 'rgba(0, 150, 136, 0.15)';
              border = 'var(--primary-color)';
            } else if (wrongMatch && (wrongMatch.wordId === item.id || wrongMatch.meaningId === item.id)) {
              bg = 'rgba(239, 68, 68, 0.15)';
              border = 'var(--danger-color)';
            }

            return (
              <button
                key={idx}
                onClick={() => handleCardClick(item)}
                disabled={isMatched}
                style={{
                  padding: '20px 14px',
                  borderRadius: '10px',
                  border: `1.5px solid ${border}`,
                  background: bg,
                  color: color,
                  fontWeight: '500',
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  textAlign: 'center',
                  boxShadow: isSelected ? '0 0 10px rgba(0, 150, 136, 0.3)' : 'none'
                }}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      )}

      {!gameWon && (
        <button className="btn-secondary" onClick={initGame}>
          <RotateCcw size={14} style={{ marginRight: '6px' }} /> Shuffle / Restart
        </button>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const LearningHub = () => {
  const [activeTab, setActiveTab] = useState('vocab');
  const [selectedDeck, setSelectedDeck] = useState(null);

  const tabs = [
    { id: 'vocab', label: '📚 Vocabulary Decks', icon: BookOpen },
    { id: 'quiz', label: '📝 Practice Quiz', icon: CheckCircle2 },
    { id: 'game', label: '🎮 Match Game', icon: Gamepad2 },
    { id: 'grammar', label: '📖 Grammar Rules', icon: Zap },
    { id: 'idioms', label: '💬 Idioms & Phrases', icon: MessageCircle },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>🧠 Learning Hub</h1>
        <p className="text-muted" style={{ marginTop: '4px' }}>Build your vocabulary, test retention, master grammar, and learn natural idioms.</p>
      </div>

      {/* Tab Bar */}
      {!selectedDeck && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: 'var(--surface-color)', padding: '6px', borderRadius: '12px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, minWidth: '120px', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px', transition: 'all 0.2s',
                background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── VOCABULARY DECK SELECTION ── */}
      {activeTab === 'vocab' && !selectedDeck && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {vocabularyDecks.map(deck => (
            <div
              key={deck.id}
              className="card"
              onClick={() => setSelectedDeck(deck)}
              style={{
                cursor: 'pointer', borderLeft: `4px solid ${deck.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{deck.emoji}</div>
              <h3 style={{ color: deck.color, margin: '0 0 8px' }}>{deck.title}</h3>
              <p className="text-muted" style={{ fontSize: '13px', marginBottom: '16px' }}>{deck.cards.length} words with Tamil meanings & examples</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: deck.color, fontWeight: '600' }}>
                Start Flashcards <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'vocab' && selectedDeck && (
        <FlashcardView deck={selectedDeck} onBack={() => setSelectedDeck(null)} />
      )}

      {/* ── PRACTICE QUIZ ── */}
      {activeTab === 'quiz' && <VocabQuizView />}

      {/* ── MATCH GAME ── */}
      {activeTab === 'game' && <VocabMatchGame />}

      {/* ── GRAMMAR RULES ── */}
      {activeTab === 'grammar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {grammarRules.map(rule => (
            <div key={rule.id} className="card" style={{ borderTop: `3px solid ${rule.tagColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0 }}>📌 {rule.title}</h3>
                    <button className="btn-secondary" style={{ padding: '6px', borderRadius: '50%' }} onClick={() => speak(`${rule.title}. Rule: ${rule.rule}`)}>
                    <Volume2 size={15} />
                  </button>
                </div>
                <span style={{ background: `${rule.tagColor}20`, color: rule.tagColor, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                  {rule.tag}
                </span>
              </div>
              <p style={{ color: 'var(--text-main)', lineHeight: '1.7', marginBottom: '16px' }}>{rule.rule}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {rule.examples.map((ex, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#ef444418', borderLeft: '3px solid #ef4444', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>❌ {ex.wrong}</span>
                        <button className="btn-secondary" style={{ padding: '4px', borderRadius: '50%' }} onClick={() => speak(ex.wrong)}>
                        <Volume2 size={13} />
                      </button>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#10b98118', borderLeft: '3px solid #10b981', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>✅ {ex.right}</span>
                        <button className="btn-secondary" style={{ padding: '4px', borderRadius: '50%' }} onClick={() => speak(ex.right)}>
                        <Volume2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '14px', color: 'var(--accent-color)', borderLeft: `3px solid var(--accent-color)` }}>
                {rule.tip}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── IDIOMS ── */}
      {activeTab === 'idioms' && (
        <div>
          <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(0,150,136,0.08)', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
            <strong>💡 Why learn idioms?</strong>
            <p className="text-muted" style={{ fontSize: '14px', marginTop: '4px', marginBottom: 0 }}>
              Native speakers and MNC professionals utilize idioms in daily meetings. Master these to speak with higher maturity.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {idioms.map((item, i) => (
              <div key={i} className="card" style={{ borderLeft: '3px solid var(--primary-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>💬</span>
                      <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>"{item.phrase}"</h4>
                    </div>
                    <button className="btn-secondary" style={{ padding: '6px', borderRadius: '50%' }} onClick={() => speak(`${item.phrase}. Meaning: ${item.meaning}. Example: ${item.use}`)}>
                      <Volume2 size={14} />
                    </button>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.6' }}><strong>Meaning:</strong> {item.meaning}</p>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>"{item.use}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningHub;
