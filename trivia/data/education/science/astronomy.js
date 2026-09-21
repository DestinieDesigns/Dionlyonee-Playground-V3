/**
 * Trivia Questions: Astronomy
 */
(function () {
  const questions = [
    {
      id: 'sci_ast_001',
      category: 'Science',
      subcategory: 'Astronomy',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which planet in our solar system is known as the "Red Planet"?',
      options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
      answer: 'Mars',
      hint: 'Host Hint: Iron oxide (rust) on its surface gives it a reddish hue.'
    },
    {
      id: 'sci_ast_002',
      category: 'Science',
      subcategory: 'Astronomy',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the largest planet in our solar system, famous for its Great Red Spot?',
      options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
      answer: 'Jupiter',
      hint: 'Host Hint: Massive gas giant with dozens of moons including Ganymede.'
    },
    {
      id: 'sci_ast_003',
      category: 'Science',
      subcategory: 'Astronomy',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What boundary around a black hole marks the point of no return, where even light cannot escape?',
      options: ['Accretion Disk', 'Event Horizon', 'Photon Sphere', 'Singularity'],
      answer: 'Event Horizon',
      hint: 'Host Hint: Coined by physicist Wolfgang Rindler.'
    },
    {
      id: 'sci_ast_004',
      category: 'Science',
      subcategory: 'Astronomy',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'The Chandrasekhar limit determines the maximum mass of a stable white dwarf star before collapsing. What is this value in solar masses?',
      options: ['1.4 Solar Masses', '2.5 Solar Masses', '3.0 Solar Masses', '5.0 Solar Masses'],
      answer: '1.4 Solar Masses',
      hint: 'Host Hint: Approximately 1.44 times the mass of the Sun, calculated by Subrahmanyan Chandrasekhar.'
    },
    {
      id: 'sci_ast_005',
      category: 'Science',
      subcategory: 'Astronomy',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the name of the cosmological temperature boundary where cosmic microwave background photons decoupled from baryonic matter approximately 380,000 years after the Big Bang?',
      options: ['Epoch of Recombination / Surface of Last Scattering', 'Baryon Asymmetry Era', 'Electroweak Epoch', 'Planck Epoch'],
      answer: 'Epoch of Recombination / Surface of Last Scattering',
      hint: 'Host Hint: When neutral hydrogen formed and the universe became transparent to radiation.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
