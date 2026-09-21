/**
 * Trivia Questions: Weather & Meteorology
 */
(function () {
  const questions = [
    {
      id: 'sci_wea_001',
      category: 'Science',
      subcategory: 'Weather',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which instrument is used by meteorologists to measure atmospheric air pressure?',
      options: ['Thermometer', 'Barometer', 'Anemometer', 'Hygrometer'],
      answer: 'Barometer',
      hint: 'Host Hint: Invented by Evangelista Torricelli in 1643.'
    },
    {
      id: 'sci_wea_002',
      category: 'Science',
      subcategory: 'Weather',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What scale is used to classify tornado intensity based on structural damage and estimated wind speeds?',
      options: ['Saffir-Simpson Scale', 'Enhanced Fujita (EF) Scale', 'Beaufort Scale', 'Mercalli Scale'],
      answer: 'Enhanced Fujita (EF) Scale',
      hint: 'Host Hint: Ranges from EF0 to catastrophic EF5.'
    },
    {
      id: 'sci_wea_003',
      category: 'Science',
      subcategory: 'Weather',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is the apparent deflection of moving air and water caused by the Earth’s rotation called?',
      options: ['Bernoulli Effect', 'Coriolis Effect', 'Doppler Effect', 'Magnus Effect'],
      answer: 'Coriolis Effect',
      hint: 'Host Hint: Causes cyclones to spin counter-clockwise in the Northern Hemisphere.'
    },
    {
      id: 'sci_wea_004',
      category: 'Science',
      subcategory: 'Weather',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What rare luminous meteorological phenomenon involves violet-blue electrical discharge or plasma on ship masts during thunderstorms?',
      options: ['St. Elmo\'s Fire', 'Ball Lightning', 'Sprites', 'Sun Dogs'],
      answer: 'St. Elmo\'s Fire',
      hint: 'Host Hint: Named after the patron saint of sailors (Erasmus of Formia).'
    },
    {
      id: 'sci_wea_005',
      category: 'Science',
      subcategory: 'Weather',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In atmospheric thermodynamics, what is the temperature called to which a parcel of unsaturated air would cool if lifted dry-adiabatically until saturation, then brought along a moist adiabat back down to 1000 mb?',
      options: ['Equivalent potential temperature (Theta-e)', 'Virtual temperature', 'Dewpoint depression', 'Lifting condensation level'],
      answer: 'Equivalent potential temperature (Theta-e)',
      hint: 'Host Hint: Conserved during both dry and saturated adiabatic ascent.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
