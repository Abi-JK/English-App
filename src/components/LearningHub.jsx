import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Zap, MessageCircle, RotateCcw, CheckCircle2, Volume2, Gamepad2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ─── DATA ────────────────────────────────────────────────────────────────────

const vocabularyDecks = [
  {
    id: 'daily',
    title: 'Daily English Vocabulary',
    emoji: '📚',
    color: '#009688',
    cards: [
      { word: 'Accomplish', meaning: 'To achieve or complete something successfully', example: 'She accomplished all her goals by the end of the year.', tamil: 'சாதிக்க / நிறைவேற்ற' },
      { word: 'Eloquent', meaning: 'Fluent or persuasive in speaking or writing', example: 'He gave an eloquent speech at the conference.', tamil: 'சொல்லாட்சி வல்லவர் / தெளிவாக பேசுபவர்' },
      { word: 'Persevere', meaning: 'To continue despite difficulty or delay in achieving success', example: 'You must persevere even when things get tough.', tamil: 'விடாமுயற்சியுடன் இரு' },
      { word: 'Diligent', meaning: 'Having or showing care and effort in work or duties', example: 'A diligent student always revises lessons.', tamil: 'உழைப்பாளி / கவனமான' },
      { word: 'Proficient', meaning: 'Competent or skilled in doing something', example: 'She is proficient in English communication.', tamil: 'திறமையான / தேர்ச்சி பெற்ற' },
      { word: 'Articulate', meaning: 'Able to express thoughts and ideas clearly', example: 'A good leader should be articulate.', tamil: 'தெளிவாக பேசும் திறன்' },
      { word: 'Meticulous', meaning: 'Showing great attention to detail', example: 'His meticulous work impressed the manager.', tamil: 'நுண்ணிய / கவனமான' },
      { word: 'Tenacious', meaning: 'Determined and not giving up easily', example: 'A tenacious attitude is key to success.', tamil: 'உறுதியான / பிடிவாதமான' },
    ]
  },
  {
    id: 'mnc',
    title: 'MNC Corporate Vocabulary',
    emoji: '🏢',
    color: '#6366f1',
    cards: [
      { word: 'Synergy', meaning: 'The benefit that comes from combining two or more teams or efforts', example: 'The merger created synergy between both companies.', tamil: 'கூட்டு சக்தி / ஒருங்கிணைந்த செயல்பாடு' },
      { word: 'Leverage', meaning: 'To use something to maximum advantage', example: 'We can leverage our network to find new clients.', tamil: 'சிறப்பாக பயன்படுத்து' },
      { word: 'Bandwidth', meaning: 'Available time or capacity to handle work (corporate usage)', example: 'Do you have the bandwidth to take this project?', tamil: 'நேர திறன் / வேலை செய்யக்கூடிய ஆற்றல்' },
      { word: 'Deliverable', meaning: 'A product or result that must be delivered by a specific date', example: 'Please share the deliverables by Friday.', tamil: 'வழங்க வேண்டிய பணி' },
      { word: 'Stakeholder', meaning: 'A person with an interest or concern in the project', example: 'We need approval from all stakeholders.', tamil: 'பங்கேற்பாளர் / உரிமைதாரர்' },
      { word: 'Proactive', meaning: 'Taking action before a situation becomes a problem', example: 'Be proactive about reporting issues.', tamil: 'முன்கூட்டியே செயல்படு' },
      { word: 'Escalate', meaning: 'To raise an issue to a higher level of authority', example: 'If not resolved, please escalate to the manager.', tamil: 'மேலதிகாரிக்கு அனுப்பு' },
      { word: 'KPI', meaning: 'Key Performance Indicator — a measure of success', example: 'Meeting your KPIs is essential for your appraisal.', tamil: 'செயல்திறன் குறியீடு' },
    ]
  },
  {
    id: 'exam',
    title: 'Exam Vocabulary (SSC/TNPSC)',
    emoji: '🎓',
    color: '#f59e0b',
    cards: [
      { word: 'Benevolent', meaning: 'Well-meaning and kindly; generous', example: 'The benevolent king helped the poor.', tamil: 'தயாளமான / கருணையுள்ள' },
      { word: 'Verbose', meaning: 'Using more words than needed; wordy', example: 'His verbose answer confused everyone.', tamil: 'அதிக வார்த்தை பேசும்' },
      { word: 'Frugal', meaning: 'Sparing or economical with money', example: 'A frugal lifestyle helps save more money.', tamil: 'சிக்கனமான' },
      { word: 'Ambiguous', meaning: 'Open to more than one interpretation; unclear', example: 'The question was ambiguous and confusing.', tamil: 'இரண்டு பொருள் கொண்ட / தெளிவற்ற' },
      { word: 'Arduous', meaning: 'Involving or requiring strenuous effort; difficult', example: 'The UPSC exam is an arduous journey.', tamil: 'கஷ்டமான / கடினமான' },
      { word: 'Lucid', meaning: 'Expressed clearly; easy to understand', example: 'Give a lucid explanation of the concept.', tamil: 'தெளிவான' },
      { word: 'Obsolete', meaning: 'No longer produced or used; out of date', example: 'Typewriters became obsolete after computers arrived.', tamil: 'பழங்காலமான / வழக்கிழந்த' },
      { word: 'Candid', meaning: 'Truthful and straightforward; frank', example: 'Please give me your candid opinion.', tamil: 'நேர்மையான / வெளிப்படையான' },
    ]
  }
];

