/**
 * Trivia Questions: Social Studies - Government
 */
(function () {
  const questions = [
    {
      id: 'ss_gov_001',
      category: 'Social Studies',
      subcategory: 'Government',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'How many branches of government exist under the United States Constitution (Executive, Legislative, Judicial)?',
      options: ['2', '3', '4', '5'],
      answer: '3',
      hint: 'Host Hint: Separation of powers into three distinct branches.'
    },
    {
      id: 'ss_gov_002',
      category: 'Social Studies',
      subcategory: 'Government',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What form of government is characterized by a hereditary monarch whose powers are limited by a written constitution and parliament (e.g., the United Kingdom)?',
      options: ['Absolute Monarchy', 'Constitutional Monarchy', 'Theocracy', 'Oligarchy'],
      answer: 'Constitutional Monarchy',
      hint: 'Host Hint: The monarch reigns as head of state, but elected leaders govern.'
    },
    {
      id: 'ss_gov_003',
      category: 'Social Studies',
      subcategory: 'Government',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which constitutional concept prevents any single branch of government from becoming too powerful by allowing each branch to limit the other two?',
      options: ['Checks and Balances', 'Federal Preemption', 'Judicial Discretion', 'Executive Privilege'],
      answer: 'Checks and Balances',
      hint: 'Host Hint: Montesquieu\'s doctrine in The Spirit of the Laws.'
    },
    {
      id: 'ss_gov_004',
      category: 'Social Studies',
      subcategory: 'Government',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'In parliamentary systems like Jamaica, Canada, and the UK, what is the formal vote called whereby members of parliament declare that they no longer support the incumbent government?',
      options: ['Vote of No Confidence', 'Impeachment Trial', 'Cloture Motion', 'Filibuster Override'],
      answer: 'Vote of No Confidence',
      hint: 'Host Hint: If passed, typically triggers general elections or the government’s resignation.'
    },
    {
      id: 'ss_gov_005',
      category: 'Social Studies',
      subcategory: 'Government',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In constitutional law, what is the Latin legal term for an order issued by a superior court commanding a lower court, official, or tribunal to perform a public duty they are legally required to execute?',
      options: ['Writ of Mandamus', 'Writ of Habeas Corpus', 'Certiorari', 'Quo Warranto'],
      answer: 'Writ of Mandamus',
      hint: 'Host Hint: Latin for "we command" (central to Marbury v. Madison in 1803).'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
