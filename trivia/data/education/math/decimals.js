/**
 * Trivia Questions: Decimals
 */
(function () {
  const questions = [
    {
      id: 'math_dec_001',
      category: 'Mathematics',
      subcategory: 'Decimals',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is 0.75 written as a fraction in simplest terms?',
      options: ['1/2', '3/4', '7/10', '4/5'],
      answer: '3/4',
      hint: 'Host Hint: 75 cents out of a dollar.'
    },
    {
      id: 'math_dec_002',
      category: 'Mathematics',
      subcategory: 'Decimals',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is 3.4 multiplied by 0.2?',
      options: ['0.068', '0.68', '6.8', '68'],
      answer: '0.68',
      hint: 'Host Hint: 34 * 2 = 68, with two decimal places.'
    },
    {
      id: 'math_dec_003',
      category: 'Mathematics',
      subcategory: 'Decimals',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is 1 divided by 8 expressed as a decimal?',
      options: ['0.12', '0.125', '0.15', '0.185'],
      answer: '0.125',
      hint: 'Host Hint: Half of a quarter (0.25 / 2).'
    },
    {
      id: 'math_dec_004',
      category: 'Mathematics',
      subcategory: 'Decimals',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is the repeating decimal 0.777... expressed as an exact fraction?',
      options: ['7/10', '7/9', '77/100', '3/4'],
      answer: '7/9',
      hint: 'Host Hint: Any single repeating digit 0.d... equals d/9.'
    },
    {
      id: 'math_dec_005',
      category: 'Mathematics',
      subcategory: 'Decimals',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Convert the mixed repeating decimal 0.1666... to its simplest exact fraction.',
      options: ['1/6', '5/32', '16/99', '1/7'],
      answer: '1/6',
      hint: 'Host Hint: 1/6 = 0.1666... (10x - x method: 1.5/9 = 3/18 = 1/6).'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
