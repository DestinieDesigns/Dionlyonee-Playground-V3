/**
 * Trivia Questions: Social Studies - Geography
 */
(function () {
  const questions = [
    {
      id: 'ss_geo_001',
      category: 'Social Studies',
      subcategory: 'Geography',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the imaginary line of latitude dividing the Earth into the Northern and Southern Hemispheres at 0 degrees?',
      options: ['Prime Meridian', 'Equator', 'Tropic of Cancer', 'Arctic Circle'],
      answer: 'Equator',
      hint: 'Host Hint: Sits right in the center of the globe at 0 degrees latitude.'
    },
    {
      id: 'ss_geo_002',
      category: 'Social Studies',
      subcategory: 'Geography',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Which mountain range contains Mount Everest, the highest peak above sea level on Earth?',
      options: ['The Andes', 'The Alps', 'The Himalayas', 'The Rockies'],
      answer: 'The Himalayas',
      hint: 'Host Hint: Located in South Asia separating the Indian subcontinent from the Tibetan Plateau.'
    },
    {
      id: 'ss_geo_003',
      category: 'Social Studies',
      subcategory: 'Geography',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Through which London borough does the Prime Meridian (0 degrees longitude) officially pass?',
      options: ['Westminster', 'Greenwich', 'Kensington', 'Camden'],
      answer: 'Greenwich',
      hint: 'Host Hint: Home of the Royal Observatory and Greenwich Mean Time (GMT).'
    },
    {
      id: 'ss_geo_004',
      category: 'Social Studies',
      subcategory: 'Geography',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What narrow strait separates the Iberian Peninsula of Europe from Morocco in Africa, connecting the Atlantic Ocean to the Mediterranean Sea?',
      options: ['Strait of Hormuz', 'Strait of Malacca', 'Strait of Gibraltar', 'Bosphorus Strait'],
      answer: 'Strait of Gibraltar',
      hint: 'Host Hint: Overlooked by the famous Rock of Gibraltar.'
    },
    {
      id: 'ss_geo_005',
      category: 'Social Studies',
      subcategory: 'Geography',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the name of the geopolitical tripoint in South America where the borders of Argentina, Brazil, and Paraguay converge at the junction of the Iguazu and Paraná rivers?',
      options: ['Triple Frontera (Triple Frontier)', 'Llanos Orientales', 'Punta Arenas', 'Gran Chaco'],
      answer: 'Triple Frontera (Triple Frontier)',
      hint: 'Host Hint: Spanish/Portuguese for "Triple Frontier".'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
