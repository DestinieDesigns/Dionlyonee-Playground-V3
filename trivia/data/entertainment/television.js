/**
 * Trivia Questions: Television
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'tv_001',
      category: 'Television',
      subcategory: 'Sitcoms',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'On the hit sitcom "Friends", what is the name of the coffee shop where the gang regularly hangs out?',
      options: ['Central Perk', 'Monk\'s Diner', 'Cafe Nervosa', 'Luke\'s Diner'],
      answer: 'Central Perk',
      hint: 'Host Hint: A play on NYC\'s Central Park and coffee perking.'
    },
    {
      id: 'tv_002',
      category: 'Television',
      subcategory: 'Drama',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'In "Breaking Bad", what alias does chemistry teacher Walter White adopt in the criminal underworld?',
      options: ['Ozymandias', 'Heisenberg', 'Gus Fring', 'Saul'],
      answer: 'Heisenberg',
      hint: 'Host Hint: Borrowed from the German physicist famous for the uncertainty principle.'
    },
    {
      id: 'tv_003',
      category: 'Television',
      subcategory: 'Fantasy',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'In HBO\'s "Game of Thrones", what is the ancestral Valyrian steel greatsword of House Stark named?',
      options: ['Longclaw', 'Oathkeeper', 'Ice', 'Widow\'s Wail'],
      answer: 'Ice',
      hint: 'Host Hint: Cold as the North, melted down by Tywin Lannister.'
    },
    {
      id: 'tv_004',
      category: 'Television',
      subcategory: 'Sci-Fi',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'In "The Twilight Zone" legendary episode "To Serve Man", what turns out to be the shocking truth about the alien book?',
      options: ['It is a declaration of war', 'It is a cookbook', 'It is an empty journal', 'It is a history of Earth'],
      answer: 'It is a cookbook',
      hint: 'Host Hint: "Mr. Chambers, don\'t get on that ship! It\'s a cookbook!"'
    },
    {
      id: 'tv_005',
      category: 'Television',
      subcategory: 'Broadcast History',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'The final episode of "M*A*S*H" in 1983 held the record for highest television ratings in US history for decades. What was the exact title of this finale episode?',
      options: ['Goodbye, Farewell and Amen', 'The War is Over', 'As Time Goes By', 'Homecoming Day'],
      answer: 'Goodbye, Farewell and Amen',
      hint: 'Host Hint: A triple parting salutation ending with "Amen".'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
