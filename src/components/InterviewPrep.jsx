import React, { useState } from 'react';
import { Mail, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Send, AlertCircle, HelpCircle, Award, BookOpen } from 'lucide-react';
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

const sampleStars = [
  {
    title: "⚡ Sample 1: Production Server Crash (MNC Level)",
    situation: "During our peak holiday sales period, the payment gateway module crashed repeatedly under a 3x traffic spike.",
    task: "My objective was to debug the latency bottleneck, restore transactions, and ensure server stability immediately.",
    action: "I refactored the database connection hook, introduced Redis caching for payment metadata, and configured automated load balancing.",
    result: "Restored system uptime within 15 minutes, reduced response latency by 45%, and saved approximately $40,000 in checkout transactions.",
    tamilTip: "தமிழ் குறிப்பு: இங்குக் காட்டப்பட்டுள்ளதைப் போல, முடிவில் (Result) உங்களது வெற்றியை எண்களுடன் (e.g. 15 minutes, 45%, $40,000) விளக்குவது MNC நேர்காணலில் மிக முக்கியம்."
  },
  {
    title: "👔 Sample 2: Resolving Team Conflicts & Deliveries",
    situation: "Our team was divided on implementing client database architecture, which delayed the sprint kickoff by 4 days.",
    task: "I needed to align team perspectives, select the optimal database schema, and recover lost development time.",
    action: "I organized a structured technical debate, set clear evaluation parameters, and spearheaded a compromise schema design.",
    result: "Unified the team, launched the schema 2 days ahead of the adjusted deadline, and maintained 100% test suite accuracy.",
    tamilTip: "தமிழ் குறிப்பு: 'Spearheaded' (முன்னின்று வழிநடத்தினேன்) போன்ற 'Action Verbs' உங்கள் பொறுப்புணர்வை வெளிப்படுத்தும்."
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
    const [starCritique, setStarCritique] = useState(null);
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

        if (!text.includes('dear') && !text.includes('hi') && !text.includes('hello') && !text.includes('good morning')) {
            score -= 15;
            feedback.push("Missing a professional greeting (e.g., 'Dear [Name]', 'Hi Team').");
        }

        if (!text.includes('regards') && !text.includes('sincerely') && !text.includes('thanks') && !text.includes('respectfully') && !text.includes('best')) {
            score -= 15;
            feedback.push("Missing a professional sign-off (e.g., 'Best regards', 'Thanks & regards').");
        }

        if (text.includes('sorry') || text.includes('my bad') || text.includes('i made a mistake')) {
            score -= 10;
            feedback.push("Avoid over-apologizing (e.g., 'sorry', 'my bad'). Use proactive expressions: 'Thank you for your understanding' or 'Apologies for the delay'.");
        }

        const corporateVerbs = ['ensure', 'update', 'status', 'milestone', 'mitigate', 'schedule', 'assist', 'resolution', 'coverage', 'notify', 'delay'];
        const foundCorpVerbs = corporateVerbs.filter(v => text.includes(v));
        if (foundCorpVerbs.length < 2) {
            score -= 15;
            feedback.push("Incorporate more active corporate vocabulary (e.g., 'ensure', 'mitigate', 'coverage', 'resolution', 'milestone').");
        }

        if (text.trim().split(/\s+/).length < 20) {
            score -= 15;
            feedback.push("The email content is very brief. Provide adequate details and mention concrete next steps.");
        }

        if (feedback.length === 0) {
            feedback.push("Excellent corporate tone! Your phrasing is polished, polite, and action-oriented.");
        }

        setEmailScore(Math.max(10, score));
        setEmailFeedback(feedback);
        addXp(45);
        showToast("🎉 Email analyzed! +45 XP");
    };

    const handleCritiqueStar = () => {
        const { situation, task, action, result } = starData;
        if (!situation.trim() || !task.trim() || !action.trim() || !result.trim()) {
            showToast("Please fill out all S, T, A, R sections before running the critique.");
            return;
        }

        let score = 100;
        const feedback = [];

        // 1. Length check
        const totalWords = (situation + ' ' + task + ' ' + action + ' ' + result).trim().split(/\s+/).length;
        if (totalWords < 50) {
            score -= 20;
            feedback.push("The outline is too short. Describe each section with 2-3 detailed sentences to convey full depth.");
        }

        // 2. Action Verbs Check
        const actionVerbs = ['resolved', 'implemented', 'designed', 'refactored', 'optimized', 'built', 'led', 'developed', 'managed', 'collaborated', 'spearheaded', 'created', 'debugged', 'analyzed'];
        const actionText = action.toLowerCase();
        const foundVerbs = actionVerbs.filter(v => actionText.includes(v));
        if (foundVerbs.length < 2) {
            score -= 20;
            feedback.push("Add more strong action verbs (e.g. 'spearheaded', 'refactored', 'optimized') to show your active role.");
        }

        // 3. Result Quantification Check (Crucial for MNCs)
        const resultText = result.toLowerCase();
        const hasMetrics = /[\d%]|percent|hours|days|dollars|users|revenue/.test(resultText);
        if (!hasMetrics) {
            score -= 25;
            feedback.push("No numbers or percentages found in the Result section! Recruiters look for measurable outcomes (e.g. 'reduced latency by 45%', 'restored operations in 15 minutes').");
        }

        if (feedback.length === 0) {
            feedback.push("Perfect structure! Your behavioral story is highly detailed, active, and clearly quantified.");
        }

        setStarCritique({
            score: Math.max(20, score),
            feedback,
            totalWords,
            verbsFound: foundVerbs
        });

        addXp(50);
        showToast("🎉 STAR Worksheet Critique generated! +50 XP");
    };

    const handleSaveStar = () => {
        const { situation, task, action, result } = starData;
        if (!situation.trim() || !task.trim() || !action.trim() || !result.trim()) {
            showToast("Please fill in all sections first.");
            return;
        }

        const newStar = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            ...starData,
            score: starCritique ? starCritique.score : 'N/A'
        };

        setSavedStars([newStar, ...savedStars]);
        setStarData({ situation: '', task: '', action: '', result: '' });
        setStarCritique(null);
        addXp(30);
        showToast("🎉 Behavioral story saved! +30 XP");
    };

    const activeScenario = emailScenarios[selectedScenarioIdx];

    const renderLanding = () => (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', margin: 0 }}>💼 MNC Interview & Communication Prep</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '4px' }}>Master corporate communication standards, email simulators, and structured behavioral stories.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', gap: '12px' }} onClick={() => setActiveView('email')}>
                    <div style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>
                        <Mail size={36} />
                    </div>
                    <h3 style={{ margin: 0 }}>Corporate Email Simulator</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.5' }}>Practice drafting formal emails for leaves, server delays, and client responses. Obtain real-time critiques.</p>
                </div>

                <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', gap: '12px' }} onClick={() => setActiveView('star')}>
                    <div style={{ color: 'var(--accent-color)', marginBottom: '8px' }}>
                        <CheckCircle2 size={36} />
                    </div>
                    <h3 style={{ margin: 0 }}>STAR Method Builder & Critique</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.5' }}>Structure your career stories using Situation, Task, Action, and Result. Analyze for metric quantification and action verbs.</p>
                </div>
            </div>
        </div>
    );

    const renderEmailSimulator = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', margin: 0 }}>📧 Corporate Email Simulator</h2>
                  <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Practice communicating in polished corporate English.</p>
                </div>
                <button className="btn-secondary" onClick={() => { setActiveView('landing'); setEmailScore(null); }}>
                    <ArrowLeft size={16} style={{ marginRight: '6px' }}/> Back
                </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}><strong>To:</strong> {activeScenario.to}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}><strong>Subject:</strong> {activeScenario.subject}</div>
                        </div>
                        
                        <textarea 
                            style={{ width: '100%', height: '240px', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', resize: 'vertical', fontSize: '14.5px', lineHeight: '1.6' }}
                            placeholder={`Dear Manager,\n\nI am writing to inform you that...`}
                            value={emailDraft}
                            onChange={(e) => setEmailDraft(e.target.value)}
                        ></textarea>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn-primary" onClick={handleAnalyzeEmail}>
                                Analyze Tone <Send size={15} style={{ marginLeft: '6px' }}/>
                            </button>
                        </div>
                    </div>

                    {emailScore !== null && (
                        <div className="card" style={{ borderLeft: `4px solid ${emailScore >= 80 ? 'var(--success-color)' : 'var(--accent-color)'}` }}>
                            <h3 style={{ margin: '0 0 16px 0' }}>Tone Critique Report</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: emailScore >= 80 ? 'var(--success-color)' : 'var(--accent-color)' }}>
                                    {emailScore}/100
                                </div>
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Corporate Clarity & Grammar Score</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {emailFeedback.map((fb, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'white' }}>
                                        <AlertCircle size={16} color={emailScore >= 80 && emailFeedback.length === 1 && !fb.includes('Missing') ? 'var(--success-color)' : 'var(--accent-color)'} style={{ marginTop: '2px', flexShrink: 0 }} />
                                        <span>{fb}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card">
                        <h4 style={{ margin: '0 0 12px 0' }}>Select Scenario:</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {emailScenarios.map((sc, idx) => (
                                <button
                                    key={sc.id}
                                    onClick={() => handleScenarioChange(idx)}
                                    style={{
                                        textAlign: 'left', padding: '10px 12px', borderRadius: '6px', border: '1.5px solid',
                                        borderColor: selectedScenarioIdx === idx ? 'var(--primary-color)' : 'var(--border-color)',
                                        background: selectedScenarioIdx === idx ? 'rgba(0,150,136,0.1)' : 'transparent',
                                        color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                                    }}
                                >
                                    {sc.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ background: 'rgba(0,150,136,0.04)', borderLeft: '3.5px solid var(--primary-color)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0', color: 'var(--primary-color)' }}>
                            <HelpCircle size={16} /> Helpful Hints
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>{activeScenario.helpfulHints}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStarBuilder = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>⭐ STAR Method Builder & Critique</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Ace behavioral questions using data-driven stories.</p>
                </div>
                <button className="btn-secondary" onClick={() => { setActiveView('landing'); setStarCritique(null); }}>
                    <ArrowLeft size={16} style={{ marginRight: '6px' }}/> Back
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: '600', fontSize: '14.5px', lineHeight: '1.5' }}>
                            💬 Prompt: "Tell me about a time you faced a serious technical roadblock or bottleneck. How did you resolve it?"
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '4px' }}>S - Situation (சூழ்நிலை)</label>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Provide background details. (Tamil: என்ன சூழல், எந்த திட்டம், எப்போது நடந்தது?)</span>
                            <textarea 
                                style={{ width: '100%', height: '70px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', fontSize: '13px', resize: 'vertical' }}
                                value={starData.situation}
                                onChange={(e) => setStarData({ ...starData, situation: e.target.value })}
                                placeholder="e.g. During my final year React project, our database queries lagged when 50 simultaneous users requested dashboard analytics..."
                            ></textarea>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '4px' }}>T - Task (கடமை)</label>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>What was your explicit duty? (Tamil: அந்த சிக்கலில் உங்களுடைய கடமை அல்லது இலக்கு என்ன?)</span>
                            <textarea 
                                style={{ width: '100%', height: '70px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', fontSize: '13px', resize: 'vertical' }}
                                value={starData.task}
                                onChange={(e) => setStarData({ ...starData, task: e.target.value })}
                                placeholder="e.g. I was responsible for identifying the query lag, optimizing server endpoints, and maintaining stability..."
                            ></textarea>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '4px' }}>A - Action (செயல்பாடு)</label>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Describe the steps you took. Use active verbs. (Tamil: சிக்கலைத் தீர்க்க நீங்கள் என்னென்ன செயல்பாடுகளைச் செய்தீர்கள்?)</span>
                            <textarea 
                                style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', fontSize: '13px', resize: 'vertical' }}
                                value={starData.action}
                                onChange={(e) => setStarData({ ...starData, action: e.target.value })}
                                placeholder="e.g. I refactored the SQL query joins, configured indexing on key foreign IDs, and implemented state query caching..."
                            ></textarea>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '4px' }}>R - Result (முடிவு - Quantified)</label>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Quantify the outcome. (Tamil: உங்கள் செயலால் கிடைத்த முடிவு என்ன? எண்களுடன் விளக்குக!)</span>
                            <textarea 
                                style={{ width: '100%', height: '75px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', fontFamily: 'inherit', fontSize: '13px', resize: 'vertical' }}
                                value={starData.result}
                                onChange={(e) => setStarData({ ...starData, result: e.target.value })}
                                placeholder="e.g. The page loading latency decreased by 60%, database CPU spikes fell to 15%, and checkout drops decreased by 10%..."
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                            <button className="btn-secondary" onClick={handleCritiqueStar}>
                                Run STAR Critique
                            </button>
                            <button className="btn-primary" onClick={handleSaveStar} disabled={!starData.situation.trim() || !starData.result.trim()}>
                                Save Worksheet
                            </button>
                        </div>
                    </div>

                    {starCritique && (
                        <div className="card" style={{ borderLeft: `5px solid ${starCritique.score >= 80 ? 'var(--success-color)' : 'var(--accent-color)'}` }}>
                            <h3 style={{ margin: '0 0 16px 0' }}>Worksheet Critique Analysis</h3>
                            
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '32px', fontWeight: '800', color: starCritique.score >= 80 ? 'var(--success-color)' : 'var(--accent-color)' }}>{starCritique.score}/100</div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MNC Readiness Grade</span>
                                </div>
                                <div style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                                    <div>📝 Word Count: <strong>{starCritique.totalWords} words</strong></div>
                                    <div style={{ marginTop: '4px' }}>🔥 Action Verbs Found: <strong>{starCritique.verbsFound.join(', ') || 'None'}</strong></div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {starCritique.feedback.map((tip, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'white', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                        <AlertCircle size={16} color="var(--accent-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                        <span>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Cheat Sheets */}
                    <div className="card" style={{ background: 'rgba(255,255,255,0.015)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', margin: '0 0 16px 0' }}>
                            <BookOpen size={18} color="var(--primary-color)" /> Sample STAR Cheat Sheets
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {sampleStars.map((sample, idx) => (
                                <div key={idx} style={{ background: 'var(--surface-color)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <strong style={{ fontSize: '13px', color: 'var(--primary-color)', display: 'block', marginBottom: '8px' }}>{sample.title}</strong>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        <div><strong>S:</strong> {sample.situation}</div>
                                        <div><strong>A:</strong> {sample.action}</div>
                                        <div><strong>R:</strong> {sample.result}</div>
                                    </div>
                                    <div style={{ marginTop: '8px', padding: '6px', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '2px solid var(--accent-color)', borderRadius: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {sample.tamilTip}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Saved works */}
                    <div className="card">
                        <h3 style={{ fontSize: '16px', margin: '0 0 12px 0' }}>Saved Worksheet Outlines</h3>
                        {savedStars.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '12.5px', margin: 0 }}>No worksheets configured yet. Draft inputs above and click Save.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {savedStars.map((item, i) => (
                                    <div key={item.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px', fontSize: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', marginBottom: '6px' }}>
                                            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Story {savedStars.length - i}</span>
                                            <span style={{ color: 'var(--success-color)' }}>Grade: {item.score}/100</span>
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                            <strong>S:</strong> {item.situation.substring(0, 50)}...
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
