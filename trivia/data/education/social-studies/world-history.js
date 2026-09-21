/**
 * Trivia Questions: Social Studies - World History
 */
(function () {
  const questions = [
    {
      id: 'ss_wh_001',
      category: 'Social Studies',
      subcategory: 'World History',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which ancient civilization built the colossal Great Pyramids of Giza along the Nile River?',
      options: ['Ancient Egypt', 'Ancient Greece', 'Mesopotamia', 'The Roman Empire'],
      answer: 'Ancient Egypt',
      hint: 'Host Hint: Ruled by pharaohs like Khufu and Tutankhamun.'
    },
    {
      id: 'ss_wh_002',
      category: 'Social Studies',
      subcategory: 'World History',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What famous network of ancient trade routes connected China and the Mediterranean world for centuries?',
      options: ['The Silk Road', 'The Amber Road', 'The Trans-Saharan Highway', 'The Incense Route'],
      answer: 'The Silk Road',
      hint: 'Host Hint: Named after the lucrative Chinese fabric traded along it.'
    },
    {
      id: 'ss_wh_003',
      category: 'Social Studies',
      subcategory: 'World History',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'In 1453, the fall of Constantinople to the Ottoman Empire under Sultan Mehmed II marked the end of which ancient empire?',
      options: ['Byzantine Empire (Eastern Roman Empire)', 'Holy Roman Empire', 'Persian Empire', 'Carthaginian Empire'],
      answer: 'Byzantine Empire (Eastern Roman Empire)',
      hint: 'Host Hint: Capital founded by Emperor Constantine in 330 AD.'
    },
    {
      id: 'ss_wh_004',
      category: 'Social Studies',
      subcategory: 'World History',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'The Rosetta Stone, discovered by French soldiers in 1799, allowed Jean-François Champollion to decipher which ancient writing script?',
      options: ['Egyptian Hieroglyphics', 'Babylonian Cuneiform', 'Linear A', 'Indus Script'],
      answer: 'Egyptian Hieroglyphics',
      hint: 'Host Hint: Inscribed with the same decree in Hieroglyphic, Demotic, and Ancient Greek.'
    },
    {
      id: 'ss_wh_005',
      category: 'Social Studies',
      subcategory: 'World History',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In 1260 AD, which decisive battle in the Levant marked the first time a Mongol invasion had ever been permanently halted in close combat by the Mamluk Sultanate?',
      options: ['Battle of Ain Jalut', 'Battle of Mohi', 'Battle of Kulikovo', 'Battle of the Kalka River'],
      answer: 'Battle of Ain Jalut',
      hint: 'Host Hint: Fought in the Jezreel Valley near the "Spring of Goliath".'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
