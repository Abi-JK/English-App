import React, { useState } from 'react';
import { Mail, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Send, AlertCircle, HelpCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const emailScenarios = [
  {
    id: 'sick_leave',
    title: 'Sick Leave Request',
    description: 'Inform your Manager about taking an unexpected sick day and mention backup coverage.',
    subject: 'Sick Leave Request - [Your Name]',
    to: 'manager@company.com',
    helpfulHints: "Include: A clear subject line, a professional greeting, an explanation of absence without over-sharing personal medical details, mention of backup/coverage, and a polite sign-off."
  },
  {
    id: 'bug_delay',
    title: 'Bug Resolution Delay Notification',
    description: 'Notify the Tech Lead that a critical server bug resolution is delayed and will miss the sprint release.',
    subject: 'Bug Resolution Delay: Ticket #1049 - [Your Name]',
    to: 'techlead@company.com',
    helpfulHints: "Include: Explicit delay explanation, root cause (briefly), revised ETA, mitigation plan, and professional tone."
  },
  {
    id: 'client_update',
    title: 'Client Project Update',
    description: 'Draft an email to a client informing them of a feature launch delay due to validation checks.',
    subject: 'Project Update: Milestone Phase 2 - [Your Name]',
    to: 'client.contact@external.com',
    helpfulHints: "Include: Polite opening, status update, logical justification (focusing on quality/security), and reassurance of next steps."
  },
  {
    id: 'appraisal_request',
    title: 'Appraisal Review Request',
    description: 'Ask your Project Manager for a meeting to discuss your annual appraisal and career progression.',
    subject: 'Appraisal & Progression Sync Request - [Your Name]',
    to: 'manager@company.com',
    helpfulHints: "Include: Polite request for time, key achievements summary (briefly), scheduling options, and a positive closing."
  }
];

const InterviewPrep = () => {
    const { addXp } = useAppContext();
    
    const [activeView, setActiveView] = useState('landing');
    const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
    
    // Email Simulator State
    const [emailDraft, setEmailDraft] = useState('');
    const [emailScore, setEmailScore] = useState(null);
    const [emailFeedback, setEmailFeedback] = useState([]);
    
    // STAR Method State
    const [starData, setStarData] = useState({ situation: '', task: '', action: '', result: '' });
    const [savedStars, setSavedStars] = useState([]);
    const [toastMsg, setToastMsg] = useState(null);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleScenarioChange = (idx) => {
        setSelectedScenarioIdx(idx);
        setEmailDraft('');
        setEmailScore(null);
        setEmailFeedback([]);
    };

    const handleAnalyzeEmail = () => {
        if (emailDraft.trim().length < 40) {
            showToast("Please write a longer email (at least 40 characters) to analyze tone.");
            return;
        }

        let score = 100;
        const feedback = [];
        const text = emailDraft.toLowerCase();

        // 1. Greeting Check
        if (!text.includes('dear') && !text.includes('hi') && !text.includes('hello') && !text.includes('good morning')) {
            score -= 15;
            feedback.push("Missing a professional greeting (e.g., 'Dear [Name]', 'Hi Team').");
        }

        // 2. Sign-off Check
        if (!text.includes('regards') && !text.includes('sincerely') && !text.includes('thanks') && !text.includes('respectfully') && !text.includes('best')) {
            score -= 15;
            feedback.push("Missing a professional sign-off (e.g., 'Best regards', 'Thanks & regards').");
        }

        // 3. Apologetic vs Professional Alignment Check
        if (text.includes('sorry') || text.includes('my bad') || text.includes('i made a mistake')) {
            score -= 10;
            feedback.push("Avoid over-apologizing (e.g., 'sorry', 'my bad'). Use positive phrasing instead: 'Apologies for the delay' or 'Thank you for your patience'.");
        }

        // 4. Action/Actionable verbs (Corporate Tone Check)
        const corporateVerbs = ['ensure', 'update', 'status', 'milestone', 'mitigate', 'schedule', 'assist', 'resolution', 'coverage'];
        const foundCorpVerbs = corporateVerbs.filter(v => text.includes(v));
        if (foundCorpVerbs.length < 2) {
            score -= 15;
            feedback.push("Add more professional/corporate vocabulary words (e.g., 'ensure', 'mitigate', 'coverage', 'resolution').");
        }

        // 5. Shortness check
        if (text.trim().split(/\s+/).length < 20) {
            score -= 15;
            feedback.push("The email content is very brief. Make sure to provide adequate context and next steps.");
        }

        if (feedback.length === 0) {
            feedback.push("Excellent corporate communication tone! Clear, polite, and professional.");
        }

        setEmailScore(Math.max(10, score));
        setEmailFeedback(feedback);
        addXp(45);
        showToast("+45 XP! Email analyzed.");
    };

    const handleSaveStar = () => {
        if (!starData.situation.trim() || !starData.task.trim() || !starData.action.trim() || !starData.result.trim()) {
            showToast("Please fill in all STAR sections before saving.");
            return;
        }

        const newStar = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            ...starData
        };

        setSavedStars([newStar, ...savedStars]);
        setStarData({ situation: '', task: '', action: '', result: '' });
        addXp(50);
        showToast("+50 XP! Behavioral story saved to worksheets.");
    };

    const activeScenario = emailScenarios[selectedScenarioIdx];

    const renderLanding = () => (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', margin: 0 }}>MNC Interview & Communication Prep</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Master corporate communication, formal email writing, and behavioral interview methods.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setActiveView('email')}>
                    <div style={{ color: '#8b5cf6', marginBottom: '16px' }}>
                        <Mail size={32} />
                    </div>
                    <h3>Corporate Email Simulator</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Practice drafting formal emails for leave requests, bug delays, and client management. Get instant tone critiques.</p>
                </div>

                <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setActiveView('star')}>
                    <div style={{ color: '#f59e0b', marginBottom: '16px' }}>
                        <CheckCircle2 size={32} />
                    </div>
                    <h3>STAR Method Builder</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Structure your behavioral interview answers (Situation, Task, Action, Result) to ace corporate HR rounds.</p>
                </div>
            </div>
        </div>
    );

    const renderEmailSimulator = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', margin: 0 }}>Corporate Email Simulator</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Select a scenario and practice drafting a clear, professional email.</p>
                </div>
                <button className="btn-secondary" onClick={() => setActiveView('landing')}>
                    <ArrowLeft size={18} style={{ marginRight: '8px' }}/> Back to Prep
                </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="card" style={{ padding: '16px' }}>
                    <h4 style={{ marginBottom: '12px' }}>Choose Corporate Scenario:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {emailScenarios.map((sc, idx) => (
                        <button
                          key={sc.id}
                          onClick={() => handleScenarioChange(idx)}
                          style={{
                            textAlign: 'left',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1.5px solid',
                            borderColor: selectedScenarioIdx === idx ? 'var(--primary-color)' : 'var(--border-color)',
                            background: selectedScenarioIdx === idx ? 'rgba(0, 150, 136, 0.12)' : 'var(--surface-color)',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: selectedScenarioIdx === idx ? '600' : '400',
                            fontSize: '13.5px'
                          }}
                        >
                          {sc.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '20px', background: 'rgba(0, 150, 136, 0.04)', borderLeft: '4px solid var(--primary-color)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-color)', margin: '0 0 8px 0' }}><HelpCircle size={16} /> Helpful Hints</h4>
                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-muted)' }}>{activeScenario.helpfulHints}</p>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}><strong>To:</strong> {activeScenario.to}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}><strong>Subject:</strong> {activeScenario.subject}</div>
                    </div>
                    <textarea 
                        style={{ width: '100%', height: '240px', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', resize: 'vertical', fontSize: '14px' }}
                        placeholder={`Dear Manager,\n\nI am writing to inform you that...`}
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                    ></textarea>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn-primary" onClick={handleAnalyzeEmail}>
                            Analyze Email Tone <Send size={16} style={{ marginLeft: '8px' }}/>
                        </button>
                    </div>
                </div>

                {emailScore !== null && (
                    <div className="card" style={{ background: 'rgba(255,255,255,0.015)' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>Tone Critique Report</h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: emailScore >= 80 ? 'var(--success-color)' : 'var(--accent-color)' }}>
                                {emailScore}/100
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Corporate Professionalism Score</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {emailFeedback.map((fb, i) => (
                                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px' }}>
                                    {emailScore >= 80 && emailFeedback.length === 1 && !fb.includes('Missing') ? (
                                        <CheckCircle2 size={16} color="var(--success-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    ) : (
                                        <AlertCircle size={16} color={fb.includes('Excellent') ? 'var(--success-color)' : 'var(--accent-color)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                                    )}
                                    <span style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{fb}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderStarBuilder = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', margin: 0 }}>STAR Method Builder</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Answer behavioral prompts: Situation, Task, Action, and Result.</p>
                </div>
                <button className="btn-secondary" onClick={() => setActiveView('landing')}>
                    <ArrowLeft size={18} style={{ marginRight: '8px' }}/> Back to Prep
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Prompt Question:</h4>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: '600', fontSize: '14px' }}>
                      "Tell me about a time you faced a difficult technical challenge or milestone bottleneck. How did you handle it?"
                    </div>

                    <div>
                      <h4 style={{ color: 'var(--primary-color)', fontSize: '14px', marginBottom: '6px' }}>S - Situation (சூழ்நிலை)</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Describe the background context and when it happened.</p>
                      <textarea 
                          style={{ width: '100%', height: '70px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', fontSize: '13.5px' }}
                          value={starData.situation}
                          onChange={(e) => setStarData({ ...starData, situation: e.target.value })}
                          placeholder="e.g. During my internship at Tech Solutions, our client dashboard dashboard failed during beta testing..."
                      ></textarea>
                    </div>

                    <div>
                      <h4 style={{ color: 'var(--primary-color)', fontSize: '14px', marginBottom: '6px' }}>T - Task (கடமை)</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Explain your specific responsibility or goal.</p>
                      <textarea 
                          style={{ width: '100%', height: '70px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', fontSize: '13.5px' }}
                          value={starData.task}
                          onChange={(e) => setStarData({ ...starData, task: e.target.value })}
                          placeholder="e.g. I was tasked with identifying the API lag and resolving the loading bottlenecks..."
                      ></textarea>
                    </div>

                    <div>
                      <h4 style={{ color: 'var(--primary-color)', fontSize: '14px', marginBottom: '6px' }}>A - Action (செயல்பாடு)</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>What exact steps did you take to solve the issue?</p>
                      <textarea 
                          style={{ width: '100%', height: '70px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', fontSize: '13.5px' }}
                          value={starData.action}
                          onChange={(e) => setStarData({ ...starData, action: e.target.value })}
                          placeholder="e.g. I refactored the database query hooks, implemented caching, and streamlined payload sizes..."
                      ></textarea>
                    </div>

                    <div>
                      <h4 style={{ color: 'var(--primary-color)', fontSize: '14px', marginBottom: '6px' }}>R - Result (முடிவு)</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>What was the positive outcome? Quantify if possible.</p>
                      <textarea 
                          style={{ width: '100%', height: '70px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', fontSize: '13.5px' }}
                          value={starData.result}
                          onChange={(e) => setStarData({ ...starData, result: e.target.value })}
                          placeholder="e.g. The loading latency decreased by 40% and our customer feedback score improved by 15%..."
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button className="btn-primary" onClick={handleSaveStar}>
                            Save Worksheet
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="card">
                    <h3 style={{ marginBottom: '16px' }}>Saved STAR Outlines</h3>
                    {savedStars.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '13.5px' }}>No stories structured yet. Complete the S-T-A-R sections to save.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {savedStars.map(item => (
                          <div key={item.id} style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                              <span style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 'bold' }}>Technical Challenge</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.date}</span>
                            </div>
                            <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div><strong>S:</strong> {item.situation}</div>
                              <div><strong>T:</strong> {item.task}</div>
                              <div><strong>A:</strong> {item.action}</div>
                              <div><strong>R:</strong> {item.result}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
            </div>
        </div>
    );
 
    return (
        <div>
            {toastMsg && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'var(--success-color)', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000 }}>
                    {toastMsg}
                </div>
            )}
            {activeView === 'landing' && renderLanding()}
            {activeView === 'email' && renderEmailSimulator()}
            {activeView === 'star' && renderStarBuilder()}
        </div>
    );
};

export default InterviewPrep;
