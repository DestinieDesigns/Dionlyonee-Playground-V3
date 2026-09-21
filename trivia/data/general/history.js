/**
 * Trivia Questions: History
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'hist_001',
      category: 'History',
      subcategory: 'Ancient History',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which ancient civilization built the Great Pyramids of Giza?',
      options: ['Ancient Romans', 'Ancient Greeks', 'Ancient Egyptians', 'Mayans'],
      answer: 'Ancient Egyptians',
      hint: 'Host Hint: Ruled by Pharaohs along the Nile River.'
    },
    {
      id: 'hist_002',
      category: 'History',
      subcategory: 'Modern History',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'In what year did the Titanic sink after colliding with an iceberg in the North Atlantic?',
      options: ['1905', '1912', '1918', '1923'],
      answer: '1912',
      hint: 'Host Hint: Just two years before World War I began in 1914.'
    },
    {
      id: 'hist_003',
      category: 'History',
      subcategory: 'Medieval History',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'The historic Magna Carta, establishing the principle that everyone is subject to the law, was signed in England in what year?',
      options: ['1066', '1215', '1492', '1688'],
      answer: '1215',
      hint: 'Host Hint: Signed at Runnymede by King John in the 13th century.'
    },
    {
      id: 'hist_004',
      category: 'History',
      subcategory: 'Imperial History',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Before being renamed Istanbul in 1930, what was the imperial capital of the Byzantine Empire called?',
      options: ['Constantinople', 'Alexandria', 'Antioch', 'Carthage'],
      answer: 'Constantinople',
      hint: 'Host Hint: Named after Emperor Constantine the Great.'
    },
    {
      id: 'hist_005',
      category: 'History',
      subcategory: 'Diplomatic History',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'The Anglo-Zanzibar War of August 27, 1896 is recorded in history as the shortest war. Approximately how long did it last?',
      options: ['38 to 45 minutes', '3 hours', '12 hours', '2 days'],
      answer: '38 to 45 minutes',
      hint: 'Host Hint: Ended in less than an hour when the Sultan\'s palace was bombarded by British ships.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
