export const questionSets = {
  tnpsc: {
    label: 'TNPSC General English',
    color: '#10b981',
    emoji: '🏛️',
    description: 'Previous Year Questions from TNPSC Group 2, 2A, 4 exams.',
    questions: [
      {
        id: 't1', topic: 'Synonym',
        question: 'Choose the correct synonym for "Candid":',
        options: ['Secretive (ரகசியமான)', 'Frank (வெளிப்படையான)', 'Timid (கோழையான)', 'Harsh (கடுமையான)'],
        answer: 1,
        explanation: '"Candid" means truthful and straightforward. "Frank" has the same meaning. (தமிழ்: "Candid" என்றால் நேர்மையான, எதையும் மறைக்காமல் பேசக்கூடிய. எனவே "Frank" சரியான இணைச்சொல்.)'
      },
      {
        id: 't2', topic: 'Antonym',
        question: 'Choose the correct antonym for "Benevolent":',
        options: ['Kind (இரக்கமுள்ள)', 'Generous (கொடைத்தன்மையுள்ள)', 'Malevolent (வஞ்சகமுள்ள/தீய)', 'Calm (அமைதியான)'],
        answer: 2,
        explanation: '"Benevolent" means kind and generous. Its antonym is "Malevolent" which means wishing evil to others. (தமிழ்: "Benevolent" என்பது கருணையும் நற்குணமும் கொண்டவரைக் குறிக்கும். இதற்கு எதிர்ச்சொல் "Malevolent" - தீமையை விரும்பும்.)'
      },
      {
        id: 't3', topic: 'Error Spotting',
        question: 'Spot the error: "Each of the students have submitted their assignments on time."',
        options: ['Each of the students', 'have submitted', 'their assignments', 'on time'],
        answer: 1,
        explanation: '"Each" is singular, so the verb must be singular "has". Correct: "Each of the students HAS submitted..." (தமிழ்: "Each" ஒருமை, எனவே "have" பன்மை தவறு. "has" வர வேண்டும்.)'
      },
      {
        id: 't4', topic: 'Fill in the Blank',
        question: 'She has been working here ______ 2019.',
        options: ['for', 'since', 'from', 'during'],
        answer: 1,
        explanation: '"Since" is used with a specific starting point (2019). "For" is used with duration. (தமிழ்: குறிப்பிட்ட தொடக்க காலத்தை (2019) குறிக்க "since" பயன்படுகிறது.)'
      },
      {
        id: 't5', topic: 'Sentence Pattern',
        question: 'Identify the sentence pattern: "The teacher gave the students a test yesterday."',
        options: ['S V O A', 'S V IO DO A', 'S V C A', 'S V O O'],
        answer: 1,
        explanation: '"The teacher" (S) + "gave" (V) + "the students" (IO) + "a test" (DO) + "yesterday" (A). Pattern: S V IO DO A. (தமிழ்: Subject + Verb + Indirect Object + Direct Object + Adjunct.)'
      },
      {
        id: 't6', topic: 'Prefix',
        question: 'Identify the appropriate prefix to form the antonym of "Behave":',
        options: ['dis', 'un', 'mis', 'in'],
        answer: 2,
        explanation: 'The prefix "mis-" is added to "behave" to form "misbehave". (தமிழ்: "Behave" க்கு எதிர்ச்சொல் "mis-" முன்னொட்டை சேர்த்து "misbehave" ஆகும்.)'
      },
      {
        id: 't7', topic: 'Article',
        question: 'Fill in the blank: "He is ______ honorable member of the committee."',
        options: ['a', 'an', 'the', 'no article needed'],
        answer: 1,
        explanation: 'The H in "honorable" is silent, so it starts with a vowel sound. Hence "an". (தமிழ்: "Honorable" இல் H மௌனம், உயிரெழுத்து ஒலியில் தொடங்குவதால் "an" பயன்படுத்த வேண்டும்.)'
      },
      {
        id: 't8', topic: 'Synonym',
        question: 'Choose the correct synonym for "Reluctant":',
        options: ['Eager (ஆர்வமுள்ள)', 'Unwilling (விருப்பமில்லாத)', 'Ready (தயாரான)', 'Happy (மகிழ்ச்சியான)'],
        answer: 1,
        explanation: '"Reluctant" means unwilling and hesitant. Hence "Unwilling" is correct. (தமிழ்: "Reluctant" என்றால் செய்ய விருப்பமில்லாமல் தயங்குதல். "Unwilling" சரியான இணைச்சொல்.)'
      },
      {
        id: 't9', topic: 'Blanks',
        question: 'The committee ______ divided in their opinions regarding the new database system.',
        options: ['was', 'were', 'is', 'has'],
        answer: 1,
        explanation: 'When collective noun "committee" acts as individuals with differing opinions, it takes plural verb "were". (தமிழ்: கூட்டுச்சொல் "committee" வெவ்வேறு கருத்துக்களைக் கொண்டிருக்கும்போது பன்மையாகக் கருதப்பட்டு "were" வரும்.)'
      },
      {
        id: 't10', topic: 'Relative Pronoun',
        question: 'Fill in the blank: "The candidate ______ resume was reviewed has been shortlisted."',
        options: ['who', 'whom', 'whose', 'which'],
        answer: 2,
        explanation: '"Whose" is a possessive relative pronoun showing ownership of the resume. (தமிழ்: உடைமையைக் குறிக்க "Whose" பயன்படுகிறது - "யாருடைய resume பார்க்கப்பட்டதோ".)'
      },
      {
        id: 't11', topic: 'Tense',
        question: 'Choose the correct form: "By next year, she ______ here for five years."',
        options: ['works', 'will have worked', 'had worked', 'has been working'],
        answer: 1,
        explanation: '"By next year" refers to a future point, so use Future Perfect "will have worked". (தமிழ்: "By next year" எதிர்கால நேரத்தைக் குறிக்கிறது. "will have worked" பயன்படுத்தப்படுகிறது.)'
      },
      {
        id: 't12', topic: 'Preposition',
        question: 'Choose the correct preposition: "She is very good ______ mathematics."',
        options: ['in', 'at', 'on', 'with'],
        answer: 1,
        explanation: 'The correct idiom is "good at" something. "Good in" is incorrect. (தமிழ்: ஒரு துறையில் திறமையைக் குறிக்க "good at" பயன்படுத்த வேண்டும்.)'
      },
      {
        id: 't13', topic: 'Voice Change',
        question: 'Convert to Active Voice: "The report was submitted by the manager yesterday."',
        options: [
          'The manager submitted the report yesterday.',
          'The manager was submitted the report yesterday.',
          'The report submitted the manager yesterday.',
          'The manager had submitted the report yesterday.'
        ],
        answer: 0,
        explanation: 'In active voice, the subject (the manager) performs the action. (தமிழ்: செய்வினையில், எழுவாய் செயலைச் செய்கிறது. "The manager submitted the report" என்பதே சரி.)'
      },
      {
        id: 't14', topic: 'Question Tag',
        question: 'Complete the question tag: "You have completed your work, ______?"',
        options: ['have you?', 'haven\'t you?', 'didn\'t you?', 'don\'t you?'],
        answer: 1,
        explanation: 'For positive statements with "have", the question tag is negative "haven\'t you?". (தமிழ்: நேர்மறை வாக்கியத்திற்கு எதிர்மறை question tag வரும்.)'
      },
      {
        id: 't15', topic: 'Adverb',
        question: 'Choose the correct order: "She speaks English ______."',
        options: ['very fluently well', 'very well fluently', 'very fluently', 'fluently very well'],
        answer: 2,
        explanation: 'Adverb "fluently" can be modified by "very". "Very fluently" is correct. (தமிழ்: "fluently" என்பது வினையுரிச்சொல், "very" கொண்டு மாற்றலாம்.)'
      },
      {
        id: 't16', topic: 'Homophones',
        question: 'Choose the correct word: "The principal gave a very inspiring ______ during the morning assembly."',
        options: ['lesson (பாடம்)', 'lessen (குறைத்தல்)', 'listen (கேட்டல்)', 'leasing (குத்தகை)'],
        answer: 0,
        explanation: '"Lesson" is a teaching session. "Lessen" means to reduce. They are homophones - words that sound the same but have different meanings. (தமிழ்: "Lesson" பாடம், "Lessen" குறைத்தல். இவை ஒலியில் ஒன்றுபோல் இருந்தாலும் பொருளில் வேறுபட்டவை.)'
      },
      {
        id: 't17', topic: 'Degrees of Comparison',
        question: 'Fill in the blank: "Mount Everest is ______ peak in the world."',
        options: ['higher', 'highest', 'the highest', 'more high'],
        answer: 2,
        explanation: 'Superlative degree needs "the" before it. Correct: "the highest". (தமிழ்: மேல் நிலை ஒப்பீட்டில் "the" கண்டிப்பாக வர வேண்டும்.)'
      },
      {
        id: 't18', topic: 'Gerund / Infinitive',
        question: 'Choose the correct form: "She is looking forward to ______ from the university."',
        options: ['graduate', 'graduating', 'graduated', 'graduation'],
        answer: 1,
        explanation: 'After "look forward to", the preposition "to" is followed by a gerund (V+ing). (தமிழ்: "look forward to" இல் "to" ஒரு preposition, ஆகவே அதற்கு அடுத்து Gerund (V+ing) வரும்.)'
      },
      {
        id: 't19', topic: 'Conditional Sentence',
        question: 'Complete the sentence: "If she had studied harder, she ______ the exam."',
        options: ['would pass', 'would have passed', 'will pass', 'passed'],
        answer: 1,
        explanation: 'Type 3 conditional: If + Past Perfect → would have + V3. (தமிழ்: வகை 3 நிபந்தனை: "If + had V3" வந்தால் "would have + V3" வரும்.)'
      },
      {
        id: 't20', topic: 'Idiom',
        question: 'What is the meaning of the idiom "To burn the midnight oil"?',
        options: ['To waste fuel unnecessarily', 'To work or study late into the night', 'To get angry quickly', 'To cook food late at night'],
        answer: 1,
        explanation: '"Burn the midnight oil" = working late at night. (தமிழ்: இரவு நேரத்தில் தாமதமாக வேலை செய்வது அல்லது படிப்பது.)'
      }
    ]
  },
  ssc: {
    label: 'SSC / RRB / NTPC English',
    color: '#06b6d4',
    emoji: '📋',
    description: 'Central Government exam questions on error detection, grammar, idioms and phrase substitution.',
    questions: [
      {
        id: 's1', topic: 'Error Detection',
        question: 'Spot the grammatical error: "No sooner did the train arrived at the platform than the passengers rushed to board it."',
        options: ['No sooner did the', 'train arrived at the', 'than the passengers', 'No error'],
        answer: 1,
        explanation: 'The auxiliary verb "did" must be followed by base form of the verb (arrive). Correct: "did... arrive". (தமிழ்: "did" வந்தால் அதற்கு அடுத்த வினைச்சொல் V1 base form இல் "arrive" வர வேண்டும்.)'
      },
      {
        id: 's2', topic: 'Fill in the Blank',
        question: 'The new manager was highly ______; she easily spotted the minor discrepancy in the draft proposal.',
        options: ['lethargic (சோம்பேறித்தனமான)', 'assiduous (முயற்சியும் கவனமும்)', 'dilatory (காலம் தாழ்த்தும்)', 'remiss (அலட்சியமான)'],
        answer: 1,
        explanation: '"Assiduous" means showing great care, attention, and effort. (தமிழ்: "Assiduous" என்றால் மிகுந்த கவனத்துடன் செயல்படுதல்.)'
      },
      {
        id: 's3', topic: 'Preposition',
        question: 'The company entered ______ a new joint venture with the local state government.',
        options: ['into', 'in', 'on', 'with'],
        answer: 0,
        explanation: '"Enter into" is used when starting an agreement or partnership. (தமிழ்: ஒப்பந்தத்தை தொடங்க "enter into" பயன்படுகிறது.)'
      },
      {
        id: 's4', topic: 'One Word Substitution',
        question: 'Choose the one word substitution for: "A person who is indifferent to pains and pleasures of life."',
        options: ['Sadist', 'Stoic', 'Expatriate', 'Recluse'],
        answer: 1,
        explanation: 'A "Stoic" endures pain without showing feelings. (தமிழ்: இன்ப துன்பங்களை சமமாக பாவிப்பவர் "Stoic".)'
      },
      {
        id: 's5', topic: 'Error Detection',
        question: 'Spot the error: "If I was you, I would have accepted the technical project lead offer."',
        options: ['If I was you', 'I would have', 'accepted the', 'No error'],
        answer: 0,
        explanation: 'In subjunctive mood, use "were" instead of "was" for all subjects. Correct: "If I were you". (தமிழ்: கற்பனை நிபந்தனை வாக்கியங்களில் எப்போதும் "were" மட்டுமே.)'
      },
      {
        id: 's6', topic: 'Idiom',
        question: 'What is the meaning of the idiom: "Take it with a grain of salt"?',
        options: ['To add seasoning to a meal', 'To listen with skepticism or doubt', 'To accept something completely', 'To argue over trivial matters'],
        answer: 1,
        explanation: 'To take something with a grain of salt means to view it with skepticism. (தமிழ்: ஒரு தகவலை முழுமையாக நம்பாமல் சந்தேகத்துடன் பார்ப்பது.)'
      },
      {
        id: 's7', topic: 'Voice Change',
        question: 'Convert to Passive Voice: "The QA team discovered several severe bugs during migration."',
        options: [
          'Several severe bugs was discovered by the QA team.',
          'Several severe bugs were discovered by the QA team.',
          'Several severe bugs had discovered by the QA team.',
          'Several severe bugs were discover by the QA team.'
        ],
        answer: 1,
        explanation: '"Bugs" is plural, so "were discovered". (தமிழ்: "Bugs" பன்மை என்பதால் "were discovered" என வரும்.)'
      },
      {
        id: 's8', topic: 'Spellings',
        question: 'Identify the correctly spelled word:',
        options: ['Maintanance', 'Maintenance', 'Maintenence', 'Maintainance'],
        answer: 1,
        explanation: 'The correct spelling is "Maintenance". (தமிழ்: "Maintenance" என்பதே சரியான எழுத்துக்கோவை.)'
      },
      {
        id: 's9', topic: 'Phrase Substitution',
        question: 'Choose the correct phrase: "He walked ______ the room without making a sound."',
        options: ['in to', 'into', 'in', 'onto'],
        answer: 1,
        explanation: '"Into" indicates movement from outside to inside. (தமிழ்: வெளியிலிருந்து உள்ளே செல்வதைக் குறிக்க "into" பயன்படுகிறது.)'
      },
      {
        id: 's10', topic: 'Narration',
        question: 'Convert to Indirect Speech: "He said, \'I am busy right now.\'"',
        options: [
          'He said that he is busy right now.',
          'He said that he was busy then.',
          'He said that I am busy right now.',
          'He says that he was busy.'
        ],
        answer: 1,
        explanation: 'Present tense changes to past, "right now" → "then". (தமிழ்: நிகழ்காலம் இறந்தகாலமாக மாறும். "Right now" → "then".)'
      },
      {
        id: 's11', topic: 'Conjunction',
        question: 'Fill in: "Work hard ______ you will fail the exam."',
        options: ['and', 'or', 'but', 'so'],
        answer: 1,
        explanation: '"Or" indicates a consequence. "Work hard or you will fail". (தமிழ்: "Or" மாற்று விளைவைக் காட்டுகிறது.)'
      },
      {
        id: 's12', topic: 'Adjective Order',
        question: 'Arrange in correct order: "She bought a ______ dress."',
        options: [
          'beautiful red silk Indian',
          'Indian red beautiful silk',
          'silk beautiful red Indian',
          'red beautiful Indian silk'
        ],
        answer: 0,
        explanation: 'Adjective order: Opinion (beautiful) → Color (red) → Material (silk) → Origin (Indian). (தமிழ்: கருத்து → நிறம் → பொருள் → தோற்றம்.)'
      },
      {
        id: 's13', topic: 'Error Detection',
        question: 'Spot the error: "The scenery of this place are very beautiful and attracts many tourists every year."',
        options: ['The scenery of this place', 'are very beautiful', 'attracts many tourists', 'No error'],
        answer: 1,
        explanation: '"Scenery" is an uncountable noun and is always singular. Correct: "The scenery... IS very beautiful". (தமிழ்: "Scenery" என்பது எண்ண முடியாத பெயர்ச்சொல். "are" தவறு, "is" வர வேண்டும்.)'
      },
      {
        id: 's14', topic: 'Phrase Substitution',
        question: 'Replace with correct phrase: "He was confused among the two options because both seemed equally good."',
        options: ['between the two', 'among the both', 'in the two', 'within the two'],
        answer: 0,
        explanation: '"Between" is used for two things. "Among" is used for three or more. (தமிழ்: "Between" இரண்டிற்கு மட்டும். "Among" மூன்று அல்லது அதற்கு மேல்.)'
      },
      {
        id: 's15', topic: 'Tense',
        question: 'Fill in: "The train ______ before we reached the station."',
        options: ['left', 'had left', 'has left', 'was leaving'],
        answer: 1,
        explanation: 'When one past action occurs before another past action, use Past Perfect for the earlier one. (தமிழ்: இரண்டு இறந்தகால நிகழ்வுகளில் முதலில் நடந்ததற்கு Past Perfect "had left".)'
      },
      {
        id: 's16', topic: 'Subject-Verb Agreement',
        question: 'Choose the correct verb: "The news ______ not good today from the financial markets."',
        options: ['is', 'are', 'were', 'have been'],
        answer: 0,
        explanation: '"News" looks plural but is uncountable and takes a singular verb. (தமிழ்: "News" பன்மை போல் தோன்றினாலும் எண்ண முடியாதது. ஒருமை வினை "is" எடுக்கும்.)'
      },
      {
        id: 's17', topic: 'Figure of Speech',
        question: 'Identify the figure of speech: "The wind whispered through the trees."',
        options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'],
        answer: 2,
        explanation: 'Personification gives human qualities (whispering) to non-human things (wind). (தமிழ்: மனிதப் பண்புகளை மனிதர் அல்லாதவற்றுக்கு கொடுப்பது Personification.)'
      }
    ]
  },
  banking: {
    label: 'Banking Exams (IBPS/SBI)',
    color: '#8b5cf6',
    emoji: '🏦',
    description: 'High-level English verbal ability questions focusing on double fillers, sentence correction, and vocabulary.',
    questions: [
      {
        id: 'b1', topic: 'Double Fillers',
        question: 'Complete the sentence: "The government has decided not to ______ any further taxes on luxury goods to avoid ______ consumer spending."',
        options: [
          'impose, dampening (விதிப்பது, குறைப்பது)',
          'levy, fostering (விதிப்பது, வளர்ப்பது)',
          'exorcise, inflating (வெளியேற்றுவது, கூட்டுவது)',
          'implement, boosting (செயல்படுத்துவது, ஊக்குவிப்பது)'
        ],
        answer: 0,
        explanation: '"Impose" taxes means to enforce them. "Dampen" means to reduce. (தமிழ்: வரி "விதிப்பது" (impose) வாங்குவதை "குறைப்பது" (dampening).)'
      },
      {
        id: 'b2', topic: 'Sentence Improvement',
        question: 'Choose the correct alternative: "If I had known about the server migration delay, I would have notified the client earlier."',
        options: ['I would notify', 'I will notify', 'I would have notified (No correction required)', 'I should notify'],
        answer: 2,
        explanation: 'Conditional Type 3: If + Past Perfect → would have + V3. (தமிழ்: "If + had V3" வந்தால் "would + have + V3" வரவேண்டும்.)'
      },
      {
        id: 'b3', topic: 'Conjunctions',
        question: 'Fill in the blank: "______ did the director announce the roadmap update, than the developers raised scheduling concerns."',
        options: ['Scarcely', 'Hardly', 'No sooner', 'Barely'],
        answer: 2,
        explanation: 'The pair is "No sooner... than". For Scarcely/Hardly, use "when". (தமிழ்: "No sooner... than" இணை சரியானது.)'
      },
      {
        id: 'b4', topic: 'Error Detection',
        question: 'Spot the error: "Neither the project director nor the developers was present at the sprint meeting."',
        options: ['Neither the project director', 'nor the developers', 'was present', 'No error'],
        answer: 2,
        explanation: 'With "neither... nor", verb agrees with closer subject "developers" (plural → "were"). (தமிழ்: அருகில் உள்ள "developers" பன்மை என்பதால் "were" வர வேண்டும்.)'
      },
      {
        id: 'b5', topic: 'Cloze Test',
        question: 'Fill in the blank: "The RBI has ______ new guidelines for digital lending to protect borrowers."',
        options: ['put out', 'brought in', 'taken over', 'laid down'],
        answer: 3,
        explanation: '"Laid down" means to officially establish rules. (தமிழ்: "Laid down" அதிகாரப்பூர்வமாக விதிகள் நிறுவுதல்.)'
      },
      {
        id: 'b6', topic: 'Reading Comprehension',
        question: 'Choose the correct meaning: "The word \'deteriorate\' in the passage most nearly means:"',
        options: ['Improve (மேம்படுத்த)', 'Worsen (மோசமடைதல்)', 'Remain stable (நிலையாக இருத்தல்)', 'Accelerate (வேகமடைதல்)'],
        answer: 1,
        explanation: '"Deteriorate" means to become worse in quality. (தமிழ்: "Deteriorate" தரத்தில் மோசமடைதல்.)'
      },
      {
        id: 'b7', topic: 'Para Jumble',
        question: 'Arrange the sentences in logical order: A) However, the project was delayed due to unforeseen issues. B) The team worked tirelessly to meet the deadline. C) Finally, the client appreciated their efforts. D) The initial plan was to launch in March.',
        options: ['D, A, B, C', 'B, D, A, C', 'A, C, B, D', 'D, B, A, C'],
        answer: 0,
        explanation: 'Logical order: Initial plan (D) → Delay (A) → Team effort (B) → Appreciation (C). (தமிழ்: ஆரம்ப திட்டம் → தாமதம் → முயற்சி → பாராட்டு.)'
      },
      {
        id: 'b8', topic: 'Vocabulary',
        question: 'Choose the word most similar in meaning to "Mitigate":',
        options: ['Aggravate (மோசமாக்கு)', 'Alleviate (குறைத்தல்)', 'Eliminate (முற்றிலும் அகற்று)', 'Ignore (புறக்கணி)'],
        answer: 1,
        explanation: '"Mitigate" means to make less severe. "Alleviate" has the same meaning. (தமிழ்: "Mitigate" கடுமையைக் குறைத்தல். "Alleviate" இணை.)'
      },
      {
        id: 'b9', topic: 'Fill in the Blank',
        question: 'The new policy will come ______ effect from the next financial year beginning April 1st.',
        options: ['in', 'into', 'to', 'on'],
        answer: 1,
        explanation: '"Come into effect" is an idiomatic expression meaning to start operating. (தமிழ்: "Come into effect" ஒரு சொற்றொடர், அதாவது செயல்படத் தொடங்குதல்.)'
      },
      {
        id: 'b10', topic: 'Error Detection',
        question: 'Spot the error: "One of the most important criteria for the loan approval is your credit score."',
        options: ['One of the most', 'important criteria', 'is your credit score', 'No error'],
        answer: 1,
        explanation: '"Criteria" is plural. "One of the... criteria" should use plural noun but singular verb. Correct as given. (தமிழ்: "Criteria" பன்மை. "One of the" வந்தால் பன்மை பெயர்ச்சொல் + ஒருமை வினை சரியே.)'
      },
      {
        id: 'b11', topic: 'Idiom',
        question: 'What is the meaning of "To play devil\'s advocate"?',
        options: ['To support someone blindly', 'To argue against an idea for discussion', 'To cheat in a game', 'To take revenge on someone'],
        answer: 1,
        explanation: '"Play devil\'s advocate" means to present opposing arguments to stimulate discussion. (தமிழ்: விவாதத்தை தூண்டுவதற்காக எதிர் கருத்தை முன்வைத்தல்.)'
      },
      {
        id: 'b12', topic: 'Reading Comprehension',
        question: 'Choose the correct meaning: "The word \'burgeoning\' in the passage most nearly means:"',
        options: ['Declining (சரிவு)', 'Rapidly growing (வேகமாக வளரும்)', 'Stable (நிலையான)', 'Difficult (கடினமான)'],
        answer: 1,
        explanation: '"Burgeoning" means growing or expanding quickly, often used in economic contexts. (தமிழ்: "Burgeoning" வேகமாக வளரும்/விரிவடையும்.)'
      }
    ]
  }
};

