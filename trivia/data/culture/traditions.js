/**
 * Trivia Questions: Traditions & Folklore
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'trad_001',
      category: 'Traditions',
      subcategory: 'Celebrations',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What festive activity involves hitting a hollow papier-mâché or clay container filled with candy and toys at Mexican celebrations?',
      options: ['Pinwheel', 'Piñata', 'Maraca', 'Sombrero'],
      answer: 'Piñata',
      hint: 'Host Hint: Children wear a blindfold and take swings with a stick.'
    },
    {
      id: 'trad_002',
      category: 'Traditions',
      subcategory: 'Mythology',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'In West African and Caribbean folklore (especially Jamaica), who is the clever spider trickster that outwits larger animals?',
      options: ['Anansi', 'Coyote', 'Br\'er Rabbit', 'Loki'],
      answer: 'Anansi',
      hint: 'Host Hint: The legendary eight-legged storyteller of Ashanti origin.'
    },
    {
      id: 'trad_003',
      category: 'Traditions',
      subcategory: 'Winter Traditions',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'In Central European Alpine folklore, what horned, anthropomorphic figure accompanies Saint Nicholas to punish misbehaving children?',
      options: ['Belsnickel', 'Krampus', 'Père Fouettard', 'Grýla'],
      answer: 'Krampus',
      hint: 'Host Hint: Celebrated with Krampuslauf parades through Austrian and Bavarian streets.'
    },
    {
      id: 'trad_004',
      category: 'Traditions',
      subcategory: 'Folklore & Superstition',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'In Celtic tradition, which ancient pagan festival marked the end of the harvest season and the beginning of winter, and is the direct ancestor of modern Halloween?',
      options: ['Beltane', 'Samhain', 'Lughnasadh', 'Imbolc'],
      answer: 'Samhain',
      hint: 'Host Hint: Pronounced "SOW-in", celebrated on October 31 - November 1.'
    },
    {
      id: 'trad_005',
      category: 'Traditions',
      subcategory: 'Ancient Ceremonies',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'The Potlatch is a complex gift-giving feast and wealth redistribution ceremonial system practiced by indigenous peoples of which geographical region?',
      options: ['Pacific Northwest Coast of North America', 'Amazonian Basin of Brazil', 'Kalahari Desert of Southern Africa', 'Steppes of Central Asia'],
      answer: 'Pacific Northwest Coast of North America',
      hint: 'Host Hint: Practiced by Haida, Tlingit, Salish, and Kwakwakaʼwakw nations.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
