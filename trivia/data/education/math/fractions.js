/**
 * Trivia Questions: Fractions
 */
(function () {
  const questions = [
    {
      id: 'math_frac_001',
      category: 'Mathematics',
      subcategory: 'Fractions',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is 1/2 plus 1/4 expressed in simplest fractional form?',
      options: ['2/6', '3/4', '5/8', '2/4'],
      answer: '3/4',
      hint: 'Host Hint: 2/4 + 1/4.'
    },
    {
      id: 'math_frac_002',
      category: 'Mathematics',
      subcategory: 'Fractions',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is 2/3 multiplied by 3/4 in lowest terms?',
      options: ['1/2', '5/7', '6/12', '8/9'],
      answer: '1/2',
      hint: 'Host Hint: 6/12 reduces to one half.'
    },
    {
      id: 'math_frac_003',
      category: 'Mathematics',
      subcategory: 'Fractions',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is 5/6 divided by 2/3 in lowest terms?',
      options: ['10/18', '5/4', '15/12', '1 1/4'],
      answer: '5/4',
      hint: 'Host Hint: 5/6 * 3/2 = 15/12 = 5/4.'
    },
    {
      id: 'math_frac_004',
      category: 'Mathematics',
      subcategory: 'Fractions',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which of the following fractions is strictly the largest: 7/9, 4/5, 11/15, or 3/4?',
      options: ['7/9', '4/5', '11/15', '3/4'],
      answer: '4/5',
      hint: 'Host Hint: 4/5 is 0.80; 7/9 is 0.777; 11/15 is 0.733; 3/4 is 0.75.'
    },
    {
      id: 'math_frac_005',
      category: 'Mathematics',
      subcategory: 'Fractions',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Evaluate the infinite geometric sum: 1/2 + 1/4 + 1/8 + 1/16 + ...',
      options: ['1/2', '1', '2', 'Infinity'],
      answer: '1',
      hint: 'Host Hint: S = a / (1 - r) where a = 1/2 and r = 1/2.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
