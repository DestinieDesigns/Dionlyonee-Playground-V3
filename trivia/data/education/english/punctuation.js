/**
 * Trivia Questions: Punctuation
 */
(function () {
  const questions = [
    {
      id: 'eng_punc_001',
      category: 'English & Literature',
      subcategory: 'Punctuation',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which punctuation mark is used at the end of an interrogative sentence?',
      options: ['Period', 'Exclamation Point', 'Question Mark', 'Comma'],
      answer: 'Question Mark',
      hint: 'Host Hint: Symbolized by "?".'
    },
    {
      id: 'eng_punc_002',
      category: 'English & Literature',
      subcategory: 'Punctuation',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Which punctuation mark is used to link two independent clauses that are closely related in thought without a coordinating conjunction?',
      options: ['Semicolon', 'Colon', 'Hyphen', 'Apostrophe'],
      answer: 'Semicolon',
      hint: 'Host Hint: Has a dot over a comma (;).'
    },
    {
      id: 'eng_punc_003',
      category: 'English & Literature',
      subcategory: 'Punctuation',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is the optional comma placed immediately before the coordinating conjunction in a list of three or more items called?',
      options: ['Oxford Comma (Serial Comma)', 'Cambridge Comma', 'Harvard Comma', 'Chicago Comma'],
      answer: 'Oxford Comma (Serial Comma)',
      hint: 'Host Hint: Named after Oxford University Press.'
    },
    {
      id: 'eng_punc_004',
      category: 'English & Literature',
      subcategory: 'Punctuation',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which dash is the length of an uppercase "M" and is used in text to create a strong pause or emphasize a parenthetical thought?',
      options: ['En Dash', 'Em Dash', 'Hyphen', 'Figure Dash'],
      answer: 'Em Dash',
      hint: 'Host Hint: The longest dash, width of the letter M (—).'
    },
    {
      id: 'eng_punc_005',
      category: 'English & Literature',
      subcategory: 'Punctuation',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the typographical term for the hybrid mark invented in 1962 combining an exclamation mark and a question mark into a single glyph (‽)?',
      options: ['Interrobang', 'Exclarative', 'Dubitatio', 'Ampersand'],
      answer: 'Interrobang',
      hint: 'Host Hint: Combines "interro-" (question) with "bang" (printers\' slang for exclamation point).'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
