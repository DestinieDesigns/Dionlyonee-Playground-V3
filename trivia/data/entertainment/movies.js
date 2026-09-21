/**
 * Trivia Questions: Movies & Cinema
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'mov_001',
      category: 'Movies & Cinema',
      subcategory: 'Animation',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'In Disney\'s "The Lion King", what is the name of Simba\'s wise mandrill advisor who presents him to the pride?',
      options: ['Rafiki', 'Zazu', 'Timon', 'Pumbaa'],
      answer: 'Rafiki',
      hint: 'Host Hint: He uses a staff with gourds and says "Asante sana squash banana".'
    },
    {
      id: 'mov_002',
      category: 'Movies & Cinema',
      subcategory: 'Blockbusters',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Which James Cameron sci-fi epic became the highest-grossing film of all time upon its release in 2009?',
      options: ['Titanic', 'Avatar', 'Interstellar', 'The Avengers'],
      answer: 'Avatar',
      hint: 'Host Hint: Set on the lush alien moon of Pandora with the Na\'vi.'
    },
    {
      id: 'mov_003',
      category: 'Movies & Cinema',
      subcategory: 'Classics',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which iconic 1994 prison drama directed by Frank Darabont is based on a novella by Stephen King and holds the #1 spot on IMDb Top 250?',
      options: ['The Green Mile', 'The Shawshank Redemption', 'Escape from Alcatraz', 'Papillon'],
      answer: 'The Shawshank Redemption',
      hint: 'Host Hint: Stars Tim Robbins as Andy Dufresne and Morgan Freeman as Red.'
    },
    {
      id: 'mov_004',
      category: 'Movies & Cinema',
      subcategory: 'Academy Awards',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Only three movies in Academy Award history have won the "Big Five" Oscars (Picture, Director, Actor, Actress, Screenplay). Two are "It Happened One Night" and "One Flew Over the Cuckoo\'s Nest". What is the third?',
      options: ['The Godfather', 'The Silence of the Lambs', 'Schindler\'s List', 'Casablanca'],
      answer: 'The Silence of the Lambs',
      hint: 'Host Hint: 1991 psychological thriller featuring Dr. Hannibal Lecter and Clarice Starling.'
    },
    {
      id: 'mov_005',
      category: 'Movies & Cinema',
      subcategory: 'Film Trivia & Lore',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the name of the sound effect recorded in 1951 for "Distant Drums" that has since been placed in over 400 major Hollywood films as an inside joke?',
      options: ['The Wilhelm Scream', 'The Hollywood Foley', 'The Skywalker Yell', 'The Howie Screech'],
      answer: 'The Wilhelm Scream',
      hint: 'Host Hint: Named after Private Wilhelm, an alligator-bitten character in the 1953 western "The Charge at Feather River".'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
