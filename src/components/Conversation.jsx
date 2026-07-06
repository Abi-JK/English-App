import React, { useState, useEffect, useRef } from 'react';
import { Mic, MessageSquare, Play, Trophy, Volume2, Clock, BarChart2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { roleplays, tongueTwisters, freeSpeechPrompts } from '../data/conversationData';

const Conversation = () => {
    const { addXp, incrementPronunciation } = useAppContext();
    const [activeTab, setActiveTab] = useState('roleplay'); // 'roleplay', 'twister', 'freespeech'
    const [activeView, setActiveView] = useState('landing'); // 'landing', 'roleplay', 'twister', 'freespeech'
    
    const { speak, isRecording, transcript, setTranscript, toggleRecording, verifySpeech } = useSpeech();

    // Core states
    const [selectedRp, setSelectedRp] = useState(null);
    const [lineIdx, setLineIdx] = useState(0);
    const [selectedTwister, setSelectedTwister] = useState(null);
    const [selectedFs, setSelectedFs] = useState(null);
    
    // Speech States
    const [speechAnalysis, setSpeechAnalysis] = useState(null);
    const [speechScore, setSpeechScore] = useState(null);
    const [toastMsg, setToastMsg] = useState(null);

    // Free speech timer & analysis
    const [timer, setTimer] = useState(0);
    const timerRef = useRef(null);
    const [freeSpeechReport, setFreeSpeechReport] = useState(null);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    // Free Speech Timer Effect
    useEffect(() => {
        if (isRecording && activeView === 'freespeech') {
            setTimer(0);
            timerRef.current = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRecording, activeView]);

    const handleToggleRecording = () => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            if (isRecording) {
                if (activeView === 'roleplay' && selectedRp) {
                    const nextLineText = selectedRp.prompts[lineIdx + 1].text;
                    setTranscript(nextLineText);
                } else if (activeView === 'twister' && selectedTwister) {
                    setTranscript(selectedTwister.text);
                } else if (activeView === 'freespeech') {
                    setTranscript("I am speaking about my profile. I have experience in building responsive web applications using React and Node.js. I love coding and resolving bugs.");
                }
            } else {
                setTranscript('');
                setSpeechAnalysis(null);
                setSpeechScore(null);
                setFreeSpeechReport(null);
                showToast("Speech simulation active. Click mic again to finish.");
            }
            toggleRecording();
            return;
        }
        setTranscript('');
        setSpeechAnalysis(null);
        setSpeechScore(null);
        setFreeSpeechReport(null);
        toggleRecording();
    };

    const handleVerifySpeech = (expectedText) => {
        if (!transcript) {
            showToast("Please record your speech first.");
            return;
        }

        const result = verifySpeech(expectedText, transcript);
        setSpeechAnalysis(result.analysis);
        setSpeechScore(result.score);

        if (result.score >= 70) {
            showToast(`🎉 Great job! Pronunciation Score: ${result.score}%`);
            addXp(35);
            incrementPronunciation();
        } else {
            showToast(`Score: ${result.score}%. Try emphasizing the red words.`);
        }
    };

    const handleFreeSpeechSubmit = () => {
        if (!transcript) {
            showToast("Speak something first!");
            return;
        }

        const wordCount = transcript.trim().split(/\s+/).filter(w => w).length;
        const durationSec = Math.max(1, timer);
        const wpm = Math.round((wordCount / durationSec) * 60);

        let paceFeedback = '';
        if (wpm < 85) {
            paceFeedback = "Your pace is a bit slow (under 85 WPM). Try grouping words together and practicing smoother transitions.";
        } else if (wpm > 145) {
            paceFeedback = "Your speaking pace is quite fast (over 145 WPM). Remember to breathe and pause briefly at commas and full stops.";
        } else {
            paceFeedback = "Perfect speech pace (90 - 140 WPM)! This speed sounds highly professional and calm in corporate settings.";
        }

        setFreeSpeechReport({
            words: wordCount,
            duration: durationSec,
            wpm,
            paceFeedback
        });

        addXp(40);
        showToast("+40 XP! Speech feedback generated.");
    };

    const startRoleplay = (rp) => {
        setSelectedRp(rp);
        setLineIdx(0);
        setTranscript('');
        setSpeechAnalysis(null);
        setSpeechScore(null);
        setActiveView('roleplay');
    };

    const startTwister = (tt) => {
        setSelectedTwister(tt);
        setTranscript('');
        setSpeechAnalysis(null);
        setSpeechScore(null);
        setActiveView('twister');
    };

    const startFreeSpeech = (fs) => {
        setSelectedFs(fs);
        setTranscript('');
        setTimer(0);
        setFreeSpeechReport(null);
        setActiveView('freespeech');
    };

    // ─── RENDERS ──────────────────────────────────────────────────────────────

    const renderRoleplaysLanding = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {roleplays.map(rp => (
                <div key={rp.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0 }}>{rp.title}</h3>
                            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: rp.difficulty === 'Beginner' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: rp.difficulty === 'Beginner' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                                {rp.difficulty}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>{rp.scenario}</p>
                    </div>
                    <button className="btn-primary" onClick={() => startRoleplay(rp)}>
                        Start Conversation
                    </button>
                </div>
            ))}
        </div>
    );

    const renderTwistersLanding = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {tongueTwisters.map(tt => (
                <div key={tt.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid var(--accent-color)' }}>
                    <div>
                        <span style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{tt.focus}</span>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{tt.title}</h3>
                        <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>"{tt.text}"</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px' }}>{tt.tamil}</p>
                    </div>
                    <button className="btn-primary" style={{ background: 'var(--accent-color)', color: 'white', marginTop: '16px' }} onClick={() => startTwister(tt)}>
                        Practice Pronunciation
                    </button>
                </div>
            ))}
        </div>
    );

    const renderFreeSpeechLanding = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {freeSpeechPrompts.map(fs => (
                <div key={fs.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid var(--primary-color)' }}>
                    <div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{fs.topic}</h3>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>{fs.hint}</p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {fs.suggestedPoints.slice(0, 3).map((pt, i) => (
                                <span key={i} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: '4px' }}>
                                    {pt}
                                </span>
                            ))}
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => startFreeSpeech(fs)}>
                        Start Speaking Sync
                    </button>
                </div>
            ))}
        </div>
    );

    const renderRoleplayActive = () => {
        const currentLine = selectedRp.prompts[lineIdx];
        const nextLine = selectedRp.prompts[lineIdx + 1];

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', margin: 0 }}>{selectedRp.title}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{selectedRp.scenario}</p>
                    </div>
                    <button className="btn-secondary" onClick={() => setActiveView('landing')}>Exit Scenario</button>
                </div>

                <div className="card" style={{ background: 'rgba(255,255,255,0.01)', padding: '24px' }}>
                    <div style={{ padding: '16px', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                        <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>{currentLine.speaker} says:</div>
                        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '500' }}>
                            {currentLine.text}
                            <button className="btn-secondary" style={{ padding: '8px', borderRadius: '50%' }} onClick={() => speak(currentLine.text)} title="Listen to partner">
                                <Volume2 size={18} />
                            </button>
                        </div>
                    </div>

                    {nextLine && (
                        <div style={{ padding: '20px', background: 'rgba(0, 150, 136, 0.06)', borderRadius: '10px', border: '1.5px solid var(--primary-color)' }}>
                            <div style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Your turn to read aloud:</div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '20px', lineHeight: '1.5' }}>
                                "{nextLine.text}"
                            </div>
                            
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={handleToggleRecording} 
                                    style={{ 
                                        width: '56px', height: '56px', borderRadius: '50%', border: 'none', 
                                        background: isRecording ? '#ef4444' : 'var(--primary-color)', 
                                        color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        boxShadow: isRecording ? '0 0 15px rgba(239, 68, 68, 0.6)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Mic size={24} />
                                </button>
                                <div style={{ flex: 1, padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', minHeight: '52px', color: transcript ? 'white' : 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
                                    {transcript || (isRecording ? 'Listening... Speak now.' : 'Tap mic and read the dialog above...')}
                                </div>
                            </div>

                            {speechAnalysis && (
                                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Elsa-style Pronunciation Feedback:</div>
                                    <div style={{ fontSize: '18px', display: 'flex', gap: '6px', flexWrap: 'wrap', fontWeight: '800', marginBottom: '8px' }}>
                                        {speechAnalysis.map((item, i) => (
                                            <span key={i} style={{ color: item.matched ? '#10b981' : '#ef4444' }}>
                                                {item.word}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>Green = Perfect</span> | <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Red = Work on pronunciation</span>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '12px' }}>
                                {!speechAnalysis ? (
                                    <button className="btn-primary" onClick={() => handleVerifySpeech(nextLine.text)} disabled={!transcript}>
                                        Verify Pronunciation
                                    </button>
                                ) : (
                                    <button className="btn-primary" onClick={() => {
                                        setTranscript('');
                                        setSpeechAnalysis(null);
                                        setSpeechScore(null);
                                        if (lineIdx < selectedRp.prompts.length - 2) {
                                            setLineIdx(lineIdx + 2);
                                        } else {
                                            showToast("🎉 Dialog Completed! +35 XP");
                                            setActiveView('landing');
                                        }
                                    }} disabled={speechScore < 70}>
                                        {lineIdx >= selectedRp.prompts.length - 2 ? 'Finish Scenario' : 'Next Line'} <Play size={14} style={{ marginLeft: '6px' }} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderTwisterActive = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Tongue Twister: {selectedTwister.title}</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Focus: {selectedTwister.focus}</p>
                </div>
                <button className="btn-secondary" onClick={() => setActiveView('landing')}>Exit Twister</button>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--accent-color)', fontWeight: 'bold' }}>READ THIS LOUDLY:</div>
                    <button className="btn-secondary" style={{ padding: '8px', borderRadius: '50%' }} onClick={() => speak(selectedTwister.text)}>
                        <Volume2 size={18} />
                    </button>
                </div>

                <div style={{ fontSize: '22px', fontWeight: '800', fontStyle: 'italic', letterSpacing: '0.5px', color: 'white', marginBottom: '24px', textAlign: 'center', lineHeight: '1.6' }}>
                    "{selectedTwister.text}"
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                    <button 
                        onClick={handleToggleRecording} 
                        style={{ 
                            width: '56px', height: '56px', borderRadius: '50%', border: 'none', 
                            background: isRecording ? '#ef4444' : 'var(--accent-color)', 
                            color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                            boxShadow: isRecording ? '0 0 15px rgba(239, 68, 68, 0.6)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Mic size={24} />
                    </button>
                    <div style={{ flex: 1, padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', minHeight: '52px', color: transcript ? 'white' : 'var(--text-muted)', fontSize: '14px' }}>
                        {transcript || (isRecording ? 'Listening... Speak twister fast!' : 'Tap mic and speak now...')}
                    </div>
                </div>

                {speechAnalysis && (
                    <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Diction Accuracy Highlights:</div>
                        <div style={{ fontSize: '18px', display: 'flex', gap: '6px', flexWrap: 'wrap', fontWeight: '800', marginBottom: '8px' }}>
                            {speechAnalysis.map((item, i) => (
                                <span key={i} style={{ color: item.matched ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                    {item.word}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    {!speechAnalysis ? (
                        <button className="btn-primary" style={{ background: 'var(--accent-color)' }} onClick={() => handleVerifySpeech(selectedTwister.text)} disabled={!transcript}>
                            Check Accuracy
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={() => {
                            setTranscript('');
                            setSpeechAnalysis(null);
                            setSpeechScore(null);
                            setActiveView('landing');
                        }} disabled={speechScore < 70}>
                            Finish Practice
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const renderFreeSpeechActive = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Free Speech Coach</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Topic: {selectedFs.topic}</p>
                </div>
                <button className="btn-secondary" onClick={() => setActiveView('landing')}>Exit Practice</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(0,150,136,0.05)', padding: '14px', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '4px' }}>TALKING SUGGESTIONS:</div>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>{selectedFs.hint}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'white' }}>
                            {selectedFs.suggestedPoints.map((pt, i) => (
                                <div key={i}>📌 {pt}</div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button 
                            onClick={handleToggleRecording} 
                            style={{ 
                                width: '56px', height: '56px', borderRadius: '50%', border: 'none', 
                                background: isRecording ? '#ef4444' : 'var(--primary-color)', 
                                color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                boxShadow: isRecording ? '0 0 15px rgba(239, 68, 68, 0.6)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Mic size={24} />
                        </button>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'monospace' }}>
                                <Clock size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--primary-color)' }} />
                                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Continuous speech is tracked</span>
                        </div>
                    </div>

                    <div style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', minHeight: '80px', fontSize: '14.5px', lineHeight: '1.6' }}>
                        {transcript || (isRecording ? 'Listening... Share your thoughts.' : 'Click the mic button to start recording your speech.')}
                    </div>

                    {!isRecording && transcript && !freeSpeechReport && (
                        <button className="btn-primary" onClick={handleFreeSpeechSubmit}>
                            Analyze Speaking Metrics
                        </button>
                    )}
                </div>

                {freeSpeechReport && (
                    <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--primary-color)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
                            <BarChart2 size={20} color="var(--primary-color)" /> Speaking Performance Report
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>{freeSpeechReport.words}</div>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Words Spoken</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>{freeSpeechReport.wpm}</div>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pace (WPM)</span>
                            </div>
                        </div>

                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '20px' }}>
                            <strong>Analysis:</strong> {freeSpeechReport.paceFeedback}
                        </div>

                        <button className="btn-primary" onClick={() => {
                            setTranscript('');
                            setFreeSpeechReport(null);
                            setTimer(0);
                            setActiveView('landing');
                        }}>
                            Done Practice
                        </button>
                    </div>
                )}
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
            
            {activeView === 'landing' && (
                <div>
                    <div style={{ marginBottom: '28px' }}>
                        <h1 style={{ fontSize: '28px', margin: 0 }}>🗣️ Spoken Fluency & Pronunciation Coach</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '4px' }}>Practice speaking English dynamically using roleplay scenarios, tongue twisters, and prompts.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: 'var(--surface-color)', padding: '6px', borderRadius: '12px', width: 'fit-content' }}>
                        <button 
                            onClick={() => setActiveTab('roleplay')}
                            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'roleplay' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'roleplay' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
                        >
                            🎭 AI Roleplays
                        </button>
                        <button 
                            onClick={() => setActiveTab('twister')}
                            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'twister' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'twister' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
                        >
                            👅 Tongue Twisters
                        </button>
                        <button 
                            onClick={() => setActiveTab('freespeech')}
                            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'freespeech' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'freespeech' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
                        >
                            🎤 Free Speech Coach
                        </button>
                    </div>

                    {activeTab === 'roleplay' && renderRoleplaysLanding()}
                    {activeTab === 'twister' && renderTwistersLanding()}
                    {activeTab === 'freespeech' && renderFreeSpeechLanding()}
                </div>
            )}

            {activeView === 'roleplay' && renderRoleplayActive()}
            {activeView === 'twister' && renderTwisterActive()}
            {activeView === 'freespeech' && renderFreeSpeechActive()}
        </div>
    );
};

export default Conversation;
