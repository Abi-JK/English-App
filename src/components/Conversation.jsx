import React, { useState, useEffect } from 'react';
import { Mic, MessageSquare, Play, RefreshCw, Trophy, Volume2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const roleplays = [
    {
        id: 'rp1',
        title: 'Coffee Shop Order',
        difficulty: 'Beginner',
        scenario: 'You are ordering coffee at a busy cafe in London. The barista asks for your order.',
        prompts: [
            { speaker: 'Barista', text: "Hi there! What can I get for you today?" },
            { speaker: 'You', text: "I would like a medium cappuccino please." },
            { speaker: 'Barista', text: "Sure thing. Would you like any pastries with that?" },
            { speaker: 'You', text: "No thanks just the coffee. How much is that?" }
        ]
    },
    {
        id: 'rp2',
        title: 'Project Update Meeting',
        difficulty: 'Advanced',
        scenario: 'You are giving a quick update on your module to the foreign client.',
        prompts: [
            { speaker: 'Client', text: "So how is the backend migration coming along?" },
            { speaker: 'You', text: "We are currently on track. The database schema has been successfully updated." },
            { speaker: 'Client', text: "Excellent. Have you encountered any latency issues?" },
            { speaker: 'You', text: "Not so far but we will run load tests this Friday to be absolutely sure." }
        ]
    }
];

const Conversation = () => {
    const { addXp, incrementPronunciation } = useAppContext();
    const [activeView, setActiveView] = useState('landing'); // 'landing', 'roleplay'
    const [selectedRp, setSelectedRp] = useState(null);
    const [lineIdx, setLineIdx] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [speechAnalysis, setSpeechAnalysis] = useState(null); // array of { word, matched }
    const [speechScore, setSpeechScore] = useState(null);
    const [toastMsg, setToastMsg] = useState(null);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = true;
            rec.lang = 'en-US';
            
            rec.onresult = (event) => {
                let current = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        current += event.results[i][0].transcript;
                    }
                }
                if (current) {
                    setTranscript(current);
                }
            };

            rec.onend = () => setIsRecording(false);
            setRecognition(rec);
        }
    }, []);

    const startRoleplay = (rp) => {
        setSelectedRp(rp);
        setLineIdx(0);
        setTranscript('');
        setSpeechAnalysis(null);
        setSpeechScore(null);
        setActiveView('roleplay');
    };

    const playPartnerAudio = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleRecording = () => {
        if (!recognition) {
            // Fallback mock recording for browsers without SpeechRecognition
            if (isRecording) {
                setIsRecording(false);
                const nextLineText = selectedRp.prompts[lineIdx + 1].text;
                // mock 90% accuracy transcription
                const words = nextLineText.split(' ');
                const mockSpoken = words.map((w, idx) => idx === 2 ? w + 'x' : w).join(' ');
                setTranscript(mockSpoken);
            } else {
                setTranscript('');
                setSpeechAnalysis(null);
                setSpeechScore(null);
                setIsRecording(true);
                showToast("Mock recording active. Click mic again to finish.");
            }
            return;
        }

        if (isRecording) {
            recognition.stop();
        } else {
            setTranscript('');
            setSpeechAnalysis(null);
            setSpeechScore(null);
            recognition.start();
            setIsRecording(true);
        }
    };

    const checkPronunciation = () => {
        if (!transcript) {
            showToast("Please speak/record your answer first.");
            return;
        }

        const nextLineText = selectedRp.prompts[lineIdx + 1].text;
        
        // Clean texts for matching
        const clean = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
        const expectedWords = clean(nextLineText);
        const spokenWords = clean(transcript);

        // Build word-by-word comparison highlight
        let matchCount = 0;
        const analysis = nextLineText.split(/\s+/).map(word => {
            const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
            const matched = spokenWords.includes(cleanWord);
            if (matched) matchCount++;
            return { word, matched };
        });

        const score = Math.round((matchCount / expectedWords.length) * 100);
        setSpeechAnalysis(analysis);
        setSpeechScore(score);

        if (score >= 70) {
            showToast(`🎉 Great! Pronunciation Score: ${score}%`);
            addXp(30);
            incrementPronunciation();
        } else {
            showToast(`Score: ${score}%. Try reading the red words again.`);
        }
    };

    const handleNextLine = () => {
        setTranscript('');
        setSpeechAnalysis(null);
        setSpeechScore(null);
        
        if (lineIdx < selectedRp.prompts.length - 2) {
            setLineIdx(lineIdx + 2);
        } else {
            showToast("Congratulations! Role-play completed.");
            setActiveView('landing');
        }
    };

    const renderLanding = () => (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', margin: 0 }}>Conversation & Pronunciation Coach</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Practice speaking with AI (Elsa/Stimuler style) to improve your accent, vocabulary, and confidence.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {roleplays.map(rp => (
                    <div key={rp.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
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
        </div>
    );

    const renderRoleplay = () => {
        const currentLine = selectedRp.prompts[lineIdx];
        const nextLine = selectedRp.prompts[lineIdx + 1];

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', margin: 0 }}>{selectedRp.title}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{selectedRp.scenario}</p>
                    </div>
                    <button className="btn-secondary" onClick={() => setActiveView('landing')}>Exit Scenario</button>
                </div>

                <div className="card" style={{ background: 'rgba(255,255,255,0.015)', padding: '28px' }}>
                    
                    {/* Partner text box */}
                    <div style={{ padding: '16px 20px', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                        <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>{currentLine.speaker} says:</div>
                        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '500' }}>
                            {currentLine.text}
                            <button className="btn-secondary" style={{ padding: '8px', borderRadius: '50%' }} onClick={() => playPartnerAudio(currentLine.text)} title="Listen to partner">
                                <Volume2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* User turn text box */}
                    {nextLine && (
                        <div style={{ padding: '20px', background: 'rgba(0, 150, 136, 0.08)', borderRadius: '10px', border: '1.5px solid var(--primary-color)' }}>
                            <div style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Your turn to read aloud:</div>
                            
                            <div style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '20px', lineHeight: '1.5' }}>
                                "{nextLine.text}"
                            </div>
                            
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={toggleRecording} 
                                    style={{ 
                                        width: '56px', height: '56px', borderRadius: '50%', border: 'none', 
                                        background: isRecording ? '#ef4444' : 'var(--primary-color)', 
                                        color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        boxShadow: isRecording ? '0 0 15px rgba(239, 68, 68, 0.6)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    title={isRecording ? "Stop Recording" : "Start Recording"}
                                >
                                    <Mic size={24} />
                                </button>
                                <div style={{ flex: 1, padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', minHeight: '52px', color: transcript ? 'white' : 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
                                    {transcript || (isRecording ? 'Listening... speak clearly.' : 'Tap mic and read the quote above aloud...')}
                                </div>
                            </div>

                            {/* Speech feedback highlights */}
                            {speechAnalysis && (
                                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Elsa-style Pronunciation analysis:</div>
                                    <div style={{ fontSize: '18px', display: 'flex', gap: '6px', flexWrap: 'wrap', fontWeight: '800', marginBottom: '8px' }}>
                                        {speechAnalysis.map((item, i) => (
                                            <span key={i} style={{ color: item.matched ? '#10b981' : '#ef4444' }}>
                                                {item.word}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>Green = Correct</span> | <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Red = Needs Practice</span> (மறுபடியும் முயற்சிக்கவும்)
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '12px' }}>
                                {!speechAnalysis ? (
                                    <button className="btn-primary" onClick={checkPronunciation} disabled={!transcript}>
                                        Verify Pronunciation
                                    </button>
                                ) : (
                                    <button className="btn-primary" onClick={handleNextLine} disabled={speechScore < 70}>
                                        {lineIdx >= selectedRp.prompts.length - 2 ? 'Finish Session' : 'Next Line'} <Play size={14} style={{ marginLeft: '6px' }} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            {toastMsg && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'var(--success-color)', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000 }}>
                    {toastMsg}
                </div>
            )}
            {activeView === 'landing' && renderLanding()}
            {activeView === 'roleplay' && renderRoleplay()}
        </div>
    );
};

export default Conversation;
