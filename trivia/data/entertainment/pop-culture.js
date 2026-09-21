/**
 * Trivia Questions: Pop Culture & Viral
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'pop_001',
      category: 'Pop Culture',
      subcategory: 'Viral Internet',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which South Korean artist shattered internet records in 2012 when the music video for "Gangnam Style" became the first YouTube video to reach 1 billion views?',
      options: ['BTS', 'PSY', 'BLACKPINK', 'G-Dragon'],
      answer: 'PSY',
      hint: 'Host Hint: Wore a tux and performed the iconic horse-riding dance.'
    },
    {
      id: 'pop_002',
      category: 'Pop Culture',
      subcategory: 'Celebrity & Fashion',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'At the 2010 MTV Video Music Awards, which pop superstar stunned the red carpet by wearing a dress made entirely of raw beef?',
      options: ['Katy Perry', 'Lady Gaga', 'Rihanna', 'Nicki Minaj'],
      answer: 'Lady Gaga',
      hint: 'Host Hint: The legendary "Meat Dress" designer Franc Fernandez.'
    },
    {
      id: 'pop_003',
      category: 'Pop Culture',
      subcategory: 'Reality TV',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Who was the iconic inaugural winner of the first US season of "Survivor" (Borneo) in the year 2000?',
      options: ['Kelly Wiglesworth', 'Richard Hatch', 'Rudy Boesch', 'Susan Hawk'],
      answer: 'Richard Hatch',
      hint: 'Host Hint: The corporate trainer who invented alliance gameplay and famously fished naked.'
    },
    {
      id: 'pop_004',
      category: 'Pop Culture',
      subcategory: 'Tech Culture',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What was the exact 18-second video uploaded on April 23, 2005 by co-founder Jawed Karim, registered as the very first video ever on YouTube?',
      options: ['Me at the zoo', 'Hello World', 'First day at YouTube', 'Sneezing Panda'],
      answer: 'Me at the zoo',
      hint: 'Host Hint: Standing in front of elephants pointing out their trunks at the San Diego Zoo.'
    },
    {
      id: 'pop_005',
      category: 'Pop Culture',
      subcategory: 'Memes & History',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'The internet meme phenomenon "Rickrolling" originated on 4chan as a bait-and-switch variant of which earlier image meme that disguised itself as GTA trailers?',
      options: ['Duckroll', 'Dogeroll', 'Peperoll', 'Catroll'],
      answer: 'Duckroll',
      hint: 'Host Hint: An image of a wooden duck with wheels attached.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
