/**
 * Trivia Questions: Social Studies - History
 */
(function () {
  const questions = [
    {
      id: 'ss_hist_001',
      category: 'Social Studies',
      subcategory: 'History',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Who was the famous civil rights leader who delivered the historic "I Have a Dream" speech in Washington, D.C. in 1963?',
      options: ['Martin Luther King Jr.', 'Malcolm X', 'John Lewis', 'Frederick Douglass'],
      answer: 'Martin Luther King Jr.',
      hint: 'Host Hint: Delivered at the Lincoln Memorial during the March on Washington.'
    },
    {
      id: 'ss_hist_002',
      category: 'Social Studies',
      subcategory: 'History',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'The Industrial Revolution originated during the mid-18th century in which country?',
      options: ['United States', 'Great Britain', 'Germany', 'France'],
      answer: 'Great Britain',
      hint: 'Host Hint: Driven by coal, the steam engine, and British textile mills.'
    },
    {
      id: 'ss_hist_003',
      category: 'Social Studies',
      subcategory: 'History',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'The assassination of Archduke Franz Ferdinand in Sarajevo in June 1914 directly triggered which global conflict?',
      options: ['Crimean War', 'World War I', 'Franco-Prussian War', 'World War II'],
      answer: 'World War I',
      hint: 'Host Hint: The Great War lasting from 1914 to 1918.'
    },
    {
      id: 'ss_hist_004',
      category: 'Social Studies',
      subcategory: 'History',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'The Peace of Westphalia signed in 1648 concluded which devastating European religious conflict and established the modern concept of state sovereignty?',
      options: ['Seven Years\' War', 'Thirty Years\' War', 'Hundred Years\' War', 'War of the Spanish Succession'],
      answer: 'Thirty Years\' War',
      hint: 'Host Hint: Fought primarily across Central Europe between Catholic and Protestant factions from 1618 to 1648.'
    },
    {
      id: 'ss_hist_005',
      category: 'Social Studies',
      subcategory: 'History',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In 1804, which Caribbean nation became the first independent republic of black-majority rule in the Americas and the first country to abolish slavery through revolution?',
      options: ['Cuba', 'Haiti', 'Jamaica', 'Dominican Republic'],
      answer: 'Haiti',
      hint: 'Host Hint: Led by Toussaint Louverture and Jean-Jacques Dessalines against Napoleon\'s French forces.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
