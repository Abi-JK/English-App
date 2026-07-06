export const achievementDefs = [
  { id: 'first_quiz', title: 'First Quiz', desc: 'Complete your first quiz', icon: '📝', xp: 50 },
  { id: 'vocab_master', title: 'Vocabulary Master', desc: 'Learn 50 vocabulary words', icon: '📚', xp: 100 },
  { id: 'streak_7', title: '7-Day Streak', desc: 'Study 7 days in a row', icon: '🔥', xp: 200 },
  { id: 'streak_30', title: '30-Day Streak', desc: 'Complete 30-day streak', icon: '💪', xp: 500 },
  { id: 'exam_ready', title: 'Exam Ready!', desc: 'Score 90%+ in any exam quiz', icon: '🏆', xp: 150 },
  { id: 'speaking_star', title: 'Speaking Star', desc: 'Complete 10 speaking practices', icon: '🎤', xp: 200 },
  { id: 'writing_pro', title: 'Writing Pro', desc: 'Write 5 paragraphs', icon: '✍️', xp: 100 },
  { id: 'xp_collector', title: 'XP Collector', desc: 'Earn 1000 XP total', icon: '⚡', xp: 300 },
];

export const roadmapStages = [
  {
    stage: 1,
    title: 'Foundation Builder',
    desc: 'Master basic vocabulary, common phrases, and simple sentence structures.',
    tips: ['Build a vocabulary of 500+ essential words', 'Learn 20 basic grammar rules', 'Practice simple daily conversations'],
    color: '#10b981',
    icon: '🌱'
  },
  {
    stage: 2,
    title: 'Intermediate Explorer',
    desc: 'Expand vocabulary, improve fluency, and start reading/writing paragraphs.',
    tips: ['Learn 200+ phrasal verbs', 'Practice writing emails', 'Start reading English articles daily'],
    color: '#f59e0b',
    icon: '🚀'
  },
  {
    stage: 3,
    title: 'Advanced Communicator',
    desc: 'Master complex grammar, professional writing, and formal speaking.',
    tips: ['Deliver presentations in English', 'Write professional reports', 'Handle interviews confidently'],
    color: '#6366f1',
    icon: '💼'
  },
  {
    stage: 4,
    title: 'Exam & Career Ready',
    desc: 'Ace competitive exams with PYQ mastery. Speak fluently in MNC environments.',
    tips: ['Solve previous year question papers', 'Practice group discussions', 'Achieve 140+ WPM speaking pace'],
    color: '#8b5cf6',
    icon: '🏆'
  }
];

export const boosterQuestions = [
  {
    question: 'What is the meaning of the idiom "Spill the beans"?',
    options: ['A) To drop kitchen ingredients', 'B) To reveal a secret', 'C) To complain about work', 'D) To cook a hot meal'],
    correct: 1,
    funFact: 'This idiom comes from ancient Greece where voting was done with beans!'
  },
  {
    question: 'What does "break down" mean in: "The car broke down on the highway"?',
    options: ['A) To crash', 'B) To stop functioning', 'C) To speed up', 'D) To change direction'],
    correct: 1,
    funFact: '"Break down" can also mean to analyze in detail.'
  },
  {
    question: 'Which is the correct spelling?',
    options: ['A) Accomodation', 'B) Acommodation', 'C) Accommodation', 'D) Acomodation'],
    correct: 2,
    funFact: 'Remember: double c, double m.'
  },
  {
    question: 'What is the antonym of "Benevolent"?',
    options: ['A) Generous', 'B) Malevolent', 'C) Kind', 'D) Calm'],
    correct: 1,
    funFact: '"Bene" = good, "Male" = bad.'
  },
  {
    question: 'Choose correct preposition: "She is good ______ mathematics."',
    options: ['A) in', 'B) at', 'C) on', 'D) with'],
    correct: 1,
    funFact: '"Good at" is for skills. "Good in" is incorrect.'
  },
  {
    question: 'Identify correct spelling:',
    options: ['A) Maintanance', 'B) Maintenance', 'C) Maintenence', 'D) Maintainance'],
    correct: 1,
    funFact: 'Frequently tested in SSC and Banking exams!'
  },
  {
    question: 'What does "Hit the ground running" mean?',
    options: ['A) To fall and get hurt', 'B) To start with great energy', 'C) To run a marathon', 'D) To leave quickly'],
    correct: 1,
    funFact: 'Common in MNC workplaces for new hires who adapt quickly.'
  },
  {
    question: 'Fill in: "If I ______ you, I would accept the offer."',
    options: ['A) was', 'B) were', 'C) am', 'D) be'],
    correct: 1,
    funFact: 'Subjunctive mood always uses "were".'
  },
  {
    question: 'Which word means "to continue despite difficulty"?',
    options: ['A) Abandon', 'B) Persevere', 'C) Surrender', 'D) Hesitate'],
    correct: 1,
    funFact: '"Persevere" is commonly tested in TNPSC and SSC exams.'
  },
  {
    question: 'Synonym of "Articulate"?',
    options: ['A) Confused', 'B) Eloquent', 'C) Silent', 'D) Rough'],
    correct: 1,
    funFact: '"Articulate" and "Eloquent" both mean speaking clearly.'
  },
  {
    question: '"Neither the teacher nor the students ______ present."',
    options: ['A) was', 'B) were', 'C) is', 'D) has'],
    correct: 1,
    funFact: 'Verb agrees with nearest subject (students → were).'
  },
  {
    question: 'Passive voice of "She writes a letter":',
    options: ['A) A letter is written by her', 'B) A letter was written by her', 'C) A letter is being written', 'D) A letter has been written'],
    correct: 0,
    funFact: 'Simple Present Active → is/am/are + V3 in Passive.'
  },
];

export const getTodayBooster = () => {
  const today = new Date().toDateString();
  const dayNum = today.split(' ').reduce((acc, part) => acc + part.charCodeAt(0), 0);
  return boosterQuestions[dayNum % boosterQuestions.length];
};
