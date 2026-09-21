/**
 * Trivia Questions: Geography
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'geo_001',
      category: 'World Geography',
      subcategory: 'Landmarks',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the capital city of France?',
      options: ['Rome', 'Berlin', 'Paris', 'Madrid'],
      answer: 'Paris',
      hint: 'Host Hint: City of Light home to the Eiffel Tower.'
    },
    {
      id: 'geo_002',
      category: 'World Geography',
      subcategory: 'Waterways',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Which river is traditionally recognized as the longest in Africa and one of the longest in the world?',
      options: ['Amazon', 'Nile', 'Congo', 'Niger'],
      answer: 'Nile',
      hint: 'Host Hint: Flows north through Egypt into the Mediterranean Sea.'
    },
    {
      id: 'geo_003',
      category: 'World Geography',
      subcategory: 'Territories',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which country spans the most consecutive time zones within its borders, counting eleven time zones?',
      options: ['China', 'Canada', 'Russia', 'United States'],
      answer: 'Russia',
      hint: 'Host Hint: The world\'s largest country by land area, from Kaliningrad to Kamchatka.'
    },
    {
      id: 'geo_004',
      category: 'World Geography',
      subcategory: 'Islands',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is the world’s largest island that is not classified as its own continent?',
      options: ['Madagascar', 'Greenland', 'Borneo', 'New Guinea'],
      answer: 'Greenland',
      hint: 'Host Hint: Autonomous territory belonging to the Kingdom of Denmark.'
    },
    {
      id: 'geo_005',
      category: 'World Geography',
      subcategory: 'Geopolitical Enclaves',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Only three nations in the world are completely surrounded by a single other country. Two are Vatican City and San Marino (surrounded by Italy). What is the third?',
      options: ['Swaziland', 'Lesotho', 'Andorra', 'Liechtenstein'],
      answer: 'Lesotho',
      hint: 'Host Hint: An enclaved kingdom entirely landlocked within South Africa.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
