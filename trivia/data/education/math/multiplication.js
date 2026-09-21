/**
 * Trivia Questions: Multiplication
 */
(function () {
  const questions = [
    {
      id: 'math_mul_001',
      category: 'Mathematics',
      subcategory: 'Multiplication',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is 8 multiplied by 7?',
      options: ['48', '54', '56', '64'],
      answer: '56',
      hint: 'Host Hint: 8 times 5 is 40, plus 16.'
    },
    {
      id: 'math_mul_002',
      category: 'Mathematics',
      subcategory: 'Multiplication',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is 12 multiplied by 15?',
      options: ['150', '160', '175', '180'],
      answer: '180',
      hint: 'Host Hint: 12 * 10 = 120; 12 * 5 = 60.'
    },
    {
      id: 'math_mul_003',
      category: 'Mathematics',
      subcategory: 'Multiplication',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is 25 multiplied by 44?',
      options: ['1,050', '1,100', '1,150', '1,200'],
      answer: '1,100',
      hint: 'Host Hint: Divide 44 by 4 and multiply by 100.'
    },
    {
      id: 'math_mul_004',
      category: 'Mathematics',
      subcategory: 'Multiplication',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is 2 raised to the 10th power (2^10)?',
      options: ['512', '1,000', '1,024', '2,048'],
      answer: '1,024',
      hint: 'Host Hint: Number of bytes in a traditional kibibyte.'
    },
    {
      id: 'math_mul_005',
      category: 'Mathematics',
      subcategory: 'Multiplication',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the product of 101 multiplied by 101?',
      options: ['10,101', '10,201', '10,301', '11,001'],
      answer: '10,201',
      hint: 'Host Hint: (100 + 1)^2 = 10000 + 200 + 1.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
