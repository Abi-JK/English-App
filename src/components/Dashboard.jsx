import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Flame, GraduationCap, Settings, Award, CheckCircle, ArrowRight, BookOpen, MessageSquare, Briefcase, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
    const { state, updateUserProfile, claimDailyBooster } = useAppContext();
    const navigate = useNavigate();

    const [nameInput, setNameInput] = useState(state.user.name);
    const [goalSelect, setGoalSelect] = useState(state.user.targetGoal);
    const [toastMsg, setToastMsg] = useState(null);
    const [selectedRoadmapStage, setSelectedRoadmapStage] = useState(1);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    let welcomeTips = '';
    if (state.user.targetGoal === 'MNC Preparation') {
        welcomeTips = "Focus on the MNC Interview Prep module. Practice structuring your answers using the STAR worksheet to sound professional and concise.";
    } else if (state.user.targetGoal === 'Competitive Exams') {
        welcomeTips = "Visit the Exam Center. Start with high-frequency Vocabulary flashcards and Grammar quizzes daily to boost your verbal score.";
    } else {
        welcomeTips = "Try out Role-Play & Speech. Speak aloud in the Pronunciation Trainer to practice clear pronunciation and active vocabulary.";
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
            showToast("+30 XP! Correct match! Streak maintained.");
        } else {
            showToast("Incorrect choice. Try again!");
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
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '150px', justifyContent: 'flex-end', gap: '8px' }}>
                    <div style={{
                        width: '30px',
                        height: `${height}%`,
                        backgroundColor: isToday ? 'var(--primary-color)' : 'var(--border-color)',
                        borderRadius: '6px',
                        transition: 'height 0.5s'
                    }}></div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{day}</span>
                </div>
            );
        });
    };

    const roadmapStages = [
      {
        stage: 1,
        title: '🌱 Grammatical Foundations',
        desc: 'Master tenses, active/passive voice, and prepositions. Excellent for TNPSC/SSC grammar.',
        actionText: 'Study Grammar',
        link: '/learn',
        tip: 'தமிழ் குறிப்பு: இங்கிருந்து தொடங்குங்கள். தினசரி 5-10 இலக்கண விதிகளை படியுங்கள். அதுவே உங்கள் அடித்தளம்.'
      },
      {
        stage: 2,
        title: '🗣️ Spoken Fluency & Pronunciation',
        desc: 'Practice speaking aloud with cafe ordering, speech trainer, and tongue twisters.',
        actionText: 'Practice Spoken',
        link: '/conversation',
        tip: 'தமிழ் குறிப்பு: தவறாக இருந்தாலும் கவலையில்லை, சத்தமாக பேசிப் பழகுங்கள். Elsa-Grader உங்களுக்கு உதவும்.'
      },
      {
        stage: 3,
        title: '💼 Corporate Communication',
        desc: 'Draft professional emails, client updates, and appraise requests. Learn polite corporate language.',
        actionText: 'Draft Emails',
        link: '/interview',
        tip: 'தமிழ் குறிப்பு: "Sorry" என்பதற்கு பதிலாக "Apologies for the delay" போன்ற சொற்களைப் பயன்படுத்த கற்றுக்கொள்ளுங்கள்.'
      },
      {
        stage: 4,
        title: '🏆 Mock Interview Mastery',
        desc: 'Refine your resume with active verbs, analyze tone, and practice advanced behavioral questions.',
        actionText: 'Build Resume',
        link: '/resume',
        tip: 'தமிழ் குறிப்பு: உங்கள் சாதனைகளை quantified ஆக (எண்களுடன்) விளக்குங்கள். STAR Worksheet-ஐ பயன்படுத்துங்கள்.'
      }
    ];

    const activeStageInfo = roadmapStages.find(s => s.stage === selectedRoadmapStage);
    const hasClaimed = state.dailyBoosterClaimedDate === new Date().toDateString();

    return (
        <div>
            {toastMsg && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'var(--success-color)', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000 }}>
                    {toastMsg}
                </div>
            )}

            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', margin: 0 }}>Welcome back, {state.user.name}!</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Track your learning metrics, manage your settings, and inspect your badges.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Welcome Card */}
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 150, 136, 0.1), rgba(0, 0, 0, 0))' }}>
                        <h2>Your Daily Learning Path</h2>
                        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>{welcomeTips}</p>
                        <button className="btn-primary" onClick={handleStartPractice}>
                            <span>Start Practice</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Interactive Roadmap */}
                    <div className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <GraduationCap color="var(--primary-color)" size={22} /> AuraEnglish Expert Career Roadmap
                        </h3>
                        <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px' }}>
                            Follow this step-by-step career roadmap to build expert verbal skills, crack competitive exams, and clear corporate communication rounds easily.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                          {roadmapStages.map(s => (
                            <button
                              key={s.stage}
                              onClick={() => setSelectedRoadmapStage(s.stage)}
                              style={{
                                flex: 1,
                                minWidth: '100px',
                                padding: '12px 8px',
                                borderRadius: '8px',
                                border: '1.5px solid',
                                borderColor: selectedRoadmapStage === s.stage ? 'var(--primary-color)' : 'var(--border-color)',
                                background: selectedRoadmapStage === s.stage ? 'rgba(0,150,136,0.1)' : 'rgba(255,255,255,0.01)',
                                color: selectedRoadmapStage === s.stage ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '700',
                                textAlign: 'center',
                                transition: 'all 0.2s'
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
                    
                    {/* Stats Row */}
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
                                padding: '4px 12px', 
                                borderRadius: '12px', 
                                fontSize: '12px', 
                                fontWeight: 'bold',
                                background: hasClaimed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                color: hasClaimed ? '#10b981' : '#f59e0b'
                            }}>
                                {hasClaimed ? 'Booster Claimed 🎉 (+30 XP)' : '30 XP Available'}
                            </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 'bold', textTransform: 'uppercase' }}>Word of the Day</span>
                                <h4 style={{ fontSize: '20px', margin: '8px 0 4px' }}>Pragmatic <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>/præɡˈmæt.ɪk/</span></h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Practical and sensible. (Tamil: நடைமுறைக்கேற்ற / எதார்த்தமான)</p>
                                <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)' }}>"Taking a pragmatic approach is better than arguing over theories."</p>
                            </div>
                            
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 'bold', textTransform: 'uppercase' }}>Phrase of the Day</span>
                                <h4 style={{ fontSize: '20px', margin: '8px 0 4px' }}>Hit the ground running</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Start a new activity rapidly and with high energy. (Tamil: ஒரு புதிய பணியை முழு வேகத்துடன் உடனடியாக தொடங்குதல்)</p>
                                <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)' }}>"The new developer hit the ground running by coding custom scripts."</p>
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
                    
                    {/* Chart Card */}
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
                
                {/* Side Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
                            <Settings size={18} color="#8b5cf6" />
                            Learning Settings
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Your Name</label>
                                <input 
                                    type="text" 
                                    value={nameInput} 
                                    onChange={(e) => setNameInput(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Core Objective</label>
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
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{ach.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ach.desc}</div>
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
