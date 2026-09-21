/**
 * Trivia Questions: Random Facts
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'rnd_001',
      category: 'Random Facts',
      subcategory: 'Anatomy',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the hardest and most mineralized substance found in the human body?',
      options: ['Femur Bone', 'Tooth Enamel', 'Fingernails', 'Skull'],
      answer: 'Tooth Enamel',
      hint: 'Host Hint: Covers the outer layer of teeth.'
    },
    {
      id: 'rnd_002',
      category: 'Random Facts',
      subcategory: 'Nature',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Bananas are naturally slightly radioactive because they contain high levels of which mineral isotope?',
      options: ['Potassium-40', 'Uranium-235', 'Carbon-14', 'Cobalt-60'],
      answer: 'Potassium-40',
      hint: 'Host Hint: The key dietary electrolyte bananas are celebrated for.'
    },
    {
      id: 'rnd_003',
      category: 'Random Facts',
      subcategory: 'Biology',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which Australian marsupial is famous for producing distinctly cube-shaped feces?',
      options: ['Kangaroo', 'Koala', 'Wombat', 'Platypus'],
      answer: 'Wombat',
      hint: 'Host Hint: Ground-dwelling burrower whose cubic droppings don\'t roll off rocks.'
    },
    {
      id: 'rnd_004',
      category: 'Random Facts',
      subcategory: 'Science Facts',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What common food item never naturally spoils and edible jars have been recovered from ancient tombs thousands of years old?',
      options: ['Pure Honey', 'White Rice', 'Dried Lentils', 'Salted Beef'],
      answer: 'Pure Honey',
      hint: 'Host Hint: Produced by bees with very low moisture and high acidity.'
    },
    {
      id: 'rnd_005',
      category: 'Random Facts',
      subcategory: 'Mathematics & Linguistics',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'When spelling out positive English whole numbers (one, two, three...), what is the very first number whose name contains the letter "A"?',
      options: ['One Hundred', 'One Thousand', 'One Million', 'One Billion'],
      answer: 'One Thousand',
      hint: 'Host Hint: You have to count all the way past 999 before encountering an \'a\'.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
