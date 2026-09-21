/**
 * Trivia Questions: Reading Comprehension & Literary Devices
 */
(function () {
  const questions = [
    {
      id: 'eng_rc_001',
      category: 'English & Literature',
      subcategory: 'Literary Devices',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'In literature, what is a comparison between two unlike things using "like" or "as" called?',
      options: ['Metaphor', 'Simile', 'Hyperbole', 'Alliteration'],
      answer: 'Simile',
      hint: 'Host Hint: "As brave as a lion" or "quiet like a mouse".'
    },
    {
      id: 'eng_rc_002',
      category: 'English & Literature',
      subcategory: 'Reading Comprehension',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the literary term for the sequence of events that make up a story from beginning to resolution?',
      options: ['Theme', 'Setting', 'Plot', 'Tone'],
      answer: 'Plot',
      hint: 'Host Hint: Includes exposition, rising action, climax, and falling action.'
    },
    {
      id: 'eng_rc_003',
      category: 'English & Literature',
      subcategory: 'Reading Comprehension',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'When an author gives hints or clues early in a story about events that will happen later, what technique are they using?',
      options: ['Flashback', 'Foreshadowing', 'Satire', 'Allegory'],
      answer: 'Foreshadowing',
      hint: 'Host Hint: Casting a shadow forward into the narrative.'
    },
    {
      id: 'eng_rc_004',
      category: 'English & Literature',
      subcategory: 'Literary Analysis',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'In Greek tragedy, what is the term for the emotional cleansing or purging of pity and fear experienced by the audience at the climax?',
      options: ['Catharsis', 'Hamartia', 'Hubris', 'Anagnorisis'],
      answer: 'Catharsis',
      hint: 'Host Hint: Coined by Aristotle in Poetics; feeling washed clean emotionally.'
    },
    {
      id: 'eng_rc_005',
      category: 'English & Literature',
      subcategory: 'Literary Analysis',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In Aristotle’s Poetics, what is the specific term for the protagonist\'s moment of critical discovery or recognition of truth in a drama?',
      options: ['Peripeteia', 'Anagnorisis', 'Nemesis', 'Catastrophe'],
      answer: 'Anagnorisis',
      hint: 'Host Hint: Contrasted with Peripeteia (sudden reversal of fortune).'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
