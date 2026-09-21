/**
 * Trivia Questions: Grammar
 */
(function () {
  const questions = [
    {
      id: 'eng_gram_001',
      category: 'English & Literature',
      subcategory: 'Grammar',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which sentence uses the correct form of the word to show possession?',
      options: ['The dog wagged its tail.', 'The dog wagged it\'s tail.', 'The dog wagged its\' tail.', 'The dog wagged it tail.'],
      answer: 'The dog wagged its tail.',
      hint: 'Host Hint: "It\'s" is only for "it is" or "it has". Possessive is "its".'
    },
    {
      id: 'eng_gram_002',
      category: 'English & Literature',
      subcategory: 'Grammar',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Identify the sentence with correct subject-verb agreement:',
      options: ['Neither the teacher nor the students was ready.', 'Neither the teacher nor the students were ready.', 'Neither the students nor the teacher were ready.', 'Both the teacher or the students was ready.'],
      answer: 'Neither the teacher nor the students were ready.',
      hint: 'Host Hint: When using "neither/nor", verb agrees with the closer subject ("students were").'
    },
    {
      id: 'eng_gram_003',
      category: 'English & Literature',
      subcategory: 'Grammar',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which grammatical mood is used in the clause "If I were a bird, I would fly away"?',
      options: ['Indicative Mood', 'Imperative Mood', 'Subjunctive Mood', 'Infinitive Mood'],
      answer: 'Subjunctive Mood',
      hint: 'Host Hint: Expresses wishes, hypothetical, or contrary-to-fact scenarios.'
    },
    {
      id: 'eng_gram_004',
      category: 'English & Literature',
      subcategory: 'Grammar',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What type of grammatical error occurs in: "Walking down the quiet street, the trees looked majestic"?',
      options: ['Dangling Modifier', 'Comma Splice', 'Run-on Sentence', 'Faulty Parallelism'],
      answer: 'Dangling Modifier',
      hint: 'Host Hint: Makes it sound like the trees themselves are walking down the street.'
    },
    {
      id: 'eng_gram_005',
      category: 'English & Literature',
      subcategory: 'Grammar',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In linguistics and advanced English grammar, what is a verb form that behaves as a noun ending in -ing (e.g., "Swimming is great") strictly classified as?',
      options: ['Participle', 'Gerund', 'Substantive Adverb', 'Modal Auxiliary'],
      answer: 'Gerund',
      hint: 'Host Hint: Distinct from a present participle used as an adjective.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
