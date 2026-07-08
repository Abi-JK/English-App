import React, { useState, useMemo } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, MessageSquare, Send, Mic, Lightbulb } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';

const replyScenarios = [
  {
    id: 'r1',
    category: 'Daily Life',
    context: 'You are at a grocery store. The cashier smiles and asks:',
    speakerLine: 'Hi there! Did you find everything you were looking for today?',
    expectedReply: 'Yes, thank you! I found everything I needed.',
    tips: 'This is a common friendly question. A simple "Yes, thank you" works perfectly.',
    difficulty: 'Beginner',
  },
  {
    id: 'r2',
    category: 'Daily Life',
    context: 'A neighbour greets you in the elevator:',
    speakerLine: 'Good morning! Beautiful weather we are having today, is not it?',
    expectedReply: 'Good morning! Yes, it is lovely. Perfect for a walk.',
    tips: 'Agree and add a small comment. British people love talking about weather!',
    difficulty: 'Beginner',
  },
  {
    id: 'r3',
    category: 'Office / IT',
    context: 'In a team meeting. Your manager just finished explaining a new feature and asks:',
    speakerLine: 'Does anyone have any questions about the requirements I just shared?',
    expectedReply: 'Yes, I have a question about the timeline. When do we need to deliver this?',
    tips: 'Asking questions in meetings shows engagement. Use phrases like "I have a question about..."',
    difficulty: 'Intermediate',
  },
  {
    id: 'r4',
    category: 'Office / IT',
    context: 'A colleague from the US team calls you on Teams:',
    speakerLine: 'Hey, do you have a minute? I need your input on the database schema we are designing.',
    expectedReply: 'Sure, I have some time right now. Let me pull up the schema diagram.',
    tips: 'Always acknowledge availability first. Then mention what you will do.',
    difficulty: 'Intermediate',
  },
  {
    id: 'r5',
    category: 'Exam / Interview',
    context: 'HR interviewer asks you at the start of the interview:',
    speakerLine: 'Could you please tell me a little about yourself and your background?',
    expectedReply: 'Sure. I have a degree in Computer Science and three years of experience in full-stack development.',
    tips: 'Keep it professional. Mention education, experience, and key skills. Practice this!',
    difficulty: 'Intermediate',
  },
  {
    id: 'r6',
    category: 'Daily Life',
    context: 'At a restaurant. The waiter comes to your table:',
    speakerLine: 'Good evening! Are you ready to order, or would you like a few more minutes?',
    expectedReply: 'I think we need a few more minutes to decide. Could you come back in five minutes?',
    tips: 'Politely asking for more time is perfectly normal. Use "Could you..." for polite requests.',
    difficulty: 'Beginner',
  },
  {
    id: 'r7',
    category: 'Office / IT',
    context: 'Your team lead sends you a direct message on Slack:',
    speakerLine: 'The client has requested a change in the UI design. Can we discuss this before the standup?',
    expectedReply: 'Sure, I am free right now. Let me check the new requirements and we can discuss.',
    tips: 'Show availability and willingness. Use "let me" to show proactive attitude.',
    difficulty: 'Intermediate',
  },
  {
    id: 'r8',
    category: 'Exam / Interview',
    context: 'The interviewer asks about your weakness:',
    speakerLine: 'What would you say is your biggest professional weakness?',
    expectedReply: 'I sometimes spend too much time perfecting code. But I am learning to balance quality with deadlines.',
    tips: 'Use the "growth mindset" approach: mention a real weakness + how you are improving it.',
    difficulty: 'Advanced',
  },
  {
    id: 'r9',
    category: 'Daily Life',
    context: 'A friend invites you to a party:',
    speakerLine: 'Hey, I am having a small get-together this Saturday. Would you like to come?',
    expectedReply: 'That sounds great! Thank you for inviting me. What time should I come?',
    tips: 'Accept the invitation warmly and ask for details. Shows interest and enthusiasm.',
    difficulty: 'Beginner',
  },
  {
    id: 'r10',
    category: 'Office / IT',
    context: 'During a performance review, your manager says:',
    speakerLine: 'I really appreciated how you handled the production issue last month. Great work under pressure.',
    expectedReply: 'Thank you. I was glad I could help resolve it quickly. I learned a lot from that experience.',
    tips: 'Accept praise gracefully. Then mention what you learned. Avoid deflecting compliments.',
    difficulty: 'Advanced',
  },
  {
    id: 'r11',
    category: 'Exam / Interview',
    context: 'The interviewer asks about your salary expectations:',
    speakerLine: 'What are your salary expectations for this position?',
    expectedReply: 'Based on my experience and market research, I am looking for a range between 8 to 10 LPA.',
    tips: 'Give a range, not a fixed number. Research market rates before the interview.',
    difficulty: 'Advanced',
  },
  {
    id: 'r12',
    category: 'Daily Life',
    context: 'Someone accidentally bumps into you on the street:',
    speakerLine: 'Oh, I am so sorry! I was not looking where I was going.',
    expectedReply: 'No problem at all. It happens. Hope you have a great day!',
    tips: 'Be forgiving and polite. "No problem" or "It is okay" are standard replies.',
    difficulty: 'Beginner',
  },
  {
    id: 'r13',
    category: 'Office / IT',
    context: 'During a client call, the client asks:',
    speakerLine: 'Can you give me a timeline for when this feature will be ready for testing?',
    expectedReply: 'We expect to complete development by next Friday. Testing should begin the following Monday.',
    tips: 'Be specific about dates. Use "we expect" instead of "I think" to sound more confident.',
    difficulty: 'Intermediate',
  },
  {
    id: 'r14',
    category: 'Exam / Interview',
    context: 'Group discussion topic introduced by the moderator:',
    speakerLine: 'The topic for today is "Should social media be regulated?" Please share your views.',
    expectedReply: 'I believe social media needs reasonable regulation to prevent misinformation while protecting free speech.',
    tips: 'Start with your stance. Then give one strong reason. Stay balanced and polite.',
    difficulty: 'Advanced',
  },
  {
    id: 'r15',
    category: 'Daily Life',
    context: 'You call a company for customer support:',
    speakerLine: 'Thank you for calling XYZ support. How can I assist you today?',
    expectedReply: 'Hi, I am having an issue with my internet connection. It has been disconnecting frequently since yesterday.',
    tips: 'Greet first, then state the problem clearly. Mention when the problem started.',
    difficulty: 'Intermediate',
  },
];

