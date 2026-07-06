import React, { useState, useMemo } from 'react';
import { Search, Volume2, Shuffle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ─── DATA ────────────────────────────────────────────────────────────────────

const phrasalVerbsData = [
  // GET
  { verb: 'get up', meaning: 'To rise from bed or a seat', tamil: 'தூக்கத்திலிருந்து எழுவது', example: 'I get up at 6 AM every day.', base: 'get' },
  { verb: 'get along', meaning: 'To have a good relationship with someone', tamil: 'நன்றாக பழகுவது', example: 'She gets along well with her team.', base: 'get' },
  { verb: 'get over', meaning: 'To recover from an illness or difficulty', tamil: 'சிரமத்திலிருந்து மீள்வது', example: 'It took me a week to get over the cold.', base: 'get' },
  { verb: 'get by', meaning: 'To manage with limited resources', tamil: 'குறைந்த வளங்களில் சமாளிப்பது', example: 'She gets by with basic English at work.', base: 'get' },
  { verb: 'get ahead', meaning: 'To make progress in a career or life', tamil: 'வாழ்க்கையில் முன்னேறுவது', example: 'Hard work helps you get ahead.', base: 'get' },
  { verb: 'get away', meaning: 'To escape or take a vacation', tamil: 'தப்பிப்பது அல்லது ஓய்வெடுப்பது', example: 'Let\'s get away for the weekend.', base: 'get' },

  // PUT
  { verb: 'put off', meaning: 'To delay or postpone something', tamil: 'ஒத்திவைப்பது', example: 'Don\'t put off your work until the last minute.', base: 'put' },
  { verb: 'put up with', meaning: 'To tolerate something unpleasant', tamil: 'தாங்கிக்கொள்வது', example: 'I cannot put up with rude behavior.', base: 'put' },
  { verb: 'put forward', meaning: 'To suggest an idea or plan', tamil: 'யோசனை முன்வைப்பது', example: 'She put forward an innovative solution.', base: 'put' },
  { verb: 'put across', meaning: 'To communicate clearly', tamil: 'தெளிவாக கூறுவது', example: 'He put his ideas across very well in the meeting.', base: 'put' },
  { verb: 'put in', meaning: 'To contribute effort or time', tamil: 'நேரம்/முயற்சி செலுத்துவது', example: 'She puts in 10 hours of work daily.', base: 'put' },

  // TAKE
  { verb: 'take on', meaning: 'To accept a responsibility or challenge', tamil: 'பொறுப்பை ஏற்றுக்கொள்வது', example: 'Are you ready to take on this project?', base: 'take' },
  { verb: 'take off', meaning: 'To leave the ground (plane) or become successful', tamil: 'வெற்றிகரமாக தொடங்குவது', example: 'Her career really took off after the promotion.', base: 'take' },
  { verb: 'take over', meaning: 'To assume control of something', tamil: 'கட்டுப்பாட்டை எடுத்துக்கொள்வது', example: 'She took over as the team lead.', base: 'take' },
  { verb: 'take up', meaning: 'To begin a new hobby or activity', tamil: 'புதிய பழக்கத்தை தொடங்குவது', example: 'He took up public speaking to improve himself.', base: 'take' },
  { verb: 'take in', meaning: 'To understand or absorb information', tamil: 'தகவலை புரிந்துகொள்வது', example: 'There was too much to take in at the seminar.', base: 'take' },

  // LOOK
  { verb: 'look up', meaning: 'To search for information', tamil: 'தகவல் தேடுவது', example: 'Look up the meaning in the dictionary.', base: 'look' },
  { verb: 'look into', meaning: 'To investigate something', tamil: 'விசாரணை செய்வது', example: 'The manager will look into the issue.', base: 'look' },
  { verb: 'look forward to', meaning: 'To be excited about something in the future', tamil: 'எதிர்காலத்தை ஆவலுடன் எதிர்பார்ப்பது', example: 'I look forward to working with your team.', base: 'look' },
  { verb: 'look out', meaning: 'To be careful or watch for danger', tamil: 'கவனமாக இருப்பது', example: 'Look out for possible security vulnerabilities.', base: 'look' },
  { verb: 'look up to', meaning: 'To respect and admire someone', tamil: 'யாரையாவது மதிப்பது', example: 'She looks up to her mentor greatly.', base: 'look' },

  // MAKE
  { verb: 'make up', meaning: 'To invent a story or reconcile after a fight', tamil: 'கதை கட்டுவது அல்லது சமாதானமாவது', example: 'Don\'t make up excuses for being late.', base: 'make' },
  { verb: 'make out', meaning: 'To understand or manage', tamil: 'புரிந்துகொள்வது', example: 'I can\'t make out what he is saying.', base: 'make' },
  { verb: 'make up for', meaning: 'To compensate for something', tamil: 'ஈடுசெய்வது', example: 'He worked overtime to make up for the delay.', base: 'make' },
  { verb: 'make do', meaning: 'To manage with what is available', tamil: 'கிடைத்ததில் சமாளிப்பது', example: 'We had to make do with limited resources.', base: 'make' },

  // RUN
  { verb: 'run out of', meaning: 'To have no more of something', tamil: 'தீர்ந்துபோவது', example: 'We ran out of time before the demo.', base: 'run' },
  { verb: 'run into', meaning: 'To meet someone unexpectedly', tamil: 'எதிர்பாராத சந்திப்பு', example: 'I ran into my old colleague at the conference.', base: 'run' },
  { verb: 'run through', meaning: 'To review or rehearse quickly', tamil: 'விரைவாக மீளாய்வு செய்வது', example: 'Let\'s run through the presentation once more.', base: 'run' },
  { verb: 'run over', meaning: 'To go beyond a time limit', tamil: 'நேர வரம்பை தாண்டுவது', example: 'The meeting ran over by 30 minutes.', base: 'run' },

  // GIVE
  { verb: 'give up', meaning: 'To stop trying; to quit', tamil: 'விட்டுவிடுவது / தியாகம் செய்வது', example: 'Never give up on your goals.', base: 'give' },
  { verb: 'give in', meaning: 'To yield or surrender', tamil: 'தோற்றுப்போவது', example: 'Don\'t give in to peer pressure.', base: 'give' },
  { verb: 'give away', meaning: 'To reveal a secret or donate something', tamil: 'ரகசியத்தை வெளிப்படுத்துவது', example: 'His nervous smile gave away his plan.', base: 'give' },
  { verb: 'give out', meaning: 'To distribute or stop working', tamil: 'வழங்குவது / நிறுத்திவிடுவது', example: 'Please give out the handouts to everyone.', base: 'give' },

  // BRING
  { verb: 'bring up', meaning: 'To mention a topic or raise a child', tamil: 'பேச்சுக்கு எடுப்பது / குழந்தை வளர்ப்பது', example: 'She brought up an important point in the meeting.', base: 'bring' },
  { verb: 'bring about', meaning: 'To cause something to happen', tamil: 'ஒரு மாற்றத்தை ஏற்படுத்துவது', example: 'Technology has brought about major changes.', base: 'bring' },
  { verb: 'bring forward', meaning: 'To move a meeting to an earlier time', tamil: 'முன்னதாக நகர்த்துவது', example: 'Can we bring forward the review meeting?', base: 'bring' },

  // TURN
  { verb: 'turn down', meaning: 'To reject an offer or reduce volume', tamil: 'நிராகரிப்பது / குறைப்பது', example: 'He turned down the job offer for a better one.', base: 'turn' },
  { verb: 'turn up', meaning: 'To arrive or increase volume', tamil: 'வந்து சேர்வது / அதிகரிப்பது', example: 'She turned up late to the standup.', base: 'turn' },
  { verb: 'turn out', meaning: 'To result in a particular way', tamil: 'ஒரு குறிப்பிட்ட விளைவில் முடிவதல்', example: 'The launch turned out to be a huge success.', base: 'turn' },
  { verb: 'turn over', meaning: 'To hand control to someone else', tamil: 'கட்டுப்பாட்டை கையளிப்பது', example: 'He turned over the project to a new lead.', base: 'turn' },

  // COME
  { verb: 'come across', meaning: 'To find something unexpectedly', tamil: 'எதிர்பாராமல் கண்டுபிடிப்பது', example: 'I came across a great article on LinkedIn.', base: 'come' },
  { verb: 'come up with', meaning: 'To think of an idea or solution', tamil: 'யோசனை உருவாக்குவது', example: 'She came up with a brilliant marketing idea.', base: 'come' },
  { verb: 'come around', meaning: 'To change one\'s opinion', tamil: 'மனதை மாற்றிக்கொள்வது', example: 'He eventually came around to our point of view.', base: 'come' },
];

const allBases = ['all', ...new Set(phrasalVerbsData.map(v => v.base))];

// ─── QUIZ COMPONENT ───────────────────────────────────────────────────────────

const QuizMode = ({ verbs, onBack }) => {
  const { addXp } = useAppContext();
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

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.85;
      window.speechSynthesis.speak(u);
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
  const [search, setSearch] = useState('');
  const [selectedBase, setSelectedBase] = useState('all');
  const [quizMode, setQuizMode] = useState(false);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

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
