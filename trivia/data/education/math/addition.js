/**
 * Trivia Questions: Addition
 */
(function () {
  const questions = [
    {
      id: 'math_add_001',
      category: 'Mathematics',
      subcategory: 'Addition',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is 84 + 37?',
      options: ['111', '121', '125', '131'],
      answer: '121',
      hint: 'Host Hint: 80 + 30 = 110; 4 + 7 = 11.'
    },
    {
      id: 'math_add_002',
      category: 'Mathematics',
      subcategory: 'Addition',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the sum of all whole numbers from 1 through 10 (1 + 2 + ... + 10)?',
      options: ['45', '50', '55', '60'],
      answer: '55',
      hint: 'Host Hint: Use Gauss formula: n(n+1)/2 = 10*11/2.'
    },
    {
      id: 'math_add_003',
      category: 'Mathematics',
      subcategory: 'Addition',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is 468 + 789?',
      options: ['1247', '1257', '1267', '1277'],
      answer: '1257',
      hint: 'Host Hint: 400 + 700 = 1100; 68 + 89 = 157.'
    },
    {
      id: 'math_add_004',
      category: 'Mathematics',
      subcategory: 'Addition',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is the sum of the first 20 consecutive positive odd integers (1 + 3 + 5 + ... + 39)?',
      options: ['200', '380', '400', '420'],
      answer: '400',
      hint: 'Host Hint: The sum of the first n odd numbers is always n squared (20^2).'
    },
    {
      id: 'math_add_005',
      category: 'Mathematics',
      subcategory: 'Addition',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the sum of all integers from 1 to 1000 inclusive?',
      options: ['499,500', '500,500', '501,500', '550,000'],
      answer: '500,500',
      hint: 'Host Hint: (1000 * 1001) / 2 = 500 * 1001.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
