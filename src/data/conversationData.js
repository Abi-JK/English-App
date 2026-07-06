export const roleplays = [
  {
    id: 'rp1',
    title: 'Coffee Shop Order',
    difficulty: 'Beginner',
    scenario: 'You are ordering coffee at a busy cafe in London.',
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
    scenario: 'You are giving a quick update to the foreign client.',
    prompts: [
      { speaker: 'Client', text: "So how is the backend migration coming along?" },
      { speaker: 'You', text: "We are currently on track. The database schema has been successfully updated." },
      { speaker: 'Client', text: "Excellent. Have you encountered any latency issues?" },
      { speaker: 'You', text: "Not so far but we will run load tests this Friday to be absolutely sure." }
    ]
  },
  {
    id: 'rp3',
    title: 'Job Interview Self-Introduction',
    difficulty: 'Intermediate',
    scenario: 'You are in a job interview and the HR asks you to introduce yourself.',
    prompts: [
      { speaker: 'HR', text: "Good morning! Please tell us a bit about yourself and your background." },
      { speaker: 'You', text: "Good morning! I have a Bachelor\'s degree in Computer Science and three years of experience in full-stack development." },
      { speaker: 'HR', text: "Interesting! What do you consider your greatest professional strength?" },
      { speaker: 'You', text: "I believe my ability to quickly adapt to new technologies and communicate effectively with cross-functional teams is my greatest strength." }
    ]
  },
  {
    id: 'rp4',
    title: 'Customer Support Call',
    difficulty: 'Intermediate',
    scenario: 'You are a customer service representative handling a complaint.',
    prompts: [
      { speaker: 'Customer', text: "I have been trying to reach your support team for three days regarding my billing issue." },
      { speaker: 'You', text: "I sincerely apologize for the delay. Let me look into your account and resolve the issue right away." },
      { speaker: 'Customer', text: "I was charged twice for the same subscription and no one responded to my emails." },
      { speaker: 'You', text: "I understand your frustration. I will process a full refund for the duplicate charge immediately and send you a confirmation." }
    ]
  }
];

export const tongueTwisters = [
  {
    id: 'tt1',
    title: 'Seashells on the Shore',
    focus: "'S' and 'Sh' sounds (Diction)",
    text: "She sells seashells by the seashore. The shells she sells are surely seashells.",
    tamil: "‘S’ மற்றும் ‘Sh’ உச்சரிப்புப் பயிற்சி."
  },
  {
    id: 'tt2',
    title: 'Peter Piper Picked',
    focus: "'P' plosives (Clarity)",
    text: "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.",
    tamil: "‘P’ ஒலி பயிற்சி. வார்த்தைகள் அழுத்தமாகவும் தெளிவாகவும்."
  },
  {
    id: 'tt3',
    title: 'Woodchuck Wood',
    focus: "'W' and 'Ch' sounds (Fluency)",
    text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    tamil: "‘W’ மற்றும் ‘Ch’ ஒலி பயிற்சி."
  },
  {
    id: 'tt4',
    title: 'Red Lorry, Yellow Lorry',
    focus: "'R' and 'L' contrast (Accent)",
    text: "Red lorry, yellow lorry, red lorry, yellow lorry.",
    tamil: "‘R’ மற்றும் ‘L’ உச்சரிப்பு வேறுபாடு."
  },
  {
    id: 'tt5',
    title: 'Betty Botter Bought Butter',
    focus: "'B' plosives (Diction)",
    text: "Betty Botter bought some butter. But she said the butter was bitter.",
    tamil: "‘B’ ஒலி பயிற்சி. வார்த்தை தெளிவுக்கு உதவும்."
  }
];

export const freeSpeechPrompts = [
  {
    id: 'fs1',
    topic: 'Professional Self Introduction',
    hint: 'Beginner: Talk about your name, education, and key interests.',
    suggestedPoints: ['My name is...', 'I graduated from...', 'I am passionate about...', 'In my free time, I enjoy...']
  },
  {
    id: 'fs2',
    topic: 'A Technical Challenge I Solved',
    hint: 'Intermediate: Describe a bug or project problem, how you analyzed and resolved it.',
    suggestedPoints: ['Recently, I faced an issue where...', 'To debug this, I decided to...', 'The root cause turned out to be...', 'After fixing it, the performance improved by...']
  },
  {
    id: 'fs3',
    topic: 'Why MNCs appeal to me',
    hint: 'Advanced: Discuss global work culture, learning curves, multi-cultural teams.',
    suggestedPoints: ['MNCs offer an incredible learning environment...', 'I look forward to collaborating with global teams...', 'Working on large-scale applications will help me...', 'I want to contribute my skills to...']
  },
  {
    id: 'fs4',
    topic: 'My Career Goals for the Next 5 Years',
    hint: 'Intermediate: Talk about your professional aspirations and growth plan.',
    suggestedPoints: ['In the next five years, I see myself...', 'I plan to upskill in...', 'I want to take on leadership roles in...', 'My ultimate goal is to...']
  }
];
