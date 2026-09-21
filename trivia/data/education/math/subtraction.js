/**
 * Trivia Questions: Subtraction
 */
(function () {
  const questions = [
    {
      id: 'math_sub_001',
      category: 'Mathematics',
      subcategory: 'Subtraction',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is 100 minus 37?',
      options: ['53', '63', '67', '73'],
      answer: '63',
      hint: 'Host Hint: 100 - 30 = 70; 70 - 7 = 63.'
    },
    {
      id: 'math_sub_002',
      category: 'Mathematics',
      subcategory: 'Subtraction',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is 542 minus 189?',
      options: ['343', '353', '363', '373'],
      answer: '353',
      hint: 'Host Hint: 542 - 200 + 11.'
    },
    {
      id: 'math_sub_003',
      category: 'Mathematics',
      subcategory: 'Subtraction',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is 10,000 minus 4,321?',
      options: ['5,669', '5,679', '5,789', '6,679'],
      answer: '5,679',
      hint: 'Host Hint: 9999 - 4321 = 5678, plus 1 = 5679.'
    },
    {
      id: 'math_sub_004',
      category: 'Mathematics',
      subcategory: 'Subtraction',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'If you subtract the sum of the first five prime numbers (2, 3, 5, 7, 11) from 50, what do you get?',
      options: ['20', '22', '24', '28'],
      answer: '22',
      hint: 'Host Hint: 2+3+5+7+11 = 28; 50 - 28 = 22.'
    },
    {
      id: 'math_sub_005',
      category: 'Mathematics',
      subcategory: 'Subtraction',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Evaluate: 100^2 - 99^2 without direct calculation of the large squares.',
      options: ['101', '199', '201', '299'],
      answer: '199',
      hint: 'Host Hint: Difference of squares: (a - b)(a + b) = 1 * (100 + 99).'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
