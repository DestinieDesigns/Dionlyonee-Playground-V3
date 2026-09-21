/**
 * Trivia Questions: PEMDAS / Order of Operations
 */
(function () {
  const questions = [
    {
      id: 'math_pem_001',
      category: 'Mathematics',
      subcategory: 'PEMDAS',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the value of: 3 + 4 * 2?',
      options: ['11', '14', '18', '24'],
      answer: '11',
      hint: 'Host Hint: Multiplication comes before addition: 4 * 2 = 8, then 3 + 8.'
    },
    {
      id: 'math_pem_002',
      category: 'Mathematics',
      subcategory: 'PEMDAS',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the value of: (12 - 4) / 2 + 3^2?',
      options: ['11', '13', '15', '17'],
      answer: '13',
      hint: 'Host Hint: Parentheses first: 8/2 = 4. Then exponent: 3^2 = 9. 4 + 9 = 13.'
    },
    {
      id: 'math_pem_003',
      category: 'Mathematics',
      subcategory: 'PEMDAS',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Evaluate: 60 / 5 * (7 - 5)?',
      options: ['6', '12', '24', '30'],
      answer: '24',
      hint: 'Host Hint: Parentheses: (7-5)=2. Division & multiplication go left to right: 60/5=12, 12*2=24.'
    },
    {
      id: 'math_pem_004',
      category: 'Mathematics',
      subcategory: 'PEMDAS',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is the value of: 8 + 2 * [15 - (3^2 + 1)] / 5?',
      options: ['9', '10', '11', '12'],
      answer: '10',
      hint: 'Host Hint: Inside brackets: 3^2+1=10; 15-10=5; 5/5=1; 2*1=2; 8+2=10.'
    },
    {
      id: 'math_pem_005',
      category: 'Mathematics',
      subcategory: 'PEMDAS',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Evaluate: 2^[3^(2)] vs (2^3)^2. What is 2^(3^2) minus (2^3)^2?',
      options: ['448', '512', '448', '0'],
      answer: '448',
      hint: 'Host Hint: 2^(9) = 512, and (8)^2 = 64. 512 - 64 = 448.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
