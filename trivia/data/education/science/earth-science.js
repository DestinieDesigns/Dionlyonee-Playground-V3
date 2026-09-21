/**
 * Trivia Questions: Earth Science
 */
(function () {
  const questions = [
    {
      id: 'sci_earth_001',
      category: 'Science',
      subcategory: 'Earth Science',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the innermost, intensely hot layer of Earth called?',
      options: ['Crust', 'Mantle', 'Core', 'Lithosphere'],
      answer: 'Core',
      hint: 'Host Hint: Separated into a liquid outer layer and solid inner iron-nickel sphere.'
    },
    {
      id: 'sci_earth_002',
      category: 'Science',
      subcategory: 'Earth Science',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What scale is used to measure the hardness of minerals, from talc at 1 to diamond at 10?',
      options: ['Richter scale', 'Mohs scale', 'Kelvin scale', 'Beaufort scale'],
      answer: 'Mohs scale',
      hint: 'Host Hint: Devised by German geologist Friedrich Mohs.'
    },
    {
      id: 'sci_earth_003',
      category: 'Science',
      subcategory: 'Earth Science',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which boundary layer separates the Earth\'s crust from the underlying mantle?',
      options: ['Gutenberg discontinuity', 'Mohorovicic discontinuity (Moho)', 'Lehmann discontinuity', 'Conrad discontinuity'],
      answer: 'Mohorovicic discontinuity (Moho)',
      hint: 'Host Hint: Commonly shortened to the "Moho".'
    },
    {
      id: 'sci_earth_004',
      category: 'Science',
      subcategory: 'Earth Science',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What supercontinent formed roughly 335 million years ago and broke apart during the Mesozoic era?',
      options: ['Rodinia', 'Pangea', 'Gondwana', 'Laurasia'],
      answer: 'Pangea',
      hint: 'Host Hint: Greek for "all lands".'
    },
    {
      id: 'sci_earth_005',
      category: 'Science',
      subcategory: 'Earth Science',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What rare high-pressure polymorph of silica formed during hypervelocity meteorite impacts was named after Eugene Shoemaker?',
      options: ['Coesite', 'Stishovite', 'Tridymite', 'Cristobalite'],
      answer: 'Coesite',
      hint: 'Host Hint: First synthesized by Loring Coes Jr. and found in Meteor Crater by Shoemaker.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
