/**
 * Trivia Questions: Writing & Rhetoric
 */
(function () {
  const questions = [
    {
      id: 'eng_wri_001',
      category: 'English & Literature',
      subcategory: 'Writing',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the sentence that introduces the main topic or central idea of a paragraph called?',
      options: ['Topic Sentence', 'Transition Sentence', 'Conclusion', 'Hook'],
      answer: 'Topic Sentence',
      hint: 'Host Hint: Usually placed at the very start of the paragraph.'
    },
    {
      id: 'eng_wri_002',
      category: 'English & Literature',
      subcategory: 'Writing',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'In an argumentative essay, what is the core statement summarizing the author\'s main claim called?',
      options: ['Thesis Statement', 'Epilogue', 'Anecdote', 'Disclaimer'],
      answer: 'Thesis Statement',
      hint: 'Host Hint: Typically found at the end of the introductory paragraph.'
    },
    {
      id: 'eng_wri_003',
      category: 'English & Literature',
      subcategory: 'Writing',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which of the three classical Aristotelian rhetorical appeals appeals directly to emotions and empathy?',
      options: ['Pathos', 'Ethos', 'Logos', 'Kairos'],
      answer: 'Pathos',
      hint: 'Host Hint: Related to words like sympathy, empathy, and pathetic.'
    },
    {
      id: 'eng_wri_004',
      category: 'English & Literature',
      subcategory: 'Writing',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What rhetorical device involves repeating a sequence of words at the beginnings of neighboring clauses (e.g., "I have a dream...")?',
      options: ['Anaphora', 'Epistrophe', 'Chiasmus', 'Polysyndeton'],
      answer: 'Anaphora',
      hint: 'Host Hint: From the Greek for "carrying back".'
    },
    {
      id: 'eng_wri_005',
      category: 'English & Literature',
      subcategory: 'Writing',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What rhetorical figure reverses the grammatical structures or concepts in the second of two parallel clauses (e.g., "Ask not what your country can do for you — ask what you can do for your country")?',
      options: ['Chiasmus', 'Zeugma', 'Litotes', 'Synecdoche'],
      answer: 'Chiasmus',
      hint: 'Host Hint: Named after the Greek letter Chi (X), representing a criss-cross pattern.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
