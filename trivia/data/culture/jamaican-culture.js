/**
 * Trivia Questions: Jamaican Culture
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'jam_001',
      category: 'Jamaican Culture',
      subcategory: 'National Symbols',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What are the three vibrant colors featured on the Jamaican national flag with the iconic saltire cross?',
      options: ['Red, Gold, Green', 'Black, Green, Gold', 'Blue, Yellow, Red', 'Green, White, Black'],
      answer: 'Black, Green, Gold',
      hint: 'Host Hint: "Hardships there are but the land is green and the sun shineth."'
    },
    {
      id: 'jam_002',
      category: 'Jamaican Culture',
      subcategory: 'National Dish',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the world-famous national dish of Jamaica, traditionally served at breakfast or dinner with fried dumplings or boiled green bananas?',
      options: ['Curry Goat and Rice', 'Ackee and Saltfish', 'Oxtail with Butter Beans', 'Escovitch Fish'],
      answer: 'Ackee and Saltfish',
      hint: 'Host Hint: Combines the national yellow fruit with salted dried codfish.'
    },
    {
      id: 'jam_003',
      category: 'Jamaican Culture',
      subcategory: 'Athletics & Pride',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which Jamaican sprint legend set the untouched men\'s 100m world record of 9.58 seconds at the 2009 World Championships in Berlin?',
      options: ['Asafa Powell', 'Yohan Blake', 'Usain Bolt', 'Linford Christie'],
      answer: 'Usain Bolt',
      hint: 'Host Hint: Celebrates with the iconic "Lightning Bolt" to di worl pose.'
    },
    {
      id: 'jam_004',
      category: 'Jamaican Culture',
      subcategory: 'National Heroes',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Who is the only woman among Jamaica\'s seven National Heroes, famous as the fierce leader of the Windward Maroons who fought the British?',
      options: ['Queen Nanny of the Maroons', 'Mary Seacole', 'Louise Bennett-Coverley', 'Edna Manley'],
      answer: 'Queen Nanny of the Maroons',
      hint: 'Host Hint: Featured on the Jamaican 500 dollar banknote.'
    },
    {
      id: 'jam_005',
      category: 'Jamaican Culture',
      subcategory: 'Heritage & Geography',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Before the catastrophic 1692 earthquake sank two-thirds of it into the Caribbean Sea, which Jamaican coastal harbor was infamous as the "wickedest city on Earth" and pirate stronghold?',
      options: ['Port Royal', 'Spanish Town', 'Falmouth', 'Savanna-la-Mar'],
      answer: 'Port Royal',
      hint: 'Host Hint: Located at the mouth of Kingston Harbour, frequented by Captain Henry Morgan.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