export const examNotes = [
  { title: '📌 Subject-Verb Agreement', content: '• Singular subject → singular verb. "Each student HAS..."\n• "Either/Neither/Everyone/Each" → always singular verb.\n• Two subjects joined by "and" → plural verb.\n• "The news IS..." (looks plural but singular noun).\n• Collective nouns (team, committee) → singular verb when acting as one unit.' },
  { title: '📌 Direct & Indirect Speech', content: '• Present Simple → Past Simple ("I work" → "He said he worked")\n• Present Continuous → Past Continuous\n• "Will" → "Would"\n• "Can" → "Could"\n• "May" → "Might"\n• Exception: Universal truths do NOT change tense.' },
  { title: '📌 Tense Formula Sheet', content: '• Simple Past: V2 (went, did, saw)\n• Present Perfect: has/have + V3\n• Past Perfect: had + V3\n• Future: will + V1\n• Conditional 1: If + present → will\n• Conditional 2: If + past → would\n• Conditional 3: If + had V3 → would have V3' },
  { title: '📌 Common Prepositions', content: '• at: specific time/place (at 5 PM, at home)\n• on: days/dates (on Monday, on 5th June)\n• in: months/years/large places (in June, in India)\n• for: duration (for 3 years)\n• since: point in time (since 2020)\n• by: deadline (by Friday)' },
  { title: '📌 Active & Passive Voice', content: '• Simple Present: He writes → It is written\n• Simple Past: He wrote → It was written\n• Present Continuous: He is writing → It is being written\n• Present Perfect: He has written → It has been written\n• Modal: He can write → It can be written' },
  { title: '📌 Articles (A, An, The)', content: '• "A" before consonant sounds: a book, a university\n• "An" before vowel sounds: an apple, an hour\n• "The" for specific items: the sun, the book you gave me\n• No article before plural general: Books are useful.\n• No article before proper nouns: I live in India.' },
  { title: '📌 Commonly Confused Words', content: '• Their (அவர்களுடைய) / There (அங்கே) / They\'re (அவர்கள்)\n• Your (உங்களுடைய) / You\'re (நீங்கள்)\n• Its (அதன்) / It\'s (அது)\n• Affect (பாதிப்பு-verb) / Effect (விளைவு-noun)\n• Accept (ஏற்றுக்கொள்) / Except (தவிர)' },
];

