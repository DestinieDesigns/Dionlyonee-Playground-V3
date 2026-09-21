/**
 * Trivia Questions: Superheroes & Comics
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'sup_001',
      category: 'Superheroes',
      subcategory: 'DC Comics',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is Superman’s secret civilian alter ego when working as a reporter at the Daily Planet?',
      options: ['Bruce Wayne', 'Peter Parker', 'Clark Kent', 'Barry Allen'],
      answer: 'Clark Kent',
      hint: 'Host Hint: Wears glasses and works alongside Lois Lane.'
    },
    {
      id: 'sup_002',
      category: 'Superheroes',
      subcategory: 'Marvel Comics',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What fictional, ultra-durable metal is extracted almost exclusively from the hidden nation of Wakanda?',
      options: ['Adamantium', 'Vibranium', 'Kryptonite', 'Beskar'],
      answer: 'Vibranium',
      hint: 'Host Hint: Used to craft Black Panther’s suit and Captain America’s shield.'
    },
    {
      id: 'sup_003',
      category: 'Superheroes',
      subcategory: 'Avengers Lore',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'How many Infinity Stones are there in the Marvel Cinematic Universe that Thanos seeks to unite in his gauntlet?',
      options: ['4', '5', '6', '7'],
      answer: '6',
      hint: 'Host Hint: Space, Mind, Reality, Power, Time, and Soul.'
    },
    {
      id: 'sup_004',
      category: 'Superheroes',
      subcategory: 'Golden Age Comics',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'In Action Comics #1 (1938), Superman originally could not fly. What was his maximum jumping ability described as?',
      options: ['Leap an eighth of a mile into the air', 'Leap tall buildings in a single bound', 'Jump across entire continents', 'Skyhop 500 feet'],
      answer: 'Leap tall buildings in a single bound',
      hint: 'Host Hint: "Able to leap tall buildings in a single bound, more powerful than a locomotive."'
    },
    {
      id: 'sup_005',
      category: 'Superheroes',
      subcategory: 'Deep Comic Canon',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the full birth name of the DC Comics antihero Lobo, according to his Czarnian origin lore?',
      options: ['He who devours your entrails and thoroughly enjoys it', 'The Last Czarnian Executioner', 'Bloodhound of Sector 2814', 'Scourge of the Cosmos'],
      answer: 'He who devours your entrails and thoroughly enjoys it',
      hint: 'Host Hint: In ancient Czarnian, "Lobo" literally translates to an appetite for visceral organs with immense pleasure.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
