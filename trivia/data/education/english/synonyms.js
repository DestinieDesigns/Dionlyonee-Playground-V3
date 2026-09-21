/**
 * Trivia Questions: Synonyms
 */
(function () {
  const questions = [
    {
      id: 'eng_syn_001',
      category: 'English & Literature',
      subcategory: 'Synonyms',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which of the following is the closest synonym for the word "happy"?',
      options: ['Joyful', 'Gloomy', 'Weary', 'Furious'],
      answer: 'Joyful',
      hint: 'Host Hint: Full of joy.'
    },
    {
      id: 'eng_syn_002',
      category: 'English & Literature',
      subcategory: 'Synonyms',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the closest synonym for "candid"?',
      options: ['Deceptive', 'Frank and honest', 'Shy', 'Arrogant'],
      answer: 'Frank and honest',
      hint: 'Host Hint: Speaking openly without filter.'
    },
    {
      id: 'eng_syn_003',
      category: 'English & Literature',
      subcategory: 'Synonyms',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which word is the most accurate synonym for "ubiquitous"?',
      options: ['Omnipresent', 'Rare', 'Dangerous', 'Invisible'],
      answer: 'Omnipresent',
      hint: 'Host Hint: Found everywhere simultaneously.'
    },
    {
      id: 'eng_syn_004',
      category: 'English & Literature',
      subcategory: 'Synonyms',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is a precise synonym for the word "obsequious"?',
      options: ['Sycophantic', 'Defiant', 'Morose', 'Incorrigible'],
      answer: 'Sycophantic',
      hint: 'Host Hint: Excessively submissive and flattering; kissing up.'
    },
    {
      id: 'eng_syn_005',
      category: 'English & Literature',
      subcategory: 'Synonyms',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Which word serves as an exact synonym for "recondite"?',
      options: ['Abstruse', 'Lucid', 'Pugnacious', 'Mundane'],
      answer: 'Abstruse',
      hint: 'Host Hint: Little known or difficult to understand; obscure.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
