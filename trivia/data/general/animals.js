/**
 * Trivia Questions: Animals
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'ani_001',
      category: 'Animals',
      subcategory: 'Mammals',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the largest living land mammal on Earth?',
      options: ['White Rhinoceros', 'African Elephant', 'Hippopotamus', 'Giraffe'],
      answer: 'African Elephant',
      hint: 'Host Hint: Has massive floppy ears shaped like the continent of Africa.'
    },
    {
      id: 'ani_002',
      category: 'Animals',
      subcategory: 'Marine',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'How many hearts does an octopus have?',
      options: ['1', '2', '3', '4'],
      answer: '3',
      hint: 'Host Hint: Two pump blood to the gills while one pumps it to the body.'
    },
    {
      id: 'ani_003',
      category: 'Animals',
      subcategory: 'Birds',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is a collective group of flamingos officially called?',
      options: ['A Flock', 'A Flamboyance', 'A Colony', 'A Splendor'],
      answer: 'A Flamboyance',
      hint: 'Host Hint: Matches their extravagant, colorful, flamboyant pink appearance.'
    },
    {
      id: 'ani_004',
      category: 'Animals',
      subcategory: 'Zoology',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which mammal has the densest fur of any animal, with up to 1 million hairs per square inch?',
      options: ['Polar Bear', 'Sea Otter', 'Chinchilla', 'Arctic Fox'],
      answer: 'Sea Otter',
      hint: 'Host Hint: They float on their backs in kelp forests and hold hands.'
    },
    {
      id: 'ani_005',
      category: 'Animals',
      subcategory: 'Evolutionary Biology',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'The tuatara, an ancient reptile endemic to New Zealand, is famous for possessing which unique anatomical feature?',
      options: ['Two hearts', 'A third parietal eye', 'No ribcage', 'Blue blood'],
      answer: 'A third parietal eye',
      hint: 'Host Hint: Located on top of its head, complete with lens and retina.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
