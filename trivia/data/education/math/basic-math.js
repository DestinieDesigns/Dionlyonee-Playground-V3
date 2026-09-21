/**
 * Trivia Questions: Basic Math
 */
(function () {
  const questions = [
    {
      id: 'math_bm_001',
      category: 'Mathematics',
      subcategory: 'Basic Math',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the value of 15 plus 27?',
      options: ['38', '40', '42', '44'],
      answer: '42',
      hint: 'Host Hint: 15 + 20 = 35; 35 + 7 = 42.'
    },
    {
      id: 'math_bm_002',
      category: 'Mathematics',
      subcategory: 'Basic Math',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the only even prime number?',
      options: ['0', '2', '4', '6'],
      answer: '2',
      hint: 'Host Hint: The smallest prime number.'
    },
    {
      id: 'math_bm_003',
      category: 'Mathematics',
      subcategory: 'Basic Math',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is the sum of the interior angles of any triangle?',
      options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
      answer: '180 degrees',
      hint: 'Host Hint: A straight line angle.'
    },
    {
      id: 'math_bm_004',
      category: 'Mathematics',
      subcategory: 'Basic Math',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'A number that is equal to the sum of its proper positive divisors is called a perfect number. What is the smallest perfect number?',
      options: ['4', '6', '12', '28'],
      answer: '6',
      hint: 'Host Hint: 1 + 2 + 3 = 6.'
    },
    {
      id: 'math_bm_005',
      category: 'Mathematics',
      subcategory: 'Basic Math',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the mathematical term for a whole number that cannot be represented as the difference of two square integers?',
      options: ['Singly even numbers (form 4k + 2)', 'Mersenne numbers', 'Fibonacci numbers', 'Triangular numbers'],
      answer: 'Singly even numbers (form 4k + 2)',
      hint: 'Host Hint: Numbers congruent to 2 modulo 4 (e.g., 2, 6, 10, 14).'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
