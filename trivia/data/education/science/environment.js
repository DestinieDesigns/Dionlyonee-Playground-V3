/**
 * Trivia Questions: Environment & Ecology
 */
(function () {
  const questions = [
    {
      id: 'sci_env_001',
      category: 'Science',
      subcategory: 'Environment',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which gas makes up approximately 78% of Earth\'s atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
      answer: 'Nitrogen',
      hint: 'Host Hint: Chemical formula N2.'
    },
    {
      id: 'sci_env_002',
      category: 'Science',
      subcategory: 'Environment',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Which layer of the stratosphere shields life on Earth by absorbing the majority of harmful ultraviolet (UV) radiation from the Sun?',
      options: ['Troposphere', 'Ozone Layer', 'Mesosphere', 'Exosphere'],
      answer: 'Ozone Layer',
      hint: 'Host Hint: Composed of triatomic oxygen (O3) molecules.'
    },
    {
      id: 'sci_env_003',
      category: 'Science',
      subcategory: 'Environment',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is the ecological term for a species whose presence and role exerts disproportionate control over the structure and stability of its entire ecosystem?',
      options: ['Invasive Species', 'Keystone Species', 'Pioneer Species', 'Indicator Species'],
      answer: 'Keystone Species',
      hint: 'Host Hint: Like sea otters in kelp forests or wolves in Yellowstone.'
    },
    {
      id: 'sci_env_004',
      category: 'Science',
      subcategory: 'Environment',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What process describes the gradual buildup and increasing concentration of toxic substances (like mercury or DDT) at higher trophic levels in a food chain?',
      options: ['Biomagnification', 'Eutrophication', 'Bioleaching', 'Bioremediation'],
      answer: 'Biomagnification',
      hint: 'Host Hint: Also called biological amplification up the food web.'
    },
    {
      id: 'sci_env_005',
      category: 'Science',
      subcategory: 'Environment',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In freshwater limnology, what is the layer of rapid temperature drop separating the warm epilimnion from the cold hypolimnion in a stratified lake called?',
      options: ['Thermocline (Metalimnion)', 'Pycnocline', 'Benthic zone', 'Halocline'],
      answer: 'Thermocline (Metalimnion)',
      hint: 'Host Hint: A thermal gradient barrier during summer lake stratification.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
