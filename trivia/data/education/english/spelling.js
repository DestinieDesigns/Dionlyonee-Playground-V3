/**
 * Trivia Questions: Spelling
 */
(function () {
  const questions = [
    {
      id: 'eng_spel_001',
      category: 'English & Literature',
      subcategory: 'Spelling',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which is the correct spelling of the day following Tuesday?',
      options: ['Wenesday', 'Wednesday', 'Wensday', 'Wedensday'],
      answer: 'Wednesday',
      hint: 'Host Hint: Named after Woden / Odin (Wed-nes-day).'
    },
    {
      id: 'eng_spel_002',
      category: 'English & Literature',
      subcategory: 'Spelling',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Select the correctly spelled word meaning to lodge or make room for:',
      options: ['Acommodate', 'Accommodate', 'Accomodate', 'Acomodate'],
      answer: 'Accommodate',
      hint: 'Host Hint: Double "c" and double "m".'
    },
    {
      id: 'eng_spel_003',
      category: 'English & Literature',
      subcategory: 'Spelling',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Choose the correct spelling of the word meaning a business owner taking financial risks:',
      options: ['Entrepeneur', 'Entrepreneur', 'Entreprenuer', 'Enterpreneur'],
      answer: 'Entrepreneur',
      hint: 'Host Hint: French origin: E-n-t-r-e-p-r-e-n-e-u-r.'
    },
    {
      id: 'eng_spel_004',
      category: 'English & Literature',
      subcategory: 'Spelling',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which of the following is the correct spelling for a state of deep embarrassment or humiliation?',
      options: ['Chagrin', 'Shagrin', 'Chagrine', 'Shagreen'],
      answer: 'Chagrin',
      hint: 'Host Hint: French loanword pronounced "shuh-GRIN".'
    },
    {
      id: 'eng_spel_005',
      category: 'English & Literature',
      subcategory: 'Spelling',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Which is the correct spelling for the musical instrument composed of tuned wooden bars struck by mallets?',
      options: ['Xylophone', 'Xilophone', 'Zylophone', 'Xylaphone'],
      answer: 'Xylophone',
      hint: 'Host Hint: Begins with Greek root "xylo-" meaning wood.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