const grammarRules = [
  {
    id: 'g1',
    title: 'Subject-Verb Agreement',
    tag: 'Common Error',
    tagColor: '#ef4444',
    rule: 'A singular subject takes a singular verb; a plural subject takes a plural verb.',
    examples: [
      { wrong: "She don't like coffee.", right: "She doesn't like coffee." },
      { wrong: "The team are playing well.", right: "The team is playing well." }
    ],
    tip: '⚡ Quick Tip: Words like "everyone", "nobody", "each", "either" are always SINGULAR.'
  },
  {
    id: 'g2',
    title: 'Articles (a, an, the)',
    tag: 'Must Know',
    tagColor: '#3b82f6',
    rule: 'Use "a" before consonant sounds, "an" before vowel sounds. Use "the" for specific nouns.',
    examples: [
      { wrong: "She is a honest person.", right: "She is an honest person." },
      { wrong: "He is best player in team.", right: "He is the best player in the team." }
    ],
    tip: '⚡ Quick Tip: "an hour" — H is silent, so it takes "an". "a university" — U sounds like "yoo" so it takes "a".'
  },
  {
    id: 'g3',
    title: 'Tense Consistency',
    tag: 'Most Common',
    tagColor: '#8b5cf6',
    rule: 'Do not shift tenses unnecessarily within the same sentence or paragraph.',
    examples: [
      { wrong: "He went to the store and buys milk.", right: "He went to the store and bought milk." },
      { wrong: "I will go if she comes and bring food.", right: "I will go if she comes and brings food." }
    ],
    tip: '⚡ Quick Tip: In "If" conditional sentences — If + present → future. If + past → would.'
  },
  {
    id: 'g4',
    title: 'Active vs Passive Voice',
    tag: 'Exam Important',
    tagColor: '#f59e0b',
    rule: 'In active voice, subject performs the action. In passive voice, subject receives the action.',
    examples: [
      { wrong: "The report was wrote by him.", right: "The report was written by him." },
      { wrong: "The manager is approved the request.", right: "The request is approved by the manager." }
    ],
    tip: '⚡ Quick Tip: Passive = form of "be" + Past Participle (V3). "was written", "is approved", "will be completed".'
  },
  {
    id: 'g5',
    title: 'Prepositions of Time & Place',
    tag: 'Common Error',
    tagColor: '#06b6d4',
    rule: 'Use "at" for specific points, "on" for surfaces/days, "in" for enclosed spaces/months/years.',
    examples: [
      { wrong: "I will meet you in Monday.", right: "I will meet you on Monday." },
      { wrong: "She lives at Chennai.", right: "She lives in Chennai." }
    ],
    tip: '⚡ Quick Tip: at (specific): at 5pm, at home. on (day/date): on Friday. in (period/place): in June, in India.'
  },
  {
    id: 'g6',
    title: 'Direct & Indirect Speech',
    tag: 'Exam Important',
    tagColor: '#ec4899',
    rule: 'When converting direct speech to indirect, tense usually shifts back one step.',
    examples: [
      { wrong: 'He said that he is coming.', right: 'He said that he was coming.' },
      { wrong: 'She asked that where are you going.', right: 'She asked where I was going.' }
    ],
    tip: '⚡ Quick Tip: Present → Past. "will" → "would". "can" → "could". Remove quotes, add "that", change pronouns.'
  },
  {
    id: 'g7',
    title: 'Question Tags',
    tag: 'Must Know',
    tagColor: '#6366f1',
    rule: 'Positive statement → negative tag. Negative statement → positive tag.',
    examples: [
      { wrong: "You are coming, are you?", right: "You are coming, aren't you?" },
      { wrong: "She didn't go, didn't she?", right: "She didn't go, did she?" }
    ],
    tip: '⚡ Quick Tip: Match the auxiliary verb (do/does/did/have/will/can) in the tag. "He can swim, can\'t he?"'
  },
  {
    id: 'g8',
    title: 'Relative Clauses (Who/Which/That/Whom)',
    tag: 'Advanced',
    tagColor: '#a855f7',
    rule: 'Use "who" for people, "which" for things, "that" for both (in defining clauses). "Whom" for object of verb.',
    examples: [
      { wrong: "The man which called you is here.", right: "The man who called you is here." },
      { wrong: "This is the book who I bought.", right: "This is the book which I bought." }
    ],
    tip: '⚡ Quick Tip: People → who/whom. Things → which/that. Possession → whose. "The student whose bag was lost..."'
  }
];

const idioms = [
  { phrase: 'Hit the ground running', meaning: 'To begin a job or project with great energy and effort', use: 'He hit the ground running on his first day at the MNC.' },
  { phrase: 'Touch base', meaning: 'To briefly contact someone or check in with them', use: 'Let\'s touch base tomorrow to discuss the project.' },
  { phrase: 'Think outside the box', meaning: 'To think creatively or unconventionally', use: 'The manager asked us to think outside the box for new solutions.' },
  { phrase: 'Get the ball rolling', meaning: 'To start something, especially something big', use: 'Let\'s get the ball rolling on the new campaign.' },
  { phrase: 'Keep me in the loop', meaning: 'To keep someone informed about developments', use: 'Please keep me in the loop regarding the project status.' },
  { phrase: 'Bite the bullet', meaning: 'To face a difficult situation bravely', use: 'I decided to bite the bullet and give the presentation.' },
  { phrase: 'Cutting corners', meaning: 'Doing something poorly to save time or money', use: 'We should never cut corners on quality testing.' },
  { phrase: 'Call it a day', meaning: 'To stop working for the day', use: 'We have done enough for today, let\'s call it a day.' },
  { phrase: 'On the same page', meaning: 'To have a shared understanding or agreement', use: 'Let\'s have a meeting to ensure we are all on the same page.' },
  { phrase: 'Go the extra mile', meaning: 'To make more effort than expected', use: 'She always goes the extra mile to help her team members.' },
  { phrase: 'Ballpark figure', meaning: 'A rough estimate or approximate number', use: 'Can you give me a ballpark figure for the project cost?' },
  { phrase: 'Take it easy', meaning: 'To relax and not worry too much', use: 'You have been working hard, take it easy this weekend.' }
];

// Speak Text helper
const speakText = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
};

// ─── FLASHCARD SUB-VIEW ──────────────────────────────────────────────────────

const FlashcardView = ({ deck, onBack }) => {
  const { addXp } = useAppContext();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());

  const card = deck.cards[idx];
  const progress = Math.round((known.size / deck.cards.length) * 100);

  const handleFlip = () => setFlipped(!flipped);

  const handleSpeak = (e) => {
    e.stopPropagation();
    speakText(card.word);
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
        <button className="btn-secondary" style={{ padding: '6px', borderRadius: '50%' }} onClick={() => speakText(current.word)}>
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
  const [items, setItems] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedMeaning, setSelectedMeaning] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [wrongMatch, setWrongMatch] = useState(null);
  const [gameWon, setGameWon] = useState(false);

  const gamePool = [
    { id: '1', word: 'Eloquent', meaning: 'தெளிவாக பேசுபவர் / சொல்லாட்சி வல்லவர்' },
    { id: '2', word: 'Persevere', meaning: 'விடாமுயற்சியுடன் இரு' },
    { id: '3', word: 'Frugal', meaning: 'சிக்கனமான' },
    { id: '4', word: 'Synergy', meaning: 'கூட்டு சக்தி / ஒருங்கிணைந்த செயல்பாடு' },
    { id: '5', word: 'Meticulous', meaning: 'நுண்ணிய / கவனமான' },
    { id: '6', word: 'Ambiguous', meaning: 'தெளிவற்ற / இரண்டு பொருள் கொண்ட' }
  ];

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
      speakText(item.text);
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
                  <button className="btn-secondary" style={{ padding: '6px', borderRadius: '50%' }} onClick={() => speakText(`${rule.title}. Rule: ${rule.rule}`)}>
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
                      <button className="btn-secondary" style={{ padding: '4px', borderRadius: '50%' }} onClick={() => speakText(ex.wrong)}>
                        <Volume2 size={13} />
                      </button>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#10b98118', borderLeft: '3px solid #10b981', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>✅ {ex.right}</span>
                      <button className="btn-secondary" style={{ padding: '4px', borderRadius: '50%' }} onClick={() => speakText(ex.right)}>
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
                    <button className="btn-secondary" style={{ padding: '6px', borderRadius: '50%' }} onClick={() => speakText(`${item.phrase}. Meaning: ${item.meaning}. Example: ${item.use}`)}>
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
