/**
 * Education Categories Metadata
 * Dionlyonee Stream Trivia
 */
(function () {
  const EducationCategories = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: '📐',
      subcategories: [
        'Basic Math', 'Addition', 'Subtraction', 'Multiplication', 'Division',
        'Fractions', 'Decimals', 'Percentages', 'PEMDAS', 'Algebra', 'Geometry', 'Word Problems'
      ]
    },
    {
      id: 'english',
      name: 'English & Language Arts',
      icon: '📖',
      subcategories: [
        'Grammar', 'Spelling', 'Vocabulary', 'Reading Comprehension',
        'Punctuation', 'Parts of Speech', 'Synonyms', 'Antonyms', 'Writing'
      ]
    },
    {
      id: 'science',
      name: 'Science & Cosmos',
      icon: '🔬',
      subcategories: [
        'General Science', 'Earth Science', 'Biology', 'Chemistry',
        'Physics', 'Astronomy', 'Weather', 'Environment', 'Animals Science'
      ]
    },
    {
      id: 'social-studies',
      name: 'Social Studies & Civics',
      icon: '🏛️',
      subcategories: [
        'History', 'Geography', 'Government', 'Civics', 'Economics',
        'World History', 'US History', 'Cultures'
      ]
    }
  ];

  window.EducationCategories = EducationCategories;
})();
