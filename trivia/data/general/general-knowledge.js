/**
 * Trivia Questions: General Knowledge
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'gen_001',
      category: 'General Knowledge',
      subcategory: 'General Knowledge',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'How many days are in a leap year?',
      options: ['364', '365', '366', '367'],
      answer: '366',
      hint: 'Host Hint: February gets an extra 29th day in this year.'
    },
    {
      id: 'gen_002',
      category: 'General Knowledge',
      subcategory: 'General Knowledge',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Which primary color mixed with red makes purple?',
      options: ['Yellow', 'Blue', 'Green', 'Orange'],
      answer: 'Blue',
      hint: 'Host Hint: It rhymes with clue and shoe.'
    },
    {
      id: 'gen_003',
      category: 'General Knowledge',
      subcategory: 'General Knowledge',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the standard unit of currency used in Japan?',
      options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
      answer: 'Yen',
      hint: 'Host Hint: Represented by the symbol ¥ and begins with Y.'
    },
    {
      id: 'gen_004',
      category: 'General Knowledge',
      subcategory: 'General Knowledge',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'In Roman numerals, what number is represented by the letter "D"?',
      options: ['50', '100', '500', '1000'],
      answer: '500',
      hint: 'Host Hint: It is exactly half of Roman numeral M.'
    },
    {
      id: 'gen_005',
      category: 'General Knowledge',
      subcategory: 'General Knowledge',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is the only country in the world that does not have a rectangular or square national flag?',
      options: ['Switzerland', 'Nepal', 'Vatican City', 'Bhutan'],
      answer: 'Nepal',
      hint: 'Host Hint: Himalayan nation whose double pennant flag looks like stacked triangles.'
    },
    {
      id: 'gen_006',
      category: 'General Knowledge',
      subcategory: 'General Knowledge',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the term for a word or phrase formed by rearranging the letters of another, such as "cinema" into "iceman"?',
      options: ['Portmanteau', 'Palindrome', 'Anagram', 'Heteronym'],
      answer: 'Anagram',
      hint: 'Host Hint: Not reading backwards (palindrome), but scrambling the letters.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
