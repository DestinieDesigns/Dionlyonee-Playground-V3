/**
 * Trivia Questions: Social Studies - Cultures & Anthropology
 */
(function () {
  const questions = [
    {
      id: 'ss_cul_001',
      category: 'Social Studies',
      subcategory: 'Cultures',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which Mesoamerican civilization built the monumental step pyramid of El Castillo at Chichen Itza on the Yucatan Peninsula?',
      options: ['The Maya', 'The Inca', 'The Aztec', 'The Olmec'],
      answer: 'The Maya',
      hint: 'Host Hint: Renowned for their sophisticated calendar, mathematics, and hieroglyphic script.'
    },
    {
      id: 'ss_cul_002',
      category: 'Social Studies',
      subcategory: 'Cultures',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'The Aboriginal people are the indigenous inhabitants of which continent and country?',
      options: ['Australia', 'South America', 'Africa', 'Greenland'],
      answer: 'Australia',
      hint: 'Host Hint: Known for the concept of Dreamtime and playing the didgeridoo.'
    },
    {
      id: 'ss_cul_003',
      category: 'Social Studies',
      subcategory: 'Cultures',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What famous mountain citadel high in the Peruvian Andes was built by the Inca Empire under Emperor Pachacuti in the 15th century?',
      options: ['Machu Picchu', 'Tikal', 'Teotihuacan', 'Monte Alban'],
      answer: 'Machu Picchu',
      hint: 'Host Hint: Rediscovered internationally by Hiram Bingham in 1911.'
    },
    {
      id: 'ss_cul_004',
      category: 'Social Studies',
      subcategory: 'Cultures',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'The Code of Hammurabi, one of the earliest and most complete written legal codes in human history, was promulgated in which ancient kingdom?',
      options: ['Babylon', 'Assyria', 'Phoenicia', 'Persia'],
      answer: 'Babylon',
      hint: 'Host Hint: Inscribed on a black diorite stele, famous for the principle "an eye for an eye".'
    },
    {
      id: 'ss_cul_005',
      category: 'Social Studies',
      subcategory: 'Cultures',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'The ancient Harappan civilization, featuring advanced urban sanitation, grid planning, and standardized weights, flourished along which river basin in South Asia?',
      options: ['Indus River', 'Ganges River', 'Yellow River', 'Tigris River'],
      answer: 'Indus River',
      hint: 'Host Hint: Also known as the Indus Valley Civilization (Mohenjo-daro and Harappa).'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
