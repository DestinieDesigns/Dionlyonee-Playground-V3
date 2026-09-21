/**
 * Trivia Questions: Algebra
 */
(function () {
  const questions = [
    {
      id: 'math_alg_001',
      category: 'Mathematics',
      subcategory: 'Algebra',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Solve for x: 2x + 5 = 15.',
      options: ['3', '5', '7', '10'],
      answer: '5',
      hint: 'Host Hint: 2x = 10, so x = 5.'
    },
    {
      id: 'math_alg_002',
      category: 'Mathematics',
      subcategory: 'Algebra',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What are the two roots of the quadratic equation: x^2 - 9 = 0?',
      options: ['0 and 9', '3 and -3', '9 and -9', '1 and 9'],
      answer: '3 and -3',
      hint: 'Host Hint: Difference of squares: (x-3)(x+3) = 0.'
    },
    {
      id: 'math_alg_003',
      category: 'Mathematics',
      subcategory: 'Algebra',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'If 3x - 2y = 7 and y = 4, what is the value of x?',
      options: ['3', '4', '5', '6'],
      answer: '5',
      hint: 'Host Hint: 3x - 8 = 7 => 3x = 15 => x = 5.'
    },
    {
      id: 'math_alg_004',
      category: 'Mathematics',
      subcategory: 'Algebra',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'In the quadratic formula, what is the discriminant expression b^2 - 4ac called, and what does it indicate if it is negative?',
      options: ['No real roots (complex roots)', 'Two identical rational roots', 'Two distinct positive integer roots', 'Infinite solutions'],
      answer: 'No real roots (complex roots)',
      hint: 'Host Hint: Square root of a negative number produces imaginary unit i.'
    },
    {
      id: 'math_alg_005',
      category: 'Mathematics',
      subcategory: 'Algebra',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'If x + 1/x = 4, what is the value of x^2 + 1/(x^2)?',
      options: ['14', '16', '18', '20'],
      answer: '14',
      hint: 'Host Hint: Square both sides: (x + 1/x)^2 = x^2 + 2 + 1/x^2 = 16 => x^2 + 1/x^2 = 14.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
