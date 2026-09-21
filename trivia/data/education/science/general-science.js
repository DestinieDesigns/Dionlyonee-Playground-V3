/**
 * Trivia Questions: General Science
 */
(function () {
  const questions = [
    {
      id: 'sci_gen_001',
      category: 'Science',
      subcategory: 'General Science',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the chemical symbol for water?',
      options: ['O2', 'H2O', 'CO2', 'NaCl'],
      answer: 'H2O',
      hint: 'Host Hint: Two hydrogen atoms bonded to one oxygen atom.'
    },
    {
      id: 'sci_gen_002',
      category: 'Science',
      subcategory: 'General Science',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Which organelle is universally known as the powerhouse of the eukaryotic cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
      answer: 'Mitochondria',
      hint: 'Host Hint: Responsible for cellular respiration and ATP synthesis.'
    },
    {
      id: 'sci_gen_003',
      category: 'Science',
      subcategory: 'General Science',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is the approximate speed of light in a vacuum?',
      options: ['30,000 km/s', '150,000 km/s', '300,000 km/s', '1,000,000 km/s'],
      answer: '300,000 km/s',
      hint: 'Host Hint: Precisely 299,792,458 meters per second.'
    },
    {
      id: 'sci_gen_004',
      category: 'Science',
      subcategory: 'General Science',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What fundamental constant relates the energy of a photon to its frequency (E = h * nu)?',
      options: ['Boltzmann constant', 'Planck constant', 'Avogadro constant', 'Faraday constant'],
      answer: 'Planck constant',
      hint: 'Host Hint: Discovered by Max Planck in 1900, roughly 6.626 x 10^-34 J*s.'
    },
    {
      id: 'sci_gen_005',
      category: 'Science',
      subcategory: 'General Science',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In quantum mechanics, what theorem states that quantum entanglement cannot be used to transmit classical information faster than light?',
      options: ['No-communication theorem', 'Bell\'s inequality', 'CPT symmetry theorem', 'Goldstone theorem'],
      answer: 'No-communication theorem',
      hint: 'Host Hint: Prevents quantum measurements on one particle from sending instantaneous Morse code to another.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
