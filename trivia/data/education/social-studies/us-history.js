/**
 * Trivia Questions: Social Studies - US History
 */
(function () {
  const questions = [
    {
      id: 'ss_us_001',
      category: 'Social Studies',
      subcategory: 'US History',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'In what year was the United States Declaration of Independence adopted in Philadelphia?',
      options: ['1492', '1776', '1789', '1812'],
      answer: '1776',
      hint: 'Host Hint: Celebrated every Fourth of July.'
    },
    {
      id: 'ss_us_002',
      category: 'Social Studies',
      subcategory: 'US History',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Which U.S. President issued the Emancipation Proclamation during the American Civil War?',
      options: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'Ulysses S. Grant'],
      answer: 'Abraham Lincoln',
      hint: 'Host Hint: The 16th President of the United States.'
    },
    {
      id: 'ss_us_003',
      category: 'Social Studies',
      subcategory: 'US History',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which 1803 land deal between the United States and France doubled the geographic size of the young nation?',
      options: ['The Louisiana Purchase', 'The Gadsden Purchase', 'The Alaska Purchase', 'The Treaty of Paris'],
      answer: 'The Louisiana Purchase',
      hint: 'Host Hint: Negotiated under President Thomas Jefferson for $15 million.'
    },
    {
      id: 'ss_us_004',
      category: 'Social Studies',
      subcategory: 'US History',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which constitutional amendment ratified in 1920 guaranteed American women the constitutional right to vote?',
      options: ['15th Amendment', '18th Amendment', '19th Amendment', '21st Amendment'],
      answer: '19th Amendment',
      hint: 'Host Hint: Culmination of the women\'s suffrage movement led by Susan B. Anthony and Alice Paul.'
    },
    {
      id: 'ss_us_005',
      category: 'Social Studies',
      subcategory: 'US History',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In the controversial U.S. presidential election of 1876 between Rutherford B. Hayes and Samuel Tilden, what informal congressional bargain effectively ended Reconstruction in the South?',
      options: ['Compromise of 1877', 'Missouri Compromise', 'Crittenden Compromise', 'Albany Regency Pact'],
      answer: 'Compromise of 1877',
      hint: 'Host Hint: Federal troops were withdrawn from the remaining Southern states in exchange for Hayes taking the White House.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
