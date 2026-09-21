/**
 * Trivia Questions: Food & Cuisine
 * Levels: Easy -> Extreme
 */
(function () {
  const questions = [
    {
      id: 'food_001',
      category: 'Food & Cuisine',
      subcategory: 'Cooking',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the primary ingredient in traditional guacamole?',
      options: ['Tomato', 'Avocado', 'Chickpeas', 'Cucumber'],
      answer: 'Avocado',
      hint: 'Host Hint: Creamy green fruit also called alligator pear.'
    },
    {
      id: 'food_002',
      category: 'Food & Cuisine',
      subcategory: 'World Food',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'Which country is universally recognized as the birthplace of pizza Margherita?',
      options: ['France', 'Italy', 'Greece', 'Spain'],
      answer: 'Italy',
      hint: 'Host Hint: Specifically invented in Naples with basil, mozzarella, and tomato.'
    },
    {
      id: 'food_003',
      category: 'Food & Cuisine',
      subcategory: 'Spices',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which spice, harvested from the stigma of the Crocus flower, is the most expensive in the world by weight?',
      options: ['Vanilla Bean', 'Cardamom', 'Saffron', 'Cinnamon Bark'],
      answer: 'Saffron',
      hint: 'Host Hint: Adds a vibrant yellow-orange color to paella and Persian rice.'
    },
    {
      id: 'food_004',
      category: 'Food & Cuisine',
      subcategory: 'Culinary History',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What chemical compound gives chili peppers their spicy heat and is measured on the Scoville scale?',
      options: ['Piperine', 'Capsaicin', 'Sinigrin', 'Allicin'],
      answer: 'Capsaicin',
      hint: 'Host Hint: Begins with "Caps-" like the genus Capsicum.'
    },
    {
      id: 'food_005',
      category: 'Food & Cuisine',
      subcategory: 'Gastronomy',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'Kopi Luwak, one of the world\'s priciest coffees, is processed by passing coffee cherries through the digestive tract of which animal?',
      options: ['Asian Palm Civet', 'Fruit Bat', 'Ruffed Lemur', 'Pangolin'],
      answer: 'Asian Palm Civet',
      hint: 'Host Hint: A small cat-like mammal native to Southeast Asia.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
