/**
 * Trivia Questions: Percentages
 */
(function () {
  const questions = [
    {
      id: 'math_pct_001',
      category: 'Mathematics',
      subcategory: 'Percentages',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is 50% of 160?',
      options: ['60', '75', '80', '90'],
      answer: '80',
      hint: 'Host Hint: 50% is half.'
    },
    {
      id: 'math_pct_002',
      category: 'Mathematics',
      subcategory: 'Percentages',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is 15% of 80?',
      options: ['10', '12', '14', '16'],
      answer: '12',
      hint: 'Host Hint: 10% is 8, 5% is 4. 8 + 4 = 12.'
    },
    {
      id: 'math_pct_003',
      category: 'Mathematics',
      subcategory: 'Percentages',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'A jacket originally priced at $80 is on sale for 25% off. What is the sale price?',
      options: ['$55', '$60', '$65', '$70'],
      answer: '$60',
      hint: 'Host Hint: 25% of 80 is 20; 80 - 20 = 60.'
    },
    {
      id: 'math_pct_004',
      category: 'Mathematics',
      subcategory: 'Percentages',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'If an item increases by 20% and then decreases by 20%, what is the net change from the original price?',
      options: ['0% change', '2% decrease', '4% decrease', '4% increase'],
      answer: '4% decrease',
      hint: 'Host Hint: 1.20 * 0.80 = 0.96, which is a 4% drop.'
    },
    {
      id: 'math_pct_005',
      category: 'Mathematics',
      subcategory: 'Percentages',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What percentage of the first 100 positive integers (1 to 100) are prime numbers?',
      options: ['20%', '24%', '25%', '28%'],
      answer: '25%',
      hint: 'Host Hint: There are exactly 25 primes under 100.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
