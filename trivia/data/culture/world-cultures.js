/**
 * Trivia Questions: World Cultures
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'wc_001',
      category: 'World Cultures',
      subcategory: 'Garments',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'The kimono is a traditional T-shaped wrapped garment associated with the cultural history of which nation?',
      options: ['China', 'Japan', 'South Korea', 'Vietnam'],
      answer: 'Japan',
      hint: 'Host Hint: Worn with an obi sash and wooden geta sandals.'
    },
    {
      id: 'wc_002',
      category: 'World Cultures',
      subcategory: 'Festivals',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Which vibrant Hindu spring celebration is widely known across the globe as the "Festival of Colors"?',
      options: ['Diwali', 'Holi', 'Navaratri', 'Eid'],
      answer: 'Holi',
      hint: 'Host Hint: Celebrators toss pigmented colored powders called gulal into the air.'
    },
    {
      id: 'wc_003',
      category: 'World Cultures',
      subcategory: 'Customs & Politeness',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'In New Zealand Maori culture, what is the traditional greeting where two people press their foreheads and noses together called?',
      options: ['Haka', 'Hongi', 'Waiata', 'Hangi'],
      answer: 'Hongi',
      hint: 'Host Hint: Represents the sharing of the breath of life (ha).'
    },
    {
      id: 'wc_004',
      category: 'World Cultures',
      subcategory: 'Indigenous Art',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which indigenous people of the Arctic region of Canada and Greenland carve the sacred stone directional landmarks called Inuksuit?',
      options: ['Inuit', 'Maori', 'Navajo', 'Sami'],
      answer: 'Inuit',
      hint: 'Host Hint: Built to resemble human figures in snowy expanses.'
    },
    {
      id: 'wc_005',
      category: 'World Cultures',
      subcategory: 'Anthropology',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'The Toraja ethnic group of South Sulawesi, Indonesia, is famous for which elaborate and world-renowned cultural ritual that can take months or years of preparation?',
      options: ['Post-mortem funeral rituals keeping preserved ancestors at home', 'Sky burials on mountain peaks', 'Floating bamboo weddings', 'Living inside hollowed giant baobab trees'],
      answer: 'Post-mortem funeral rituals keeping preserved ancestors at home',
      hint: 'Host Hint: Rambu Solo funerary ceremonies treating deceased relatives as sick ("to makula") before tomb entombment in cliffs.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
