/**
 * Trivia Questions: Video Games
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'vg_001',
      category: 'Video Games',
      subcategory: 'Nintendo',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the name of Mario\'s taller, green-clad brother in the Super Mario series?',
      options: ['Wario', 'Luigi', 'Toad', 'Yoshi'],
      answer: 'Luigi',
      hint: 'Host Hint: Wears a green hat with the letter "L".'
    },
    {
      id: 'vg_002',
      category: 'Video Games',
      subcategory: 'Action RPG',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'In "The Legend of Zelda" franchise, what is the legendary sacred blade that seals the darkness called?',
      options: ['Buster Sword', 'Master Sword', 'Keyblade', 'Soul Edge'],
      answer: 'Master Sword',
      hint: 'Host Hint: Placed in the Pedestal of Time by the hero Link.'
    },
    {
      id: 'vg_003',
      category: 'Video Games',
      subcategory: 'Shooters',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'In the "Halo" franchise, what is Master Chief\'s Spartan service tag number?',
      options: ['Spartan-042', 'Spartan-117', 'Spartan-087', 'Spartan-256'],
      answer: 'Spartan-117',
      hint: 'Host Hint: Three digits: one, one, seven.'
    },
    {
      id: 'vg_004',
      category: 'Video Games',
      subcategory: 'Gaming History',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What iconic cheat sequence entered on the D-pad and buttons was first introduced by Kazuhisa Hashimoto in 1986\'s "Gradius"?',
      options: ['The Konami Code', 'The Capcom Combo', 'The Sega Genesis Unlock', 'The Blizzard Key'],
      answer: 'The Konami Code',
      hint: 'Host Hint: Up, Up, Down, Down, Left, Right, Left, Right, B, A.'
    },
    {
      id: 'vg_005',
      category: 'Video Games',
      subcategory: 'Gaming Lore',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In the original 1993 PC release of "DOOM" by id Software, what was the name of the final boss encountered in Episode 3: Inferno?',
      options: ['Cyberdemon', 'Spider Mastermind', 'Icon of Sin', 'Baron of Hell'],
      answer: 'Spider Mastermind',
      hint: 'Host Hint: A giant brain on robotic mechanical legs wielding a chaingun.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
