/**
 * Trivia Questions: Word Problems
 */
(function () {
  const questions = [
    {
      id: 'math_wp_001',
      category: 'Mathematics',
      subcategory: 'Word Problems',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'A baker bakes 4 trays of cookies, each holding 12 cookies. How many cookies were baked in total?',
      options: ['36', '44', '48', '52'],
      answer: '48',
      hint: 'Host Hint: 4 * 12 = 48.'
    },
    {
      id: 'math_wp_002',
      category: 'Mathematics',
      subcategory: 'Word Problems',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'A train travels at a constant speed of 60 miles per hour. How many miles does it travel in 2 hours and 30 minutes?',
      options: ['120 miles', '140 miles', '150 miles', '160 miles'],
      answer: '150 miles',
      hint: 'Host Hint: 60 * 2.5 = 150 miles.'
    },
    {
      id: 'math_wp_003',
      category: 'Mathematics',
      subcategory: 'Word Problems',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Maya is twice as old as her brother Leo. In 5 years, the sum of their ages will be 40. How old is Maya right now?',
      options: ['10', '15', '20', '25'],
      answer: '20',
      hint: 'Host Hint: M = 2L; (M+5)+(L+5) = 40 => 3L + 10 = 40 => L = 10, Maya = 20.'
    },
    {
      id: 'math_wp_004',
      category: 'Mathematics',
      subcategory: 'Word Problems',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Pipe A can fill a swimming pool in 4 hours, while Pipe B can fill the same pool in 6 hours. Working together, how long will they take to fill the pool?',
      options: ['2 hours', '2.4 hours (2 hrs 24 min)', '3 hours', '3.2 hours'],
      answer: '2.4 hours (2 hrs 24 min)',
      hint: 'Host Hint: 1/4 + 1/6 = 5/12 per hour; 12/5 = 2.4 hours.'
    },
    {
      id: 'math_wp_005',
      category: 'Mathematics',
      subcategory: 'Word Problems',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Two cars start 300 miles apart and drive towards each other. Car A drives at 40 mph and Car B drives at 60 mph. A fly on Car A starts flying back and forth between the two cars at 80 mph until they meet. What total distance does the fly cover?',
      options: ['200 miles', '240 miles', '300 miles', '320 miles'],
      answer: '240 miles',
      hint: 'Host Hint: Relative speed is 100 mph, so cars meet in 3 hours. 80 mph * 3 hours = 240 miles.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
