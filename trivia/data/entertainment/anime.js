/**
 * Trivia Questions: Anime & Manga
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'ani_m_001',
      category: 'Anime',
      subcategory: 'Shonen',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'In the anime "Naruto", what is the primary food that Naruto Uzumaki is obsessed with eating at Ichiraku?',
      options: ['Sushi', 'Ramen', 'Dumplings', 'Curry Rice'],
      answer: 'Ramen',
      hint: 'Host Hint: Steaming noodle soup in a big bowl with pork and narutomaki.'
    },
    {
      id: 'ani_m_002',
      category: 'Anime',
      subcategory: 'Shonen',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'In "Dragon Ball Z", how many magical dragon balls must be gathered together to summon the wish-granting dragon Shenron?',
      options: ['5', '6', '7', '8'],
      answer: '7',
      hint: 'Host Hint: Goku’s grandfather left him the four-star ball.'
    },
    {
      id: 'ani_m_003',
      category: 'Anime',
      subcategory: 'Pirates & Fantasy',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'In "One Piece", what is the Japanese name of Monkey D. Luffy’s signature Devil Fruit, later revealed as the mythical Hito Hito no Mi, Model: Nika?',
      options: ['Mera Mera no Mi', 'Gomu Gomu no Mi', 'Ope Ope no Mi', 'Yami Yami no Mi'],
      answer: 'Gomu Gomu no Mi',
      hint: 'Host Hint: Translates into English as the Gum-Gum Fruit.'
    },
    {
      id: 'ani_m_004',
      category: 'Anime',
      subcategory: 'Studio Ghibli',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which Studio Ghibli masterpiece directed by Hayao Miyazaki won the Academy Award for Best Animated Feature at the 75th Academy Awards in 2003?',
      options: ['Princess Mononoke', 'Spirited Away', 'My Neighbor Totoro', 'Howl\'s Moving Castle'],
      answer: 'Spirited Away',
      hint: 'Host Hint: Follows young Chihiro trapped in a bathhouse for spirits.'
    },
    {
      id: 'ani_m_005',
      category: 'Anime',
      subcategory: 'Classic Lore',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In the pioneering 1988 cyberpunk anime "Akira", what was the secret project facility code number given to Tetsuo Shima during his psychic tests?',
      options: ['Subject 28', 'Subject 41', 'Subject 19', 'Subject 77'],
      answer: 'Subject 41',
      hint: 'Host Hint: Akira was designated #28; Tetsuo was tested as #41.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