const ReplyChallenge = () => {
  const { addXp } = useAppContext();
  const { speak, isRecording, transcript, setTranscript, toggleRecording } = useSpeech();
  const [category, setCategory] = useState('all');
  const [qIndex, setQIndex] = useState(0);
  const [userReply, setUserReply] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const filtered = useMemo(() =>
    category === 'all' ? replyScenarios : replyScenarios.filter(s => s.category === category),
    [category]
  );

  const current = filtered[qIndex];

  const categories = ['all', ...new Set(replyScenarios.map(s => s.category))];

  const startNewSession = () => {
    setQIndex(0);
    setUserReply('');
    setSubmitted(false);
    setScore(0);
    setFinished(false);
    setAttempts(0);
  };

  const handleSpeakLine = () => speak(current.speakerLine);

  const handleSubmitReply = () => {
    if (!userReply.trim() && !transcript.trim()) return;
    setSubmitted(true);
    setAttempts(a => a + 1);

    const reply = userReply.trim() || transcript.trim();
    const expected = current.expectedReply.toLowerCase();
    const replyLower = reply.toLowerCase();

    const commonWords = replyLower.split(' ').filter(w =>
      expected.split(' ').includes(w) && w.length > 2
    ).length;

    const matchScore = Math.min(100, Math.round((commonWords / Math.max(expected.split(' ').filter(w => w.length > 2).length, 1)) * 100));

    if (matchScore >= 50) {
      addXp(25);
    }
    return matchScore;
  };

  const handleNext = () => {
    if (qIndex < filtered.length - 1) {
      setQIndex(i => i + 1);
      setUserReply('');
      setTranscript('');
      setSubmitted(false);
    } else {
      setFinished(true);
      if (score > 0) addXp(50);
    }
  };

  const handleRecordReply = () => {
    setTranscript('');
    toggleRecording();
  };

  const matchScore = submitted ? (() => {
    const reply = (userReply.trim() || transcript.trim()).toLowerCase();
    const expected = current.expectedReply.toLowerCase();
    const commonWords = reply.split(' ').filter(w =>
      expected.split(' ').includes(w) && w.length > 2
    ).length;
    return Math.min(100, Math.round((commonWords / Math.max(expected.split(' ').filter(w => w.length > 2).length, 1)) * 100));
  })() : 0;

  if (finished) {
    const pct = Math.round((score / filtered.length) * 100);
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>{pct >= 70 ? '🎤✨' : '💪'}</div>
        <h2>Practice Session Complete!</h2>
        <div style={{ fontSize: '48px', fontWeight: '800', color: pct >= 70 ? '#10b981' : '#f59e0b', marginBottom: '8px' }}>
          {score}/{filtered.length}
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
          {pct >= 70 ? 'Great job! You are improving your reply skills!' : 'Keep practicing! You are getting better.'}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
          {filtered.length} scenarios practiced · +{score * 25 + (score > 0 ? 50 : 0)} XP earned
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={startNewSession}>← Back</button>
          <button className="btn-primary" onClick={startNewSession}><RotateCcw size={14} /> Practice Again</button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
        <h2>No scenarios found</h2>
        <p style={{ color: 'var(--text-muted)' }}>Try selecting a different category.</p>
        <button className="btn-primary" onClick={startNewSession} style={{ marginTop: '16px' }}>
          Reset
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', margin: '0 0 4px' }}>💬 Reply Challenge</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          You understand English when others speak — now practice replying confidently!
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => { setCategory(cat); startNewSession(); }}
            style={{
              padding: '6px 16px', borderRadius: '20px', border: '1.5px solid',
              borderColor: category === cat ? 'var(--primary-color)' : 'var(--border-color)',
              background: category === cat ? 'var(--primary-color)' : 'transparent',
              color: category === cat ? 'white' : 'var(--text-muted)',
              fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
            }}>
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      <div className="progress-bar-bg" style={{ marginBottom: '20px' }}>
        <div className="progress-bar-fill" style={{ width: `${(qIndex / filtered.length) * 100}%` }} />
      </div>

      <div className="card" style={{ borderTop: '3px solid var(--primary-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', background: 'rgba(0,150,136,0.1)', color: 'var(--primary-color)', padding: '3px 10px', borderRadius: '10px', fontWeight: '700' }}>
              {current.category} · {current.difficulty}
            </span>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {qIndex + 1} / {filtered.length}
          </span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '16px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📖 Situation
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{current.context}</p>
        </div>

        <div style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '700', textTransform: 'uppercase' }}>
              🎧 They say:
            </div>
            <button onClick={handleSpeakLine} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              <Volume2 size={14} /> Hear it
            </button>
          </div>
          <p style={{ fontSize: '17px', fontWeight: '600', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>
            "{current.speakerLine}"
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase' }}>
            ✍️ Your reply:
          </div>

          {!submitted ? (
            <>
              <textarea
                value={userReply || transcript}
                onChange={e => setUserReply(e.target.value)}
                placeholder="Type your reply here... (or use the mic to speak)"
                style={{
                  width: '100%', minHeight: '80px', padding: '14px', borderRadius: '10px',
                  border: '2px solid var(--border-color)', background: 'var(--bg-color)',
                  color: 'var(--text-main)', fontSize: '15px', resize: 'vertical',
                  marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'var(--font-family)',
                }}
              />
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={handleRecordReply} style={{
                  padding: '10px 18px', borderRadius: '8px', border: '2px solid',
                  borderColor: isRecording ? '#ef4444' : 'var(--border-color)',
                  background: isRecording ? 'rgba(239,68,68,0.1)' : 'transparent',
                  color: isRecording ? '#ef4444' : 'var(--text-muted)',
                  cursor: 'pointer', fontWeight: '600', fontSize: '13px',
                  display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                }}>
                  <Mic size={16} /> {isRecording ? 'Stop Recording' : 'Speak Reply'}
                </button>
                <button className="btn-primary" onClick={handleSubmitReply}
                  disabled={!userReply.trim() && !transcript.trim()}
                  style={{ opacity: (!userReply.trim() && !transcript.trim()) ? 0.5 : 1 }}>
                  <Send size={14} /> Submit Reply
                </button>
              </div>
              {isRecording && (
                <div style={{ marginTop: '8px', fontSize: '13px', color: '#ef4444', fontWeight: '600' }}>
                  🎙️ Listening... Speak your reply clearly.
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{
                padding: '14px', borderRadius: '10px', marginBottom: '12px',
                background: matchScore >= 50 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border: `2px solid ${matchScore >= 50 ? '#10b981' : '#ef4444'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {matchScore >= 50 ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
                  <span style={{ fontWeight: '700', color: matchScore >= 50 ? '#10b981' : '#ef4444' }}>
                    {matchScore >= 50 ? `Good reply! +25 XP (Match: ${matchScore}%)` : `Keep trying (Match: ${matchScore}%)`}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  You said: "{userReply || transcript}"
                </div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: '8px', padding: '14px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', marginBottom: '6px' }}>
                  ✅ A good reply would be:
                </div>
                <p style={{ fontSize: '15px', fontWeight: '500', margin: 0 }}>"{current.expectedReply}"</p>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.06)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                  <Lightbulb size={14} /> Tip
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>{current.tips}</p>
              </div>

              <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center' }}>
                {qIndex === filtered.length - 1 ? 'See Results' : 'Next Scenario'} <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card" style={{ background: 'rgba(0,150,136,0.04)', border: '1px solid rgba(0,150,136,0.15)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
          💡 <strong>Tip:</strong> Many people can <strong>understand</strong> English perfectly but struggle to reply.
          The secret is to practice common response patterns. Start with short, simple replies and gradually make them longer!
        </p>
      </div>
    </div>
  );
};

export default ReplyChallenge;