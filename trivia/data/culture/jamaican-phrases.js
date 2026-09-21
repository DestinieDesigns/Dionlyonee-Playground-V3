/**
 * Trivia Questions: Jamaican Phrases & Patois
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'jam_p_001',
      category: 'Jamaican Phrases & Patois',
      subcategory: 'Patois Slang',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'In Jamaican Patois, what does the ubiquitous greeting "Wah Gwaan?" mean in English?',
      options: ['Where are you going?', 'What\'s going on / What\'s up?', 'Who is that?', 'Why are you leaving?'],
      answer: 'What\'s going on / What\'s up?',
      hint: 'Host Hint: The standard island check-in with any friend or passerby.'
    },
    {
      id: 'jam_p_002',
      category: 'Jamaican Phrases & Patois',
      subcategory: 'Everyday Patois',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'If a Jamaican says "Mi deh yah, cool and deadly", what are they expressing about how they are doing?',
      options: ['I am furious and dangerous', 'I am here, doing great and relaxed', 'I am sick and dying', 'I am lost in the woods'],
      answer: 'I am here, doing great and relaxed',
      hint: 'Host Hint: "Mi deh yah" means "I am right here, smooth and steady".'
    },
    {
      id: 'jam_p_003',
      category: 'Jamaican Phrases & Patois',
      subcategory: 'Proverbs',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Complete the famous Jamaican proverb: "Every mickle mek a ______", meaning small amounts add up to a big total over time.',
      options: ['Bickle', 'Muckle', 'Shilling', 'Dollar'],
      answer: 'Muckle',
      hint: 'Host Hint: An old Scots-derived phrase preserved in Jamaican wisdom rhyming with mickle.'
    },
    {
      id: 'jam_p_004',
      category: 'Jamaican Phrases & Patois',
      subcategory: 'Folklore Expressions',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What does the Jamaican expression "Play fool fi catch wise" mean in life strategy?',
      options: ['Act reckless to get attention', 'Feign ignorance or humility to gain an advantage', 'Play pranks on smart people', 'Never study for a test'],
      answer: 'Feign ignorance or humility to gain an advantage',
      hint: 'Host Hint: Letting others underestimate you while you observe and learn their cards.'
    },
    {
      id: 'jam_p_005',
      category: 'Jamaican Phrases & Patois',
      subcategory: 'Linguistic Roots',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In Jamaican Patois, the word "Nyam" (meaning to eat voraciously or feast) directly traces its etymological roots to which African language group?',
      options: ['Wolof / Fula (Nyami)', 'Swahili', 'Zulu', 'Yoruba'],
      answer: 'Wolof / Fula (Nyami)',
      hint: 'Host Hint: West African linguistic root found in Wolof, Fula, and Mandinka meaning "to chew or eat".'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
