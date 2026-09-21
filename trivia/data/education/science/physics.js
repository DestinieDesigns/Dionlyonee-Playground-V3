/**
 * Trivia Questions: Physics
 */
(function () {
  const questions = [
    {
      id: 'sci_phy_001',
      category: 'Science',
      subcategory: 'Physics',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What fundamental force causes dropped objects to fall toward the surface of the Earth?',
      options: ['Electromagnetism', 'Gravity', 'Strong Nuclear', 'Centrifugal Force'],
      answer: 'Gravity',
      hint: 'Host Hint: Sir Isaac Newton formulated its universal law.'
    },
    {
      id: 'sci_phy_002',
      category: 'Science',
      subcategory: 'Physics',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the SI unit used to measure electrical resistance?',
      options: ['Volt', 'Ampere', 'Watt', 'Ohm'],
      answer: 'Ohm',
      hint: 'Host Hint: Named after Georg Ohm, symbolized by uppercase Greek Omega (Ω).'
    },
    {
      id: 'sci_phy_003',
      category: 'Science',
      subcategory: 'Physics',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Newton’s Third Law of Motion states that for every action, there is an equal and what?',
      options: ['Opposite reaction', 'Forward momentum', 'Unbalanced acceleration', 'Constant velocity'],
      answer: 'Opposite reaction',
      hint: 'Host Hint: Rocket propulsion pushes exhaust gas downward to move upward.'
    },
    {
      id: 'sci_phy_004',
      category: 'Science',
      subcategory: 'Physics',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which law of thermodynamics states that the total entropy of an isolated system can never decrease over time?',
      options: ['Zeroth Law', 'First Law', 'Second Law', 'Third Law'],
      answer: 'Second Law',
      hint: 'Host Hint: Defines the "arrow of time" and heat flowing naturally from hot to cold.'
    },
    {
      id: 'sci_phy_005',
      category: 'Science',
      subcategory: 'Physics',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In quantum electrodynamics, what gauge boson mediates the electromagnetic interaction between charged particles?',
      options: ['Gluon', 'W boson', 'Photon', 'Graviton'],
      answer: 'Photon',
      hint: 'Host Hint: The quantum packet of light itself.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
