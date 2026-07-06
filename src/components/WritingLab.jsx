import React, { useState } from 'react';
import { FileText, Mail, BookOpen, Copy, Check, Volume2, AlertTriangle, CheckCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ─── SENTENCE ERROR RULES ────────────────────────────────────────────────────

const errorRules = [
  {
    id: 'double_space',
    pattern: /  +/g,
    label: 'Extra Space',
    color: '#f59e0b',
    fix: (s) => s.replace(/  +/g, ' '),
    tip: 'Avoid double spaces between words.',
    tamil: 'இரண்டு இடைவெளிகள் தவிர்க்கவும்.',
  },
  {
    id: 'a_vowel',
    pattern: /\b[aA] ([aeiouAEIOU])/g,
    label: 'Article Error (a → an)',
    color: '#ef4444',
    fix: (s) => s.replace(/\b([aA]) ([aeiouAEIOU])/g, (_, art, next) => (art === 'A' ? 'An' : 'an') + ' ' + next),
    tip: 'Use "an" before words that start with a vowel sound (a, e, i, o, u).',
    tamil: '"a" க்கு பதில் உயிரெழுத்தில் தொடங்கும் சொல்லுக்கு முன் "an" பயன்படுத்தவும்.',
  },
  {
    id: 'i_lowercase',
    pattern: /\b i \b/g,
    label: 'Lowercase "i"',
    color: '#ef4444',
    fix: (s) => s.replace(/\b i \b/g, ' I '),
    tip: 'The pronoun "I" should always be capitalized.',
    tamil: '"I" என்ற சர்வநாமம் எப்போதும் பெரிய எழுத்தில் இருக்க வேண்டும்.',
  },
  {
    id: 'dont_singular',
    pattern: /\b(he|she|it|He|She|It)\s+don't\b/g,
    label: 'Subject-Verb Error',
    color: '#8b5cf6',
    fix: (s) => s.replace(/\b(he|she|it|He|She|It)\s+don't\b/g, '$1 doesn\'t'),
    tip: 'He/She/It → doesn\'t (not don\'t).',
    tamil: '"He/She/It" வரும்போது "don\'t" தவறு — "doesn\'t" சரி.',
  },
  {
    id: 'was_were',
    pattern: /\bIf I was\b/g,
    label: 'Subjunctive Error',
    color: '#8b5cf6',
    fix: (s) => s.replace(/\bIf I was\b/g, 'If I were'),
    tip: 'In imaginary/conditional sentences use "were" not "was" for all subjects.',
    tamil: 'கற்பனை நிபந்தனை வாக்கியங்களில் "was" இல்லை — "were" சரி.',
  },
  {
    id: 'since_for',
    pattern: /\bsince \d+ (years|months|days|hours|minutes)\b/gi,
    label: 'Since vs For Error',
    color: '#06b6d4',
    fix: (s) => s.replace(/\bsince (\d+ (?:years|months|days|hours|minutes))\b/gi, 'for $1'),
    tip: 'Use "for" with a duration (e.g. for 5 years). Use "since" with a point in time (e.g. since 2019).',
    tamil: 'காலத்தின் அளவுக்கு "for", குறிப்பிட்ட தொடக்க நேரத்திற்கு "since".',
  },
  {
    id: 'much_many',
    pattern: /\bmuch (books|chairs|people|students|cars|files|errors|words)\b/gi,
    label: '"much" vs "many" Error',
    color: '#10b981',
    fix: (s) => s.replace(/\bmuch (books|chairs|people|students|cars|files|errors|words)\b/gi, 'many $1'),
    tip: 'Use "many" with countable nouns and "much" with uncountable nouns.',
    tamil: 'எண்ணக்கூடிய (countable) பெயர்களுக்கு "many", எண்ண முடியாத (uncountable) பெயர்களுக்கு "much".',
  },
];

function analyzesentence(text) {
  const issues = [];
  errorRules.forEach((rule) => {
    if (rule.pattern.test(text)) {
      rule.pattern.lastIndex = 0;
      issues.push(rule);
    }
    rule.pattern.lastIndex = 0;
  });
  return issues;
}

function autoFix(text) {
  let fixed = text;
  errorRules.forEach((rule) => {
    fixed = rule.fix(fixed);
    rule.pattern.lastIndex = 0;
  });
  return fixed;
}

// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────

const emailTemplates = [
  {
    id: 'apology',
    label: '😔 Apology / Delay',
    emoji: '😔',
    subject: 'Apology for the Delay in {task}',
    body: `Dear {name},

I sincerely apologize for the delay in delivering {task}. I understand this may have caused inconvenience and I take full responsibility.

The reason for the delay was {reason}. I have now resolved the issue and {task} will be completed by {date}.

I assure you this will not happen again. Thank you for your patience and understanding.

Warm regards,
{your_name}`,
  },
  {
    id: 'followup',
    label: '📬 Follow-Up',
    emoji: '📬',
    subject: 'Follow-Up: {subject}',
    body: `Dear {name},

I hope this email finds you well. I am following up on my previous email dated {date} regarding {subject}.

Could you please provide an update on the current status? I would appreciate your response at your earliest convenience.

If you need any additional information from my end, please feel free to reach out.

Best regards,
{your_name}`,
  },
  {
    id: 'leave',
    label: '🌴 Leave Request',
    emoji: '🌴',
    subject: 'Leave Request – {from_date} to {to_date}',
    body: `Dear {manager_name},

I am writing to request leave from {from_date} to {to_date} ({days} working days) due to {reason}.

I will ensure all pending tasks are completed and a proper handover note will be shared before I leave. I am reachable on email during the leave period for any urgent matters.

Please let me know if you need any further information.

Thank you for your consideration.

Regards,
{your_name}`,
  },
  {
    id: 'thankyou',
    label: '🙏 Thank You',
    emoji: '🙏',
    subject: 'Thank You – {occasion}',
    body: `Dear {name},

I wanted to take a moment to sincerely thank you for {reason}. Your support and guidance have made a significant difference and I truly appreciate it.

It has been a pleasure working with you and I look forward to continuing our collaboration.

With gratitude,
{your_name}`,
  },
  {
    id: 'introduction',
    label: '👋 Self Introduction',
    emoji: '👋',
    subject: 'Introduction – {your_name}, {your_role}',
    body: `Dear {name},

I hope you are doing well. My name is {your_name} and I have recently joined as a {your_role} in the {department} team.

I am excited to be part of this organization and look forward to contributing meaningfully to our team goals. I would love to connect with you and learn more about your work.

Please feel free to reach out to me at {email} or {phone}.

Best regards,
{your_name}`,
  },
];

// ─── PARAGRAPH TOPICS ────────────────────────────────────────────────────────

const paragraphTopics = [
  { label: 'Importance of English', icon: '🌐' },
  { label: 'My Dream Career', icon: '🚀' },
  { label: 'Benefits of Reading', icon: '📚' },
  { label: 'Technology in Education', icon: '💻' },
  { label: 'Healthy Lifestyle', icon: '🏃' },
  { label: 'Teamwork in the Workplace', icon: '🤝' },
  { label: 'My Strengths', icon: '💪' },
  { label: 'Climate Change Awareness', icon: '🌱' },
];

const paragraphScaffolds = {
  'Importance of English': {
    introduction: 'English is one of the most widely spoken languages in the world, connecting people across cultures and borders.',
    point1: 'Professionally, English proficiency opens doors to global career opportunities and helps in effective corporate communication.',
    point2: 'Academically, most research papers, textbooks, and online learning resources are published in English, making it essential for higher education.',
    conclusion: 'In an increasingly connected world, mastering English is no longer optional — it is a vital life skill.',
    cta: 'Start by reading one English article daily and speaking at least 10 minutes in English every day.',
  },
  'My Dream Career': {
    introduction: 'Ever since childhood, I have been passionate about technology and problem-solving, which has shaped my dream of becoming a software engineer.',
    point1: 'Software engineering offers the opportunity to build innovative products that can positively impact millions of people\'s lives.',
    point2: 'To achieve this dream, I am constantly upskilling through online courses, personal projects, and competitive programming.',
    conclusion: 'My dream career is not just about success — it is about making a meaningful difference through technology.',
    cta: 'Take one step today: complete an online course, build a small project, or reach out to a mentor.',
  },
  'Benefits of Reading': {
    introduction: 'Reading is one of the most powerful habits a person can develop, offering lifelong benefits to the mind and personality.',
    point1: 'Regular reading improves vocabulary, grammar, and overall communication skills, making it essential for language learners.',
    point2: 'Beyond language, reading broadens perspective, enhances focus, and reduces stress significantly.',
    conclusion: 'Whether it is fiction, self-help, or academic content, reading for just 20 minutes a day can transform your thinking.',
    cta: 'Pick a book that interests you and commit to reading at least 10 pages every day.',
  },
  'Technology in Education': {
    introduction: 'Technology has transformed the way we learn, making education more accessible, interactive, and personalized than ever before.',
    point1: 'Digital platforms and AI-powered tools allow students to learn at their own pace and receive instant, targeted feedback.',
    point2: 'Online classes and educational apps break geographical barriers, giving equal learning opportunities to students in remote areas.',
    conclusion: 'When used wisely, technology is not a distraction but a powerful accelerator of learning and growth.',
    cta: 'Explore one new educational platform this week and build a 30-minute daily learning habit.',
  },
  'Healthy Lifestyle': {
    introduction: 'Maintaining a healthy lifestyle is one of the greatest investments a person can make in their long-term wellbeing and productivity.',
    point1: 'Regular physical exercise improves not only physical fitness but also mental sharpness, concentration, and emotional resilience.',
    point2: 'A balanced diet rich in nutrients fuels the body and brain, directly impacting energy levels and cognitive performance.',
    conclusion: 'Small consistent actions — a daily walk, healthy meals, and adequate sleep — compound into extraordinary health benefits over time.',
    cta: 'Start tomorrow: wake up 30 minutes earlier for a morning walk and swap one junk food with a fruit.',
  },
  'Teamwork in the Workplace': {
    introduction: 'In any organization, the ability to work effectively as part of a team is just as important as individual technical skills.',
    point1: 'Strong teamwork brings together diverse perspectives and skills, leading to more creative solutions and higher quality outcomes.',
    point2: 'Open communication, mutual respect, and shared accountability are the three pillars that make any team successful.',
    conclusion: 'Building a collaborative culture where every member feels valued is the foundation of sustainable organizational growth.',
    cta: 'Actively listen in your next team meeting and offer one constructive suggestion to support a colleague\'s idea.',
  },
  'My Strengths': {
    introduction: 'Understanding your personal strengths is the first step towards building a purposeful and successful career.',
    point1: 'My ability to learn quickly and adapt to new technologies helps me stay relevant in a fast-changing industry.',
    point2: 'I am known for my attention to detail and my commitment to delivering high-quality work, even under tight deadlines.',
    conclusion: 'By continuously building on my strengths and addressing my weaknesses, I am confident in achieving my professional goals.',
    cta: 'Write down your top 3 strengths and think about one concrete example from your experience that demonstrates each.',
  },
  'Climate Change Awareness': {
    introduction: 'Climate change is one of the most urgent challenges facing humanity today, requiring immediate collective action at every level.',
    point1: 'Rising global temperatures, extreme weather events, and melting glaciers are clear signs that our planet is in crisis.',
    point2: 'Individuals can contribute by reducing plastic use, choosing sustainable transport, and supporting eco-friendly policies.',
    conclusion: 'The future of our planet depends on the choices we make today — every small action towards sustainability matters.',
    cta: 'Start this week: carry a reusable bag, reduce single-use plastic, and plant one tree in your community.',
  },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const WritingLab = () => {
  const { addXp } = useAppContext();
  const [activeTab, setActiveTab] = useState('fixer');

  // Sentence Fixer state
  const [inputSentence, setInputSentence] = useState('');
  const [fixerResult, setFixerResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Email Template state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [fields, setFields] = useState({});

  // Paragraph Builder state
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [paraCopied, setParaCopied] = useState(false);

  // ── Sentence Fixer ──
  const handleAnalyze = () => {
    if (!inputSentence.trim()) return;
    const issues = analyzesentence(inputSentence);
    const fixed = autoFix(inputSentence);
    setFixerResult({ issues, fixed, original: inputSentence });
    if (issues.length === 0) addXp(10);
  };

  const handleCopyFixed = () => {
    if (fixerResult?.fixed) {
      navigator.clipboard.writeText(fixerResult.fixed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  // ── Email Templates ──
  const renderEmail = (template, vals) => {
    let text = `Subject: ${template.subject}\n\n${template.body}`;
    Object.keys(vals).forEach((k) => {
      text = text.split(`{${k}}`).join(vals[k] || `[${k}]`);
    });
    return text;
  };

  const extractPlaceholders = (template) => {
    const allText = template.subject + ' ' + template.body;
    const matches = [...allText.matchAll(/\{([^}]+)\}/g)];
    return [...new Set(matches.map((m) => m[1]))];
  };

  const handleSelectTemplate = (t) => {
    setSelectedTemplate(t);
    const placeholders = extractPlaceholders(t);
    const defaultFields = {};
    placeholders.forEach((p) => { defaultFields[p] = ''; });
    setFields(defaultFields);
    setEmailCopied(false);
    addXp(5);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(renderEmail(selectedTemplate, fields));
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
    addXp(10);
  };

  // ── Paragraph Builder ──
  const handleSelectTopic = (t) => {
    setSelectedTopic(t);
    setParaCopied(false);
    addXp(10);
  };

  const getFullParagraph = (topic) => {
    const s = paragraphScaffolds[topic.label];
    if (!s) return '';
    return `${s.introduction} ${s.point1} ${s.point2} ${s.conclusion} ${s.cta}`;
  };

  const handleCopyParagraph = (topic) => {
    navigator.clipboard.writeText(getFullParagraph(topic));
    setParaCopied(true);
    setTimeout(() => setParaCopied(false), 2000);
  };

  const tabs = [
    { id: 'fixer', label: '🔍 Sentence Fixer', icon: AlertTriangle },
    { id: 'email', label: '📧 Email Templates', icon: Mail },
    { id: 'paragraph', label: '📝 Paragraph Builder', icon: BookOpen },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>✍️ Writing Lab</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Fix grammar errors, craft professional emails, and build structured paragraphs.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: 'var(--surface-color)', padding: '6px', borderRadius: '12px', width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '9px 18px', borderRadius: '8px', border: 'none',
              background: activeTab === t.id ? 'var(--primary-color)' : 'transparent',
              color: activeTab === t.id ? 'white' : 'var(--text-muted)',
              fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SENTENCE FIXER ── */}
      {activeTab === 'fixer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#f59e0b" /> Sentence Grammar Fixer
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '16px' }}>
              Type or paste your English sentence below. We'll detect common errors and show you how to fix them — with Tamil explanations!
            </p>
            <textarea
              value={inputSentence}
              onChange={(e) => { setInputSentence(e.target.value); setFixerResult(null); }}
              placeholder="e.g. He don't likes to go to a office since 5 years..."
              style={{
                width: '100%', minHeight: '100px', padding: '14px', borderRadius: '10px',
                border: '1.5px solid var(--border-color)', background: 'var(--bg-color)',
                color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.7',
                resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={handleAnalyze} disabled={!inputSentence.trim()}>
                🔍 Analyze & Fix
              </button>
              <button className="btn-secondary" onClick={() => { setInputSentence(''); setFixerResult(null); }}>
                <RefreshCw size={15} /> Clear
              </button>
            </div>
          </div>

          {fixerResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {fixerResult.issues.length === 0 ? (
                <div className="card" style={{ borderLeft: '4px solid #10b981', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <CheckCircle size={32} color="#10b981" />
                  <div>
                    <div style={{ fontWeight: '700', color: '#10b981', fontSize: '16px' }}>No Errors Found! ✅</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Your sentence looks grammatically correct. Great work! +10 XP</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <h4 style={{ color: '#ef4444', marginBottom: '14px' }}>⚠️ {fixerResult.issues.length} Issue{fixerResult.issues.length > 1 ? 's' : ''} Found</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {fixerResult.issues.map((issue) => (
                        <div key={issue.id} style={{ padding: '12px 16px', borderRadius: '8px', background: `${issue.color}10`, border: `1px solid ${issue.color}40` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ background: issue.color, color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>{issue.label}</span>
                          </div>
                          <div style={{ fontSize: '13.5px', color: 'var(--text-main)', marginBottom: '4px' }}>💡 {issue.tip}</div>
                          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>🇮🇳 {issue.tamil}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <h4 style={{ margin: 0, color: '#10b981' }}>✅ Auto-Fixed Sentence</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => speak(fixerResult.fixed)}>
                          <Volume2 size={14} /> Listen
                        </button>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleCopyFixed}>
                          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div style={{ padding: '14px', background: 'rgba(16,185,129,0.06)', borderRadius: '8px', fontSize: '16px', lineHeight: '1.7', fontStyle: 'italic', color: 'var(--text-main)' }}>
                      "{fixerResult.fixed}"
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Common Error Tips */}
          <div className="card">
            <h4 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={18} color="#f59e0b" /> Quick Reference — Common Grammar Mistakes
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {errorRules.map((r) => (
                <div key={r.id} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                  <span style={{ background: r.color, color: 'white', padding: '1px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', display: 'inline-block', marginBottom: '6px' }}>{r.label}</span>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{r.tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── EMAIL TEMPLATES ── */}
      {activeTab === 'email' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedTemplate ? '260px 1fr' : '1fr', gap: '20px', alignItems: 'start' }}>
          {/* Template List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ marginBottom: '8px' }}>Choose a Template</h3>
            {emailTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                style={{
                  padding: '14px 16px', borderRadius: '10px', border: '1.5px solid',
                  borderColor: selectedTemplate?.id === t.id ? 'var(--primary-color)' : 'var(--border-color)',
                  background: selectedTemplate?.id === t.id ? 'rgba(0,150,136,0.1)' : 'rgba(255,255,255,0.02)',
                  color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left', fontSize: '14px',
                  fontWeight: selectedTemplate?.id === t.id ? '700' : '400', transition: 'all 0.2s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Template Editor */}
          {selectedTemplate && (
            <div className="card" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0 }}>{selectedTemplate.emoji} {selectedTemplate.label.replace(/^.\s/, '')}</h3>
                <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={handleCopyEmail}>
                  {emailCopied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Email</>}
                </button>
              </div>

              {/* Fill-in Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {extractPlaceholders(selectedTemplate).map((placeholder) => (
                  <div key={placeholder}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: '600', textTransform: 'capitalize' }}>
                      {placeholder.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="text"
                      value={fields[placeholder] || ''}
                      onChange={(e) => setFields((prev) => ({ ...prev, [placeholder]: e.target.value }))}
                      placeholder={`Enter ${placeholder.replace(/_/g, ' ')}...`}
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
                        background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '13px', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Email Preview */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Preview</div>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '13.5px', lineHeight: '1.9', color: 'var(--text-main)', margin: 0 }}>
                  {renderEmail(selectedTemplate, fields)}
                </pre>
              </div>
            </div>
          )}

          {!selectedTemplate && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Mail size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>Select an email template from the left to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* ── PARAGRAPH BUILDER ── */}
      {activeTab === 'paragraph' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '6px' }}>📝 Paragraph Builder</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
              Select a topic to get a fully structured 5-sentence paragraph scaffold. Study the structure, customize it, and make it your own!
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {paragraphTopics.map((t) => (
                <button
                  key={t.label}
                  onClick={() => handleSelectTopic(t)}
                  style={{
                    padding: '16px', borderRadius: '12px', border: '1.5px solid',
                    borderColor: selectedTopic?.label === t.label ? 'var(--primary-color)' : 'var(--border-color)',
                    background: selectedTopic?.label === t.label ? 'rgba(0,150,136,0.12)' : 'rgba(255,255,255,0.02)',
                    color: 'var(--text-main)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{t.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedTopic && paragraphScaffolds[selectedTopic.label] && (
            <div className="card" style={{ borderTop: '3px solid var(--primary-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0 }}>{selectedTopic.icon} {selectedTopic.label}</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '13px' }} onClick={() => speak(getFullParagraph(selectedTopic))}>
                    <Volume2 size={14} /> Listen
                  </button>
                  <button className="btn-primary" style={{ padding: '7px 14px', fontSize: '13px' }} onClick={() => handleCopyParagraph(selectedTopic)}>
                    {paraCopied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy All</>}
                  </button>
                </div>
              </div>

              {(() => {
                const s = paragraphScaffolds[selectedTopic.label];
                const parts = [
                  { label: '1️⃣ Introduction', color: '#6366f1', text: s.introduction },
                  { label: '2️⃣ Main Point 1', color: '#009688', text: s.point1 },
                  { label: '3️⃣ Main Point 2', color: '#009688', text: s.point2 },
                  { label: '4️⃣ Conclusion', color: '#f59e0b', text: s.conclusion },
                  { label: '5️⃣ Call to Action', color: '#10b981', text: s.cta },
                ];
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {parts.map((p) => (
                      <div key={p.label} style={{ padding: '14px 18px', borderRadius: '10px', background: `${p.color}0d`, border: `1px solid ${p.color}30`, borderLeft: `4px solid ${p.color}` }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: p.color, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.label}</div>
                        <div style={{ fontSize: '14.5px', lineHeight: '1.8', color: 'var(--text-main)' }}>{p.text}</div>
                        <button
                          onClick={() => speak(p.text)}
                          style={{ marginTop: '8px', background: 'none', border: 'none', color: p.color, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                        >
                          <Volume2 size={12} /> Listen to this sentence
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WritingLab;
