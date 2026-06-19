import React, { useState, useEffect } from 'react';
import {
  BookOpen, HelpCircle, Building, CheckCircle2, XCircle,
  ArrowRight, ArrowLeft, Clock, FileText, Trophy, RotateCcw, Star, Award, ShieldAlert
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ─── MASSIVE PYQ DATA WITH BILINGUAL TAMIL SUPPORT ───────────────────────────

const questionSets = {
  tnpsc: {
    label: 'TNPSC General English',
    color: '#10b981',
    emoji: '🏛️',
    description: 'Previous Year Questions from TNPSC Group 2, 2A, 4 exams. Covers synonyms, antonyms, error spotting & sentence patterns with Tamil explanations.',
    questions: [
      {
        id: 't1', topic: 'Synonym',
        question: 'Choose the correct synonym for "Candid":',
        options: ['Secretive (ரகசியமான)', 'Frank (வெளிப்படையான)', 'Timid (கோழையான)', 'Harsh (கடுமையான)'],
        answer: 1,
        explanation: '"Candid" means truthful and straightforward. "Frank" has the same meaning. (தமிழ் விளக்கம்: "Candid" என்றால் நேர்மையான, எதையும் மறைக்காமல் பேசக்கூடிய என்று பொருள். எனவே "Frank" என்பது சரியான இணைச்சொல் ஆகும்.)'
      },
      {
        id: 't2', topic: 'Antonym',
        question: 'Choose the correct antonym for "Benevolent":',
        options: ['Kind (இரக்கமுள்ள)', 'Generous (கொடைத்தன்மையுள்ள)', 'Malevolent (வஞ்சகமுள்ள/தீய)', 'Calm (அமைதியான)'],
        answer: 2,
        explanation: '"Benevolent" means kind and generous. Its antonym is "Malevolent" which means wishing evil to others. (தமிழ் விளக்கம்: "Benevolent" என்பது கருணையும் நற்குணமும் கொண்டவரைக் குறிக்கும். இதற்கு எதிர்ச்சொல் தீமையை விரும்பும் வஞ்சகக் குணம் கொண்ட "Malevolent" ஆகும்.)'
      },
      {
        id: 't3', topic: 'Error Spotting',
        question: 'Spot the error: "Each of the students have submitted their assignments on time."',
        options: ['Each of the students', 'have submitted', 'their assignments', 'on time'],
        answer: 1,
        explanation: '"Each" is singular, so the verb must be singular "has". Correct: "Each of the students HAS submitted...". (தமிழ் விளக்கம்: "Each" என்பது ஒருமையைக் குறிக்கும் சொல் (singular). எனவே, அதற்குப் பின் வரும் verb ஒருமையாக (has) இருக்க வேண்டும். "have" என்பது பிழையானது.)'
      },
      {
        id: 't4', topic: 'Fill in the Blank',
        question: 'She has been working here ______ 2019.',
        options: ['for', 'since', 'from', 'during'],
        answer: 1,
        explanation: '"Since" is used with a specific starting point in time (2019). "For" is used with a duration (e.g., for 5 years). (தமிழ் விளக்கம்: ஒரு குறிப்பிட்ட தொடக்கக் காலத்தைக் (point of time) குறிப்பிடும்போது "since" பயன்படுத்த வேண்டும். கால அளவைக் (duration) குறிப்பிடும்போது "for" வரும்.)'
      },
      {
        id: 't5', topic: 'Sentence Pattern',
        question: 'Identify the sentence pattern: "The teacher gave the students a test yesterday."',
        options: ['S V O A', 'S V IO DO A', 'S V C A', 'S V O O'],
        answer: 1,
        explanation: '"The teacher" (S) + "gave" (V) + "the students" (Indirect Object - to whom) + "a test" (Direct Object - what) + "yesterday" (Adjunct - when). Pattern: S V IO DO A. (தமிழ் விளக்கம்: Subject + Verb + Indirect Object + Direct Object + Adjunct. யாருக்கு வழங்கப்பட்டது = IO; என்ன வழங்கப்பட்டது = DO; எப்போது = Adjunct.)'
      },
      {
        id: 't6', topic: 'Prefix',
        question: 'Identify the appropriate prefix to form the antonym of the word "Behave":',
        options: ['dis', 'un', 'mis', 'in'],
        answer: 2,
        explanation: 'The prefix "mis-" is added to "behave" to form the antonym "misbehave", which means to behave badly. (தமிழ் விளக்கம்: "Behave" (ஒழுங்காக நடப்பது) என்ற சொல்லுக்கு எதிர்ச்சொல் உருவாக்க "mis-" என்ற முன்னொட்டை சேர்த்து "misbehave" (தவறாக நடப்பது) என உருவாக்க வேண்டும்.)'
      },
      {
        id: 't7', topic: 'Article',
        question: 'Fill in the blank: "He is ______ honorable member of the committee."',
        options: ['a', 'an', 'the', 'no article needed'],
        answer: 1,
        explanation: 'Since the letter H is silent in "honorable", the word starts with a vowel sound (o). Hence, we use "an". (தமிழ் விளக்கம்: "Honorable" என்ற சொல்லில் H மௌனமாக உள்ளது, எனவே உச்சரிப்பு உயிரெழுத்து ஒலியில் (o) தொடங்குவதால் "an" பயன்படுத்தப்பட வேண்டும்.)'
      },
      {
        id: 't8', topic: 'Synonym',
        question: 'Choose the correct synonym for "Reluctant":',
        options: ['Eager (ஆர்வமுள்ள)', 'Unwilling (விருப்பமில்லாத)', 'Ready (தயாரான)', 'Happy (மகிழ்ச்சியான)'],
        answer: 1,
        explanation: '"Reluctant" means unwilling and hesitant. Hence "Unwilling" is the correct synonym. (தமிழ் விளக்கம்: "Reluctant" என்றால் ஒரு செயலை செய்ய விருப்பமில்லாமல் தயங்குவதைக் குறிக்கும். எனவே "Unwilling" என்பதே சரியான இணைச்சொல்.)'
      },
      {
        id: 't9', topic: 'Blanks',
        question: 'The committee ______ divided in their opinions regarding the new database system.',
        options: ['was', 'were', 'is', 'has'],
        answer: 1,
        explanation: 'When a collective noun like "committee" acts as individuals with differing opinions, it takes a plural verb (were). (தமிழ் விளக்கம்: "Committee" என்பது கூட்டுப் பெயர்ச்சொல் (collective noun). எனினும் உறுப்பினர்கள் வெவ்வேறு கருத்துக்களைக் கொண்டிருக்கும்போது அது பன்மையாகக் கருதப்பட்டு "were" பயன்படுத்தப்படும்.)'
      },
      {
        id: 't10', topic: 'Relative Pronoun',
        question: 'Fill in the blank: "The candidate ______ resume was reviewed has been shortlisted."',
        options: ['who', 'whom', 'whose', 'which'],
        answer: 2,
        explanation: '"Whose" is a possessive relative pronoun. It is used to show ownership of the resume. (தமிழ் விளக்கம்: "Whose" என்பது யாருடைய என்ற உடைமையைக் குறிக்கும் சொல். "எந்த வேட்பாளரின் resume பார்க்கப்பட்டதோ..." என்று குறிக்க "whose" பயன்படுத்தப்படுகிறது.)'
      }
    ]
  },
  ssc: {
    label: 'SSC / RRB / NTPC English',
    color: '#06b6d4',
    emoji: '📋',
    description: 'Central Government exam questions on error detection, grammar rules, idioms and phrase substitution with detailed explanations.',
    questions: [
      {
        id: 's1', topic: 'Error Detection',
        question: 'Spot the grammatical error: "No sooner did the train arrived at the platform than the passengers rushed to board it."',
        options: ['No sooner did the', 'train arrived at the', 'than the passengers', 'No error'],
        answer: 1,
        explanation: 'Rule: The auxiliary verb "did" must always be followed by the base form of the verb (arrive). Correct: "did... arrive". (தமிழ் விளக்கம்: "did" என்ற துணைவினைச் சொல் வாக்கியத்தில் வரும்போது, அதற்கு அடுத்து வரும் முதன்மை வினைச்சொல் அதன் அடிப்படை வடிவில்தான் (V1 - base form) வர வேண்டும். "arrived" என்பது தவறு, "arrive" என்பதே சரி.)'
      },
      {
        id: 's2', topic: 'Fill in the Blank',
        question: 'The new manager was highly ______; she easily spotted the minor discrepancy in the draft proposal.',
        options: ['lethargic (சோம்பேறித்தனமான)', 'assiduous (முயற்சியும் கவனமும் கொண்ட)', 'dilatory (காலம் தாழ்த்தும்)', 'remiss (அலட்சியமான)'],
        answer: 1,
        explanation: '"Assiduous" means showing great care, attention, and effort. This fits the context of spotting a minor discrepancy. (தமிழ் விளக்கம்: "Assiduous" என்றால் மிகுந்த கவனமுடனும் விடாமுயற்சியுடனும் செயல்படுதல் என்று பொருள். சிறிய பிழையையும் கண்டுபிடித்தார் என்ற சூழலுக்கு இதுவே சரியானது.)'
      },
      {
        id: 's3', topic: 'Preposition',
        question: 'The company entered ______ a new joint venture with the local state government.',
        options: ['into', 'in', 'on', 'with'],
        answer: 0,
        explanation: 'Idiomatically, "enter into" is used when starting or entering an agreement, contract, or partnership. (தமிழ் விளக்கம்: ஒப்பந்தம் அல்லது கூட்டு முயற்சியில் முறைப்படி ஈடுபடும்போது "enter into" என்ற phrasal verb பயன்படுத்தப்படுகிறது.)'
      },
      {
        id: 's4', topic: 'One Word Substitution',
        question: 'Choose the one word substitution for: "A person who is indifferent to pains and pleasures of life."',
        options: ['Sadist', 'Stoic', 'Expatriate', 'Recluse'],
        answer: 1,
        explanation: 'A "Stoic" is a person who can endure pain or hardship without showing their feelings or complaining. (தமிழ் விளக்கம்: இன்ப துன்பங்களை சமமாக பாவிக்கும் மனப்பக்குவம் கொண்டவரை "Stoic" (உணர்ச்சியற்றவர்/சமநிலை உடையவர்) என்று அழைப்போம்.)'
      },
      {
        id: 's5', topic: 'Error Detection',
        question: 'Spot the error: "If I was you, I would have accepted the technical project lead offer."',
        options: ['If I was you', 'I would have', 'accepted the', 'No error'],
        answer: 0,
        explanation: 'In subjunctive mood/imaginary conditions, we use "were" instead of "was" for all subjects. Correct: "If I were you". (தமிழ் விளக்கம்: கற்பனையான நிபந்தனை வாக்கியங்களில் (subjunctive mood) "was" க்குப் பதில் அனைத்து எழுவாய்க்கும் (subjects) "were" மட்டுமே பயன்படுத்த வேண்டும்.)'
      },
      {
        id: 's6', topic: 'Idiom',
        question: 'What is the meaning of the idiom: "Take it with a grain of salt"?',
        options: [
          'To add seasoning to a meal',
          'To listen with skepticism or doubt',
          'To accept something completely',
          'To argue over trivial matters'
        ],
        answer: 1,
        explanation: 'To take something with a grain of salt means to view it with skepticism and not believe it entirely. (தமிழ் விளக்கம்: "Take it with a grain of salt" என்றால் ஒரு தகவலை முழுமையாக நம்பாமல் ஓரளவுக்கு சந்தேகக் கண்ணோடு பார்ப்பது என்று பொருள்.)'
      },
      {
        id: 's7', topic: 'Voice Change',
        question: 'Convert to Passive Voice: "The QA team discovered several severe bugs during migration."',
        options: [
          'Several severe bugs was discovered by the QA team.',
          'Several severe bugs were discovered by the QA team.',
          'Several severe bugs had discovered by the QA team.',
          'Several severe bugs were discover by the QA team.'
        ],
        answer: 1,
        explanation: 'Since "bugs" is plural, the past simple passive form is "were discovered". (தமிழ் விளக்கம்: "Bugs" பன்மை (plural) என்பதால், கடந்தகால செயப்பாட்டு வினையில் (Passive voice) "were discovered" என்று வரவேண்டும்.)'
      },
      {
        id: 's8', topic: 'Spellings',
        question: 'Identify the correctly spelled word:',
        options: ['Maintanance', 'Maintenance', 'Maintenence', 'Maintainance'],
        answer: 1,
        explanation: 'The correct spelling is "Maintenance" (no "a" in the suffix). (தமிழ் விளக்கம்: "Maintenance" (பராமரிப்பு) என்பது சரியான எழுத்துக்கோவை ஆகும். பல பொதுத்தேர்வுகளில் அடிக்கடி கேட்கப்படும் கேள்வி.)'
      }
    ]
  },
  banking: {
    label: 'Banking Exams (IBPS/SBI)',
    color: '#8b5cf6',
    emoji: '🏦',
    description: 'High-level English verbal ability questions focusing on double fillers, advanced sentence correction, and vocabulary standards.',
    questions: [
      {
        id: 'b1', topic: 'Double Fillers',
        question: 'Complete the sentence: "The government has decided not to ______ any further taxes on luxury goods to avoid ______ consumer spending."',
        options: [
          'impose, dampening (விதிப்பது, குறைப்பது)',
          'levy, fostering (விதிப்பது, வளர்ப்பது)',
          'exorcise, inflating (வெளியேற்றுவது, கூட்டுவது)',
          'implement, boosting (செயல்படுத்துவது, ஊக்குவிப்பது)'
        ],
        answer: 0,
        explanation: 'To "impose" taxes means to officially enforce them. To "dampen" spending means to reduce or discourage it. This fits logically. (தமிழ் விளக்கம்: ஆடம்பரப் பொருட்கள் மீது வரி "விதிப்பது" (impose) நுகர்வோர் வாங்குவதைக் "குறைப்பதை" (dampening) தவிர்க்கும் என்று பொருள்.)'
      },
      {
        id: 'b2', topic: 'Sentence Improvement',
        question: 'Choose the correct alternative: "If I had known about the server migration delay, I would have notified the client earlier."',
        options: [
          'I would notify',
          'I will notify',
          'I would have notified (No correction required)',
          'I should notify'
        ],
        answer: 2,
        explanation: 'Conditional Type 3: If + Past Perfect (had known) -> would have + Past Participle (would have notified). (தமிழ் விளக்கம்: கடந்த காலத்தில் நடக்காத ஒரு செயலைக் குறிப்பிடும் நிபந்தனை வாக்கிய வடிவம் (Type 3 conditional). "If + had + V3" வந்தால், அடுத்த வாக்கியத்தில் "would + have + V3" வரவேண்டும்.)'
      },
      {
        id: 'b3', topic: 'Conjunctions',
        question: 'Fill in the blank: "______ did the director announce the roadmap update, than the developers raised scheduling concerns."',
        options: ['Scarcely', 'Hardly', 'No sooner', 'Barely'],
        answer: 2,
        explanation: 'The correlative conjunction pair is "No sooner... than". For Scarcely/Hardly/Barely, we use "when". (தமிழ் விளக்கம்: வாக்கியத்தில் "than" என்ற இணைப்புச் சொல் வந்துள்ளதால் "No sooner" மட்டுமே பயன்படுத்த வேண்டும். "Hardly" அல்லது "Scarcely" வந்தால் "when" வரும்.)'
      },
      {
        id: 'b4', topic: 'Error Detection',
        question: 'Spot the error: "Neither the project director nor the developers was present at the sprint meeting."',
        options: ['Neither the project director', 'nor the developers', 'was present', 'No error'],
        answer: 2,
        explanation: 'Rule: When subjects are joined by "neither... nor", the verb agrees with the closer subject ("developers" which is plural, so it should be "were"). (தமிழ் விளக்கம்: "neither... nor" வரும்போது, வினைச்சொல் (verb) தனக்கு அருகில் இருக்கும் பெயரைக் கொண்டு ஒருமையா அல்லது பன்மையா என்று தீர்மானிக்கப்படும். "developers" பன்மை என்பதால் "were" வர வேண்டும்.)'
      }
    ]
  }
};

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

  const notes = [
    { title: '📌 Subject-Verb Agreement', content: '• Singular subject → singular verb. "Each student HAS..."\n• "Either/Neither/Everyone/Each" → always singular verb.\n• Two subjects joined by "and" → plural verb.\n• "The news IS..." (looks plural but singular noun).' },
    { title: '📌 Direct & Indirect Speech', content: '• Present Simple → Past Simple ("I work" → "He said he worked")\n• Present Continuous → Past Continuous\n• "Will" → "Would"\n• Exception: Universal truths do NOT change tense.\n  "The earth revolves around the sun." ✅' },
    { title: '📌 Tense Formula Sheet', content: '• Simple Past: V2 (went, did, saw)\n• Present Perfect: has/have + V3\n• Past Perfect: had + V3\n• Future: will + V1\n• Conditional: If + past → would (If I knew, I would tell)' },
    { title: '📌 Common Prepositions', content: '• at: specific time/place (at 5 PM, at home)\n• on: days/dates (on Monday, on 5th June)\n• in: months/years/large places (in June, in India)\n• for: duration (for 3 years)\n• since: point in time (since 2020)' },
  ];

  const strategies = [
    {
      title: '🎯 Topic Weightage & Important Segments (வினாக்கள் வரும் முக்கிய பகுதிகள்)',
      desc: 'In TNPSC & SSC, 70% of the English section is centered on three core segments: Spotting Errors, Active/Passive Voice, and Synonyms/Antonyms. Focus your studies here first to maximize your efficiency.',
      tamil: 'தமிழ் குறிப்பு: TNPSC மற்றும் SSC தேர்வுகளில் 70% கேள்விகள் பிழை கண்டறிதல் (Error Spotting), செய்வினை செயப்பாட்டு வினை (Active/Passive), மற்றும் பொருள்/எதிர்ச்சொல் ஆகியவற்றில் இருந்தே கேட்கப்படுகின்றன. எனவே இவற்றை முதலில் படியுங்கள்.'
    },
    {
      title: '💡 How to Spot Grammatical Errors Instantly (பிழைகளை எளிதாகக் கண்டுபிடிப்பது எப்படி?)',
      desc: 'Look for singular/plural disagreements, incorrect tense shifts, and wrong preposition pairings (e.g. "good at" vs "good in"). If a sentence starts with "No sooner did...", make sure it uses the base verb form and is followed by "than" (not "when").',
      tamil: 'தமிழ் குறிப்பு: ஒருமையில் தொடங்கும் வாக்கியத்திற்கு பன்மை வினைகளும் (Verb), பன்மையில் தொடங்கும் வாக்கியத்திற்கு ஒருமை வினைகளும் வரக் கூடாது. "did" வந்தால் "arrive" என்றுதான் வர வேண்டும், "arrived" என்று வரக் கூடாது.'
    },
    {
      title: '⚡ Previous Years\' Questions (PYQ) Crack Strategy (கடந்த கால வினாத்தாள் உத்தி)',
      desc: 'Solve at least 10 previous years\' question sets. Grammatical patterns repeat constantly! Take note of questions testing articles ("an honest man", "a university") and subject-verb inversion (e.g. "Hardly had I arrived...").',
      tamil: 'தமிழ் குறிப்பு: குறைந்தபட்சம் 10 வருட பழைய வினாத்தாள்களை பயிற்சி செய்யுங்கள். ஏனெனில், இலக்கண அமைப்புகள் அடிக்கடி மீண்டும் மீண்டும் கேட்கப்படும். குறிப்பாக "honest", "hour" போன்ற சொற்களுக்கு "an" பயன்படுத்துவதை நினைவில் கொள்ளுங்கள்.'
    }
  ];

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
          {strategies.map((st, i) => (
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
          {notes.map((n, i) => (
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
