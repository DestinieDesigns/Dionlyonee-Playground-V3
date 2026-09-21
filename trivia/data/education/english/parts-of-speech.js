/**
 * Trivia Questions: Parts of Speech
 */
(function () {
  const questions = [
    {
      id: 'eng_pos_001',
      category: 'English & Literature',
      subcategory: 'Parts of Speech',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which part of speech names a person, place, thing, or idea?',
      options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
      answer: 'Noun',
      hint: 'Host Hint: Examples: Kingston, teacher, microphone, joy.'
    },
    {
      id: 'eng_pos_002',
      category: 'English & Literature',
      subcategory: 'Parts of Speech',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'In the sentence "The golden sun shone brilliantly," what part of speech is the word "brilliantly"?',
      options: ['Adjective', 'Adverb', 'Preposition', 'Conjunction'],
      answer: 'Adverb',
      hint: 'Host Hint: Modifies the verb "shone" and ends in -ly.'
    },
    {
      id: 'eng_pos_003',
      category: 'English & Literature',
      subcategory: 'Parts of Speech',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'The acronym FANBOYS helps remember which group of grammatical connecting words?',
      options: ['Coordinating Conjunctions', 'Subordinating Conjunctions', 'Correlative Prepositions', 'Demonstrative Pronouns'],
      answer: 'Coordinating Conjunctions',
      hint: 'Host Hint: For, And, Nor, But, Or, Yet, So.'
    },
    {
      id: 'eng_pos_004',
      category: 'English & Literature',
      subcategory: 'Parts of Speech',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'In the sentence "She considers him a genius", what grammatical role does "a genius" fulfill?',
      options: ['Direct Object', 'Object Complement', 'Subject Complement', 'Indirect Object'],
      answer: 'Object Complement',
      hint: 'Host Hint: Renames and completes the direct object "him".'
    },
    {
      id: 'eng_pos_005',
      category: 'English & Literature',
      subcategory: 'Parts of Speech',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In Latinate grammar, what is an expletive in syntax (such as "There" in "There is a fly in my soup") technically called?',
      options: ['A dummy pronoun / syntactic expletive', 'A vocative particle', 'A postpositional clitic', 'An anaphoric adjunct'],
      answer: 'A dummy pronoun / syntactic expletive',
      hint: 'Host Hint: A placeholder word that fills a syntactic position without providing semantic content.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
