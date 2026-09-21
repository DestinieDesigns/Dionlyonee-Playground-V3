/**
 * Trivia Questions: Vocabulary
 */
(function () {
  const questions = [
    {
      id: 'eng_voc_001',
      category: 'English & Literature',
      subcategory: 'Vocabulary',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the definition of the word "gigantic"?',
      options: ['Extremely small', 'Extremely huge', 'Very loud', 'Rapidly moving'],
      answer: 'Extremely huge',
      hint: 'Host Hint: Related to the word giant.'
    },
    {
      id: 'eng_voc_002',
      category: 'English & Literature',
      subcategory: 'Vocabulary',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What does it mean if someone is described as "gregarious"?',
      options: ['Sociable and enjoying company', 'Silent and brooding', 'Short-tempered', 'Extremely greedy'],
      answer: 'Sociable and enjoying company',
      hint: 'Host Hint: From Latin "grex" meaning flock; loves being around people.'
    },
    {
      id: 'eng_voc_003',
      category: 'English & Literature',
      subcategory: 'Vocabulary',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is the meaning of the word "ephemeral"?',
      options: ['Lasting forever', 'Lasting for a very short time', 'Difficult to understand', 'Deeply spiritual'],
      answer: 'Lasting for a very short time',
      hint: 'Host Hint: Fleeting, like morning mist or blooming mayflies.'
    },
    {
      id: 'eng_voc_004',
      category: 'English & Literature',
      subcategory: 'Vocabulary',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What does the word "perspicacious" describe about an individual?',
      options: ['Having keen insight and understanding', 'Sweating profusely', 'Excessively stubborn', 'Speaking with a heavy lisp'],
      answer: 'Having keen insight and understanding',
      hint: 'Host Hint: Sharp mental perception and clear discernment.'
    },
    {
      id: 'eng_voc_005',
      category: 'English & Literature',
      subcategory: 'Vocabulary',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What does the esoteric adjective "sesquipedalian" mean?',
      options: ['Characterized by using very long words', 'Walking on one leg', 'Six-sided in geometry', 'Ancient and mythological'],
      answer: 'Characterized by using very long words',
      hint: 'Host Hint: Literally means "a foot and a half long" in Latin (sesqui-pedalis).'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