export const examStrategies = [
  {
    title: '🎯 Topic Weightage (வினாக்கள் வரும் முக்கிய பகுதிகள்)',
    desc: 'In TNPSC & SSC, 70% of the English section focuses on: Error Spotting, Active/Passive Voice, and Synonyms/Antonyms. Focus here first.',
    tamil: 'TNPSC மற்றும் SSC தேர்வுகளில் 70% கேள்விகள் பிழை கண்டறிதல், Active/Passive, மற்றும் பொருள்/எதிர்ச்சொல் ஆகியவற்றில் இருந்தே கேட்கப்படுகின்றன.'
  },
  {
    title: '💡 How to Spot Errors Instantly (பிழைகளை எளிதாக கண்டுபிடிப்பது)',
    desc: 'Look for singular/plural disagreements, incorrect tense shifts, wrong preposition pairings. "No sooner did..." must use base verb + "than".',
    tamil: '"did" வந்தால் "arrived" அல்ல, "arrive" வர வேண்டும். "No sooner" வந்தால் "than" தான் வர வேண்டும்.'
  },
  {
    title: '⚡ PYQ Crack Strategy (கடந்த கால வினாத்தாள் உத்தி)',
    desc: 'Solve at least 10 previous years\' question sets. Grammatical patterns repeat constantly!',
    tamil: 'குறைந்தபட்சம் 10 வருட பழைய வினாத்தாள்களை பயிற்சி செய்யுங்கள். இலக்கண அமைப்புகள் மீண்டும் மீண்டும் வரும்.'
  },
  {
    title: '📝 Time Management (நேர மேலாண்மை)',
    desc: 'Allocate 20-25 minutes for English. Start with Reading Comprehension, then Error Spotting, then Grammar, finish with Vocabulary.',
    tamil: '2 மணி நேர தேர்வில் English-க்கு 20-25 நிமிடங்கள். முதலில் Reading Comprehension, பின் Error Spotting, Grammar, இறுதியாக Vocabulary.'
  },
  {
    title: '📚 Best Books & Resources (சிறந்த புத்தகங்கள்)',
    desc: '1. "Objective General English" by SP Bakshi\n2. "English for Competitive Exams" by Wren & Martin\n3. "Word Power Made Easy" by Norman Lewis\n4. Previous Year Papers (10 years)\n5. The Hindu Editorial (daily)',
    tamil: 'SP Bakshi புத்தகம் சிறந்தது. Wren & Martin இலக்கணத்திற்கு. தினமும் The Hindu Editorial படிக்கவும்.'
  }
];
