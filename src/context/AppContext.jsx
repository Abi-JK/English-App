import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const STATE_KEY = 'aura_english_state';

const defaultState = {
    user: {
        name: 'Learner',
        level: 1,
        targetGoal: 'MNC Preparation'
    },
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    dailyBoosterClaimedDate: null,
    achievements: [
        { id: 'first_steps', name: 'First Steps', desc: 'Initialize your learning path', unlocked: true, icon: '🚀' },
        { id: 'streak_3', name: 'Dedicated Learner', desc: 'Maintain a 3-day learning streak', unlocked: false, icon: '🔥' },
        { id: 'quiz_master', name: 'Quiz Master', desc: 'Score 100% on any practice quiz', unlocked: false, icon: '🧠' },
        { id: 'interviewer', name: 'Ready for MNC', desc: 'Complete a full mock interview session', unlocked: false, icon: '👔' },
        { id: 'orator', name: 'Fluent Orator', desc: 'Score above 80% on pronunciation practice', unlocked: false, icon: '🗣️' }
    ],
    completedQuizzes: {},
    starResponses: [],
    pronunciationAttempts: 0
};

const getInitialState = () => {
    const stateStr = localStorage.getItem(STATE_KEY);
    if (!stateStr) {
        return defaultState;
    }
    try {
        const parsed = JSON.parse(stateStr);
        const merged = { ...defaultState, ...parsed };
        merged.user = { ...defaultState.user, ...parsed.user };
        merged.achievements = defaultState.achievements.map(defaultAch => {
            const existing = parsed.achievements?.find(a => a.id === defaultAch.id);
            return existing ? { ...defaultAch, unlocked: existing.unlocked } : defaultAch;
        });
        return merged;
    } catch (e) {
        return defaultState;
    }
};

export const AppProvider = ({ children }) => {
    const [state, setState] = useState(getInitialState);

    useEffect(() => {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    }, [state]);

    const addXp = (amount) => {
        let leveledUp = false;
        setState(prevState => {
            const newXp = prevState.xp + amount;
            const newLevel = Math.floor(newXp / 500) + 1;
            if (newLevel > prevState.user.level) {
                leveledUp = true;
            }
            return {
                ...prevState,
                xp: newXp,
                user: { ...prevState.user, level: newLevel }
            };
        });
        return leveledUp;
    };

    const updateStreak = () => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        setState(prevState => {
            if (prevState.lastActiveDate === today) return prevState;
            
            let newStreak = prevState.streak;
            if (prevState.lastActiveDate === yesterday) {
                newStreak += 1;
            } else if (prevState.lastActiveDate === null || prevState.lastActiveDate !== today) {
                newStreak = 1;
            }

            const achievements = [...prevState.achievements];
            if (newStreak >= 3) {
                const ach = achievements.find(a => a.id === 'streak_3');
                if (ach) ach.unlocked = true;
            }
            
            return {
                ...prevState,
                streak: newStreak,
                lastActiveDate: today,
                achievements
            };
        });
    };

    const unlockAchievement = (id) => {
        setState(prevState => {
            const achievements = [...prevState.achievements];
            const ach = achievements.find(a => a.id === id);
            if (ach && !ach.unlocked) {
                ach.unlocked = true;
                return { ...prevState, achievements };
            }
            return prevState;
        });
    };

    const updateQuizScore = (quizId, scorePercentage) => {
        setState(prevState => {
            const completedQuizzes = { ...prevState.completedQuizzes };
            if (!completedQuizzes[quizId]) {
                completedQuizzes[quizId] = { highscore: 0, count: 0 };
            }
            
            completedQuizzes[quizId].count += 1;
            if (scorePercentage > completedQuizzes[quizId].highscore) {
                completedQuizzes[quizId].highscore = scorePercentage;
            }

            const achievements = [...prevState.achievements];
            if (scorePercentage === 100) {
                const ach = achievements.find(a => a.id === 'quiz_master');
                if (ach) ach.unlocked = true;
            }
            
            return { ...prevState, completedQuizzes, achievements };
        });
    };

    const saveStarResponse = (response) => {
        setState(prevState => {
            const starResponses = [response, ...prevState.starResponses];
            if (starResponses.length > 10) starResponses.pop();
            return { ...prevState, starResponses };
        });
    };

    const incrementPronunciation = () => {
        setState(prevState => ({
            ...prevState,
            pronunciationAttempts: (prevState.pronunciationAttempts || 0) + 1
        }));
    };

    const updateUserProfile = (name, targetGoal) => {
        setState(prevState => ({
            ...prevState,
            user: {
                ...prevState.user,
                name: name || prevState.user.name,
                targetGoal: targetGoal || prevState.user.targetGoal
            }
        }));
    };

    const claimDailyBooster = () => {
        const today = new Date().toDateString();
        setState(prevState => ({
            ...prevState,
            dailyBoosterClaimedDate: today
        }));
        addXp(30);
    };

    const value = {
        state,
        addXp,
        updateStreak,
        unlockAchievement,
        updateQuizScore,
        saveStarResponse,
        incrementPronunciation,
        updateUserProfile,
        claimDailyBooster
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
