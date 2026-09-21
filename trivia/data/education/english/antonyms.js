/**
 * Trivia Questions: Antonyms
 */
(function () {
  const questions = [
    {
      id: 'eng_ant_001',
      category: 'English & Literature',
      subcategory: 'Antonyms',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the direct antonym (opposite) of "brave"?',
      options: ['Cowardly', 'Strong', 'Gallant', 'Calm'],
      answer: 'Cowardly',
      hint: 'Host Hint: Lacking courage.'
    },
    {
      id: 'eng_ant_002',
      category: 'English & Literature',
      subcategory: 'Antonyms',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the opposite of the word "abundant"?',
      options: ['Scarce', 'Plentiful', 'Lavish', 'Overflowing'],
      answer: 'Scarce',
      hint: 'Host Hint: In very short supply.'
    },
    {
      id: 'eng_ant_003',
      category: 'English & Literature',
      subcategory: 'Antonyms',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is the true antonym of "cacophony"?',
      options: ['Euphony', 'Pandemonium', 'Clamor', 'Dissonance'],
      answer: 'Euphony',
      hint: 'Host Hint: Harmonious, pleasant sound ("eu-" means good).'
    },
    {
      id: 'eng_ant_004',
      category: 'English & Literature',
      subcategory: 'Antonyms',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is the direct antonym of the word "loquacious"?',
      options: ['Taciturn', 'Voluble', 'Garrulous', 'Eloquent'],
      answer: 'Taciturn',
      hint: 'Host Hint: Loquacious means talkative; taciturn means habitually silent and uncommunicative.'
    },
    {
      id: 'eng_ant_005',
      category: 'English & Literature',
      subcategory: 'Antonyms',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the antonym of "ephemeral" when specifically describing things that are eternal or everlasting?',
      options: ['Perennial', 'Transient', 'Fugacious', 'Evidenced'],
      answer: 'Perennial',
      hint: 'Host Hint: Lasting or existing for a long or infinite time; recurring endlessly.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
