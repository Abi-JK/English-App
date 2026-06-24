import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Flame, GraduationCap, Settings, Award, CheckCircle, ArrowRight, BookOpen, MessageSquare, Briefcase, FileText, CheckSquare, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
    const { state, updateUserProfile, claimDailyBooster } = useAppContext();
    const navigate = useNavigate();

    const [nameInput, setNameInput] = useState(state.user.name);
    const [goalSelect, setGoalSelect] = useState(state.user.targetGoal);
    const [toastMsg, setToastMsg] = useState(null);
    const [selectedRoadmapStage, setSelectedRoadmapStage] = useState(1);

    // Persisted daily checklist
    const [checklist, setChecklist] = useState(() => {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('aura_english_checklist');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.date === today) return parsed.items;
            } catch(e) {}
        }
        return {
            booster: false,
            quiz: false,
            speaking: false,
            critique: false
        };
    });

    useEffect(() => {
        const today = new Date().toDateString();
        localStorage.setItem('aura_english_checklist', JSON.stringify({ date: today, items: checklist }));
    }, [checklist]);

    const toggleChecklistItem = (itemKey) => {
        setChecklist(prev => ({
            ...prev,
            [itemKey]: !prev[itemKey]
        }));
    };

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    let welcomeTips = '';
    if (state.user.targetGoal === 'MNC Preparation') {
        welcomeTips = "Focus on corporate communication. Master email simulation and build active behavioral outlines using the STAR Method critique system.";
    } else if (state.user.targetGoal === 'Competitive Exams') {
        welcomeTips = "Visit the Exam Center. Solve grammar previous year questions (PYQs) and build high-frequency flashcards daily.";
    } else {
        welcomeTips = "Sharpen daily fluency. Read tongue twisters in the Pronunciation Coach and practice client updates in Free Speech mode.";
    }

    const getLevelName = (level) => {
        if (level === 1) return 'Novice';
        if (level === 2) return 'Intermediate';
        if (level === 3) return 'Advanced';
        return 'Professional';
    };

    const handleSaveProfile = () => {
        updateUserProfile(nameInput, goalSelect);
        showToast("Settings updated successfully!");
    };

    const handleBoosterClick = (isCorrect) => {
        if (isCorrect) {
            claimDailyBooster();
            setChecklist(prev => ({ ...prev, booster: true }));
            showToast("🎉 Correct Match! +30 XP claimed.");
        } else {
            showToast("Oops, incorrect choice. Try again!");
        }
    };

    const handleStartPractice = () => {
        if (state.user.targetGoal === 'MNC Preparation') navigate('/interview');
        else if (state.user.targetGoal === 'Competitive Exams') navigate('/exams');
        else navigate('/conversation');
    };

    const generateChartBars = () => {
        const baseValues = [40, 20, 10, 80, 50, 30, 0];
        const todayIdx = new Date().getDay();
        baseValues[todayIdx] = Math.min(100, (state.xp % 500) / 5);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return days.map((day, idx) => {
            const height = Math.max(5, baseValues[idx]);
            const isToday = idx === todayIdx;
            return (
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '140px', justifyContent: 'flex-end', gap: '8px' }}>
                    <div style={{
                        width: '24px',
                        height: `${height}%`,
                        background: isToday ? 'linear-gradient(to top, var(--primary-color), #6366f1)' : 'var(--border-color)',
                        borderRadius: '4px',
                        transition: 'height 0.5s'
                    }}></div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{day}</span>
                </div>
            );
        });
    };

    const roadmapStages = [
      {
        stage: 1,
        title: '🌱 Grammatical Foundations',
        desc: 'Master tenses, active/passive voice, and prepositions. Core requirements for TNPSC/SSC grammar.',
        actionText: 'Study Grammar',
        link: '/learn',
        tip: 'தமிழ் குறிப்பு: இலக்கண விதிகளை முதலில் படியுங்கள். அதுவே உங்களின் உரையாடல் மற்றும் எழுத்துத் திறனுக்கான அஸ்திவாரம்.'
      },
      {
        stage: 2,
        title: '🗣️ Spoken Fluency & Pronunciation',
        desc: 'Practice tongue twisters, simulated cafe ordering, and real-time pronunciation checking.',
        actionText: 'Practice Spoken',
        link: '/conversation',
        tip: 'தமிழ் குறிப்பு: தவறுகளைப் பற்றிக் கவலைப்படாமல் சத்தமாகப் பேசுங்கள். எமது Elsa-Style Grader உங்களுக்கு உதவும்.'
      },
      {
        stage: 3,
        title: '💼 Corporate Communication',
        desc: 'Draft professional emails, delays, updates, and Appraisal Review requests.',
        actionText: 'Draft Emails',
        link: '/interview',
        tip: 'தமிழ் குறிப்பு: "Sorry" என்று கூறுவதற்கு பதிலாக "Apologies for the delay" போன்ற சொற்களைப் பயன்படுத்த பழகுங்கள்.'
      },
      {
        stage: 4,
        title: '🏆 Mock Interview Mastery',
        desc: 'Structure behavioral stories with the STAR method, run resume critiques, and prepare for HR rounds.',
        actionText: 'Build Resume',
        link: '/resume',
        tip: 'தமிழ் குறிப்பு: உங்கள் சாதனைகளை எண்களுடன் (quantified) விளக்குங்கள். STAR Worksheet-ஐ பயன்படுத்துங்கள்.'
      }
    ];

    const activeStageInfo = roadmapStages.find(s => s.stage === selectedRoadmapStage);
    const hasClaimed = state.dailyBoosterClaimedDate === new Date().toDateString();

    const checklistProgress = Object.values(checklist).filter(Boolean).length;
    const isChecklistComplete = checklistProgress === Object.keys(checklist).length;

    return (
        <div>
            {toastMsg && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'var(--success-color)', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000 }}>
                    {toastMsg}
                </div>
            )}

            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', margin: 0 }}>Welcome back, {state.user.name}!</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '4px' }}>Track daily targets, measure progress, and review your global badges.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Welcome Banner */}
                    <div className="card" style={{ 
                        background: 'linear-gradient(135deg, rgba(0, 150, 136, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
                        border: '1px solid rgba(0, 150, 136, 0.25)',
                        padding: '28px'
                    }}>
                        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Your Personalized Path</h2>
                        <p style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6' }}>{welcomeTips}</p>
                        <button className="btn-primary" onClick={handleStartPractice}>
                            <span>Start Practice Session</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Daily Checklist */}
                    <div className="card" style={{ borderLeft: `4px solid ${isChecklistComplete ? 'var(--success-color)' : 'var(--primary-color)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                <CheckSquare size={20} color="var(--primary-color)" /> Daily Study Targets
                            </h3>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                {checklistProgress}/4 Targets Completed
                            </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div 
                                onClick={() => toggleChecklistItem('booster')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
                                    cursor: 'pointer', opacity: checklist.booster ? 1 : 0.65, transition: 'all 0.2s'
                                }}
                            >
                                <input type="checkbox" checked={checklist.booster} readOnly style={{ accentColor: 'var(--primary-color)' }} />
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', textDecoration: checklist.booster ? 'line-through' : 'none' }}>5-Minute Daily Booster</div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Read Word/Idiom & Answer</span>
                                </div>
                            </div>

                            <div 
                                onClick={() => toggleChecklistItem('quiz')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
                                    cursor: 'pointer', opacity: checklist.quiz ? 1 : 0.65, transition: 'all 0.2s'
                                }}
                            >
                                <input type="checkbox" checked={checklist.quiz} readOnly style={{ accentColor: 'var(--primary-color)' }} />
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', textDecoration: checklist.quiz ? 'line-through' : 'none' }}>Vocabulary Practice Quiz</div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Retain words via MCQ</span>
                                </div>
                            </div>

                            <div 
                                onClick={() => toggleChecklistItem('speaking')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
                                    cursor: 'pointer', opacity: checklist.speaking ? 1 : 0.65, transition: 'all 0.2s'
                                }}
                            >
                                <input type="checkbox" checked={checklist.speaking} readOnly style={{ accentColor: 'var(--primary-color)' }} />
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', textDecoration: checklist.speaking ? 'line-through' : 'none' }}>Oral Pronunciation Sync</div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tongue Twister / Speaking</span>
                                </div>
                            </div>

                            <div 
                                onClick={() => toggleChecklistItem('critique')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
                                    cursor: 'pointer', opacity: checklist.critique ? 1 : 0.65, transition: 'all 0.2s'
                                }}
                            >
                                <input type="checkbox" checked={checklist.critique} readOnly style={{ accentColor: 'var(--primary-color)' }} />
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', textDecoration: checklist.critique ? 'line-through' : 'none' }}>Resume / Tone Review</div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MNC criteria evaluations</span>
                                </div>
                            </div>
                        </div>

                        {isChecklistComplete && (
                            <div style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--success-color)', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}>
                                🏆 Awesome! You completed all daily checklists! Consistency builds excellence.
                            </div>
                        )}
                    </div>

                    {/* Interactive Roadmap */}
                    <div className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <GraduationCap color="var(--primary-color)" size={22} /> AuraEnglish Expert Career Roadmap
                        </h3>
                        <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px' }}>
                            Follow this step-by-step career path to unlock expert spoken and corporate writing confidence.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                          {roadmapStages.map(s => (
                            <button
                              key={s.stage}
                              onClick={() => setSelectedRoadmapStage(s.stage)}
                              style={{
                                flex: 1, minWidth: '100px', padding: '12px 8px', borderRadius: '8px', border: '1.5px solid',
                                borderColor: selectedRoadmapStage === s.stage ? 'var(--primary-color)' : 'var(--border-color)',
                                background: selectedRoadmapStage === s.stage ? 'rgba(0,150,136,0.1)' : 'rgba(255,255,255,0.01)',
                                color: selectedRoadmapStage === s.stage ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer', fontSize: '12px', fontWeight: '700', textAlign: 'center', transition: 'all 0.2s'
                              }}
                            >
                              <div>Stage {s.stage}</div>
                              <div style={{ fontSize: '10px', fontWeight: '400', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{s.title.substring(2)}</div>
                            </button>
                          ))}
                        </div>

                        {activeStageInfo && (
                          <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h4 style={{ margin: 0, fontSize: '16px' }}>{activeStageInfo.title}</h4>
                            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>{activeStageInfo.desc}</p>
                            
                            <div style={{ padding: '10px', background: 'rgba(0,150,136,0.06)', borderRadius: '6px', borderLeft: '3.5px solid var(--primary-color)', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                              {activeStageInfo.tip}
                            </div>

                            <button className="btn-primary" style={{ width: 'fit-content', padding: '8px 16px', fontSize: '13px' }} onClick={() => navigate(activeStageInfo.link)}>
                              {activeStageInfo.actionText} <ArrowRight size={14} />
                            </button>
                          </div>
                        )}
                    </div>
                    
                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0, padding: '16px' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '12px', borderRadius: '12px' }}>
                                <Zap size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{state.xp}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total XP</div>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0, padding: '16px' }}>
                            <div style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '12px', borderRadius: '12px' }}>
                                <Flame size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{state.streak} Days</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Streak</div>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0, padding: '16px' }}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '12px', borderRadius: '12px' }}>
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{state.user.level}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{getLevelName(state.user.level)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Daily Booster */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                <Zap color="#f59e0b" size={20} /> Daily 5-Minute Booster
                            </h3>
                            <span style={{ 
                                padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                                background: hasClaimed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                color: hasClaimed ? '#10b981' : '#f59e0b'
                            }}>
                                {hasClaimed ? 'Booster Claimed 🎉 (+30 XP)' : '30 XP Available'}
                            </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '11px', color: 'var(--primary-color)', fontWeight: 'bold', textTransform: 'uppercase' }}>Word of the Day</span>
                                <h4 style={{ fontSize: '20px', margin: '8px 0 4px' }}>Pragmatic <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-muted)' }}>/præɡˈmæt.ɪk/</span></h4>
                                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>Practical and sensible. (Tamil: நடைமுறைக்கேற்ற / எதார்த்தமான)</p>
                                <p style={{ fontSize: '12.5px', fontStyle: 'italic', color: 'var(--text-muted)' }}>"Taking a pragmatic approach is better than arguing over theories."</p>
                            </div>
                            
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 'bold', textTransform: 'uppercase' }}>Phrase of the Day</span>
                                <h4 style={{ fontSize: '20px', margin: '8px 0 4px' }}>Hit the ground running</h4>
                                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>Start a new activity rapidly and with high energy. (Tamil: ஒரு புதிய பணியை முழு வேகத்துடன் உடனடியாக தொடங்குதல்)</p>
                                <p style={{ fontSize: '12.5px', fontStyle: 'italic', color: 'var(--text-muted)' }}>"The new developer hit the ground running by coding custom scripts."</p>
                            </div>
                        </div>
                        
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                            {hasClaimed ? (
                                <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <CheckCircle size={22} />
                                    You have completed today's daily 5-minute booster! Come back tomorrow for new challenges.
                                </div>
                            ) : (
                                <div>
                                    <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>Quick Challenge: What is the meaning of the idiom "Spill the beans"?</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <button className="btn-secondary" onClick={() => handleBoosterClick(false)} style={{ textAlign: 'left', padding: '12px' }}>A) To drop kitchen ingredients</button>
                                        <button className="btn-secondary" onClick={() => handleBoosterClick(true)} style={{ textAlign: 'left', padding: '12px' }}>B) To reveal a secret</button>
                                        <button className="btn-secondary" onClick={() => handleBoosterClick(false)} style={{ textAlign: 'left', padding: '12px' }}>C) To complain about work</button>
                                        <button className="btn-secondary" onClick={() => handleBoosterClick(false)} style={{ textAlign: 'left', padding: '12px' }}>D) To cook a hot meal</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Weekly Index Chart */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0 }}>Weekly Activity Index</h3>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>XP per Day</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
                            {generateChartBars()}
                        </div>
                    </div>
                </div>
                
                {/* Right Side Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
                            <Settings size={18} color="#8b5cf6" />
                            Learning Settings
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>Your Name</label>
                                <input 
                                    type="text" 
                                    value={nameInput} 
                                    onChange={(e) => setNameInput(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>Core Objective</label>
                                <select 
                                    value={goalSelect} 
                                    onChange={(e) => setGoalSelect(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white' }}
                                >
                                    <option value="MNC Preparation">MNC Interview Prep</option>
                                    <option value="Competitive Exams">Competitive Exams</option>
                                    <option value="Conversational">Daily Conversation</option>
                                </select>
                            </div>
                            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={handleSaveProfile}>
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Award size={20} /> Achievements
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                            {state.achievements.map(ach => (
                                <div key={ach.id} style={{ display: 'flex', gap: '12px', opacity: ach.unlocked ? 1 : 0.5, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '24px' }}>{ach.icon}</div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '13.5px' }}>{ach.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{ach.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
