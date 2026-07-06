export const boosterQuestions = [
  {
    question: 'What is the meaning of the idiom "Spill the beans"?',
    options: ['A) To drop kitchen ingredients', 'B) To reveal a secret', 'C) To complain about work', 'D) To cook a hot meal'],
    correct: 1,
    funFact: 'This idiom comes from ancient Greece where voting was done with beans!'
  },
  {
    question: 'What does the phrasal verb "break down" mean in this sentence: "The car broke down on the highway"?',
    options: ['A) To crash', 'B) To stop functioning', 'C) To speed up', 'D) To change direction'],
    correct: 1,
    funFact: '"Break down" can also mean to analyze something in detail, e.g., "Let\'s break down the problem."'
  },
  {
    question: 'Which is the correct spelling?',
    options: ['A) Accomodation', 'B) Acommodation', 'C) Accommodation', 'D) Acomodation'],
    correct: 2,
    funFact: 'Remember: double c, double m.'
  },
  {
    question: 'What is the antonym (opposite) of "Benevolent"?',
    options: ['A) Generous', 'B) Malevolent', 'C) Kind', 'D) Calm'],
    correct: 1,
    funFact: '"Bene" means good (benefit). "Male" means bad (malice, malicious).'
  },
  {
    question: 'Choose the correct preposition: "She is good ______ mathematics."',
    options: ['A) in', 'B) at', 'C) on', 'D) with'],
    correct: 1,
    funFact: '"Good at" is used for skills. "Good in" is incorrect in standard English.'
  },
  {
    question: 'Identify the correctly spelled word:',
    options: ['A) Maintanance', 'B) Maintenance', 'C) Maintenence', 'D) Maintainance'],
    correct: 1,
    funFact: 'This word is frequently tested in SSC and Banking exams!'
  },
  {
    question: 'What does the idiom "Hit the ground running" mean?',
    options: ['A) To fall and get hurt', 'B) To start something with great energy', 'C) To run a marathon', 'D) To leave quickly'],
    correct: 1,
    funFact: 'This phrase is commonly used in MNC workplaces.'
  },
  {
    question: 'Fill in the blank: "If I ______ you, I would accept the offer."',
    options: ['A) was', 'B) were', 'C) am', 'D) be'],
    correct: 1,
    funFact: 'In subjunctive mood (imaginary situations), always use "were" even with I/he/she.'
  },
  {
    question: 'Which word means "to continue despite difficulty"?',
    options: ['A) Abandon', 'B) Persevere', 'C) Surrender', 'D) Hesitate'],
    correct: 1,
    funFact: '"Persevere" is one of the most commonly tested vocabulary words in TNPSC and SSC exams.'
  },
  {
    question: 'What is the synonym of "Articulate"?',
    options: ['A) Confused', 'B) Eloquent', 'C) Silent', 'D) Rough'],
    correct: 1,
    funFact: '"Articulate" and "Eloquent" both describe someone who speaks clearly.'
  },
  {
    question: 'Choose the correct form: "Neither the teacher nor the students ______ present."',
    options: ['A) was', 'B) were', 'C) is', 'D) has'],
    correct: 1,
    funFact: 'In "neither...nor", the verb agrees with the subject nearest to it (students → were).'
  },
  {
    question: 'What is the passive voice of: "She writes a letter"?',
    options: ['A) A letter is written by her', 'B) A letter was written by her', 'C) A letter is being written by her', 'D) A letter has been written by her'],
    correct: 0,
    funFact: 'Simple Present Active → is/am/are + V3 in Passive.'
  },
];

export const getTodayBooster = () => {
  const today = new Date().toDateString();
  const dayNum = today.split(' ').reduce((acc, part) => acc + part.charCodeAt(0), 0);
  return boosterQuestions[dayNum % boosterQuestions.length];
};
