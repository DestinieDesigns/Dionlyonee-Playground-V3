/**
 * Trivia Questions: Division
 */
(function () {
  const questions = [
    {
      id: 'math_div_001',
      category: 'Mathematics',
      subcategory: 'Division',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is 72 divided by 9?',
      options: ['6', '7', '8', '9'],
      answer: '8',
      hint: 'Host Hint: 8 * 9 = 72.'
    },
    {
      id: 'math_div_002',
      category: 'Mathematics',
      subcategory: 'Division',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is 225 divided by 15?',
      options: ['13', '14', '15', '16'],
      answer: '15',
      hint: 'Host Hint: 15 squared equals 225.'
    },
    {
      id: 'math_div_003',
      category: 'Mathematics',
      subcategory: 'Division',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is 1,000 divided by 8?',
      options: ['115', '120', '125', '135'],
      answer: '125',
      hint: 'Host Hint: Half of a thousand is 500, half of 500 is 250, half of 250 is 125.'
    },
    {
      id: 'math_div_004',
      category: 'Mathematics',
      subcategory: 'Division',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is the remainder when 3,457 is divided by 9?',
      options: ['1', '2', '3', '4'],
      answer: '1',
      hint: 'Host Hint: Sum of digits: 3+4+5+7 = 19; 1+9 = 10; 10 mod 9 = 1.'
    },
    {
      id: 'math_div_005',
      category: 'Mathematics',
      subcategory: 'Division',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the greatest common divisor (GCD) of 348 and 156?',
      options: ['6', '12', '18', '24'],
      answer: '12',
      hint: 'Host Hint: 348 = 12 * 29; 156 = 12 * 13.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
