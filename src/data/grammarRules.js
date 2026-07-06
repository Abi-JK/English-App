export const grammarRules = [
  {
    id: 'g1',
    title: 'Subject-Verb Agreement',
    tag: 'Common Error',
    tagColor: '#ef4444',
    rule: 'A singular subject takes a singular verb; a plural subject takes a plural verb.',
    examples: [
      { wrong: "She don't like coffee.", right: "She doesn't like coffee." },
      { wrong: "The team are playing well.", right: "The team is playing well." }
    ],
    tip: '⚡ Quick Tip: Words like "everyone", "nobody", "each", "either" are always SINGULAR.'
  },
  {
    id: 'g2',
    title: 'Articles (a, an, the)',
    tag: 'Must Know',
    tagColor: '#3b82f6',
    rule: 'Use "a" before consonant sounds, "an" before vowel sounds. Use "the" for specific nouns.',
    examples: [
      { wrong: "She is a honest person.", right: "She is an honest person." },
      { wrong: "He is best player in team.", right: "He is the best player in the team." }
    ],
    tip: '⚡ Quick Tip: "an hour" — H is silent, so it takes "an". "a university" — U sounds like "yoo" so it takes "a".'
  },
  {
    id: 'g3',
    title: 'Tense Consistency',
    tag: 'Most Common',
    tagColor: '#8b5cf6',
    rule: 'Do not shift tenses unnecessarily within the same sentence or paragraph.',
    examples: [
      { wrong: "He went to the store and buys milk.", right: "He went to the store and bought milk." },
      { wrong: "I will go if she comes and bring food.", right: "I will go if she comes and brings food." }
    ],
    tip: '⚡ Quick Tip: In "If" conditional sentences — If + present → future. If + past → would.'
  },
  {
    id: 'g4',
    title: 'Active vs Passive Voice',
    tag: 'Exam Important',
    tagColor: '#f59e0b',
    rule: 'In active voice, subject performs the action. In passive voice, subject receives the action.',
    examples: [
      { wrong: "The report was wrote by him.", right: "The report was written by him." },
      { wrong: "The manager is approved the request.", right: "The request is approved by the manager." }
    ],
    tip: '⚡ Quick Tip: Passive = form of "be" + Past Participle (V3). "was written", "is approved", "will be completed".'
  },
  {
    id: 'g5',
    title: 'Prepositions of Time & Place',
    tag: 'Common Error',
    tagColor: '#06b6d4',
    rule: 'Use "at" for specific points, "on" for surfaces/days, "in" for enclosed spaces/months/years.',
    examples: [
      { wrong: "I will meet you in Monday.", right: "I will meet you on Monday." },
      { wrong: "She lives at Chennai.", right: "She lives in Chennai." }
    ],
    tip: '⚡ Quick Tip: at (specific): at 5pm, at home. on (day/date): on Friday. in (period/place): in June, in India.'
  },
  {
    id: 'g6',
    title: 'Direct & Indirect Speech',
    tag: 'Exam Important',
    tagColor: '#ec4899',
    rule: 'When converting direct speech to indirect, tense usually shifts back one step.',
    examples: [
      { wrong: 'He said that he is coming.', right: 'He said that he was coming.' },
      { wrong: 'She asked that where are you going.', right: 'She asked where I was going.' }
    ],
    tip: '⚡ Quick Tip: Present → Past. "will" → "would". "can" → "could". Remove quotes, add "that", change pronouns.'
  },
  {
    id: 'g7',
    title: 'Question Tags',
    tag: 'Must Know',
    tagColor: '#6366f1',
    rule: 'Positive statement → negative tag. Negative statement → positive tag.',
    examples: [
      { wrong: "You are coming, are you?", right: "You are coming, aren't you?" },
      { wrong: "She didn't go, didn't she?", right: "She didn't go, did she?" }
    ],
    tip: '⚡ Quick Tip: Match the auxiliary verb (do/does/did/have/will/can) in the tag. "He can swim, can\'t he?"'
  },
  {
    id: 'g8',
    title: 'Relative Clauses (Who/Which/That/Whom)',
    tag: 'Advanced',
    tagColor: '#a855f7',
    rule: 'Use "who" for people, "which" for things, "that" for both (in defining clauses). "Whom" for object of verb.',
    examples: [
      { wrong: "The man which called you is here.", right: "The man who called you is here." },
      { wrong: "This is the book who I bought.", right: "This is the book which I bought." }
    ],
    tip: '⚡ Quick Tip: People → who/whom. Things → which/that. Possession → whose. "The student whose bag was lost..."'
  }
];
