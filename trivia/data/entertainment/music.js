/**
 * Trivia Questions: Music
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'mus_001',
      category: 'Music',
      subcategory: 'Pop Legends',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which legendary singer was universally crowned the "King of Pop" and released the landmark album "Thriller"?',
      options: ['Prince', 'Michael Jackson', 'Stevie Wonder', 'Elvis Presley'],
      answer: 'Michael Jackson',
      hint: 'Host Hint: Moonwalk creator and legendary dancer.'
    },
    {
      id: 'mus_002',
      category: 'Music',
      subcategory: 'Rock & Roll',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Who was the iconic lead vocalist of the British rock band Queen, famed for singing "Bohemian Rhapsody"?',
      options: ['Freddie Mercury', 'David Bowie', 'Mick Jagger', 'Robert Plant'],
      answer: 'Freddie Mercury',
      hint: 'Host Hint: Famed for his 4-octave vocal range and Live Aid performance.'
    },
    {
      id: 'mus_003',
      category: 'Music',
      subcategory: 'Reggae & Dancehall',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which reggae icon recorded the landmark album "Exodus" in London in 1977 alongside the Wailers?',
      options: ['Peter Tosh', 'Bob Marley', 'Dennis Brown', 'Gregory Isaacs'],
      answer: 'Bob Marley',
      hint: 'Host Hint: Time Magazine crowned "Exodus" the best album of the 20th century.'
    },
    {
      id: 'mus_004',
      category: 'Music',
      subcategory: 'Hip Hop',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which pioneering 1979 single by The Sugarhill Gang is credited as the first rap record to reach the Top 40 on the US Billboard Hot 100?',
      options: ['The Message', 'Rapper\'s Delight', 'Planet Rock', 'White Lines'],
      answer: 'Rapper\'s Delight',
      hint: 'Host Hint: "I said-a hip, hop, the hippie, the hippie, to the hip hip hop..."'
    },
    {
      id: 'mus_005',
      category: 'Music',
      subcategory: 'Musicology & Instruments',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the exact musical tempo term indicating a slow, stately, and solemn pace of roughly 40 to 60 beats per minute, even slower than andante?',
      options: ['Presto', 'Allegro', 'Largo', 'Vivace'],
      answer: 'Largo',
      hint: 'Host Hint: From the Italian word for "broad" or "wide".'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
