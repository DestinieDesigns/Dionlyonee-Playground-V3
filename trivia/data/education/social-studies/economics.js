/**
 * Trivia Questions: Social Studies - Economics
 */
(function () {
  const questions = [
    {
      id: 'ss_econ_001',
      category: 'Social Studies',
      subcategory: 'Economics',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'In basic market economics, prices are primarily determined by the interaction of supply and what?',
      options: ['Demand', 'Regulation', 'Taxes', 'Currency'],
      answer: 'Demand',
      hint: 'Host Hint: The fundamental law of supply and demand.'
    },
    {
      id: 'ss_econ_002',
      category: 'Social Studies',
      subcategory: 'Economics',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What economic term refers to a sustained general increase in price levels across an economy, reducing purchasing power?',
      options: ['Deflation', 'Inflation', 'Recession', 'Stagnation'],
      answer: 'Inflation',
      hint: 'Host Hint: Measured by the Consumer Price Index (CPI).'
    },
    {
      id: 'ss_econ_003',
      category: 'Social Studies',
      subcategory: 'Economics',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is the foundational economic principle defining the value of the next best alternative given up when making a choice?',
      options: ['Sunk Cost', 'Opportunity Cost', 'Marginal Cost', 'Fixed Cost'],
      answer: 'Opportunity Cost',
      hint: 'Host Hint: The lost benefit of the option not chosen.'
    },
    {
      id: 'ss_econ_004',
      category: 'Social Studies',
      subcategory: 'Economics',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which Scottish philosopher authored "The Wealth of Nations" in 1776, introducing the metaphor of the "invisible hand"?',
      options: ['Adam Smith', 'David Ricardo', 'John Maynard Keynes', 'Karl Marx'],
      answer: 'Adam Smith',
      hint: 'Host Hint: Often regarded as the father of modern free-market capitalism.'
    },
    {
      id: 'ss_econ_005',
      category: 'Social Studies',
      subcategory: 'Economics',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In macroeconomics, what paradox formulated by John Maynard Keynes asserts that if everyone attempts to increase their personal savings during a recession, aggregate demand will fall, resulting in lower total savings?',
      options: ['Paradox of Thrift', 'Leontief Paradox', 'Giffen Paradox', 'Diamond-Water Paradox'],
      answer: 'Paradox of Thrift',
      hint: 'Host Hint: Individual virtue (saving money) becoming a collective economic vice.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
