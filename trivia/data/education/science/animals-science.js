/**
 * Trivia Questions: Animals Science & Zoology
 */
(function () {
  const questions = [
    {
      id: 'sci_ani_001',
      category: 'Science',
      subcategory: 'Animals Science',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'Animals that regulate their internal body temperature internally and are warm-blooded are scientifically referred to as what?',
      options: ['Endotherms', 'Ectotherms', 'Poikilotherms', 'Amphibians'],
      answer: 'Endotherms',
      hint: 'Host Hint: Mammals and birds maintain constant internal heat.'
    },
    {
      id: 'sci_ani_002',
      category: 'Science',
      subcategory: 'Animals Science',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What biological phylum do insects, spiders, crabs, and centipedes belong to, characterized by jointed appendages and an exoskeleton?',
      options: ['Arthropoda', 'Mollusca', 'Chordata', 'Annelida'],
      answer: 'Arthropoda',
      hint: 'Host Hint: Greek for "jointed feet".'
    },
    {
      id: 'sci_ani_003',
      category: 'Science',
      subcategory: 'Animals Science',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Monotremes are a rare order of mammals that possess what unusual reproductive trait?',
      options: ['They lay eggs instead of giving live birth', 'They reproduce asexually', 'They undergo metamorphosis like frogs', 'They have no milk glands'],
      answer: 'They lay eggs instead of giving live birth',
      hint: 'Host Hint: Platypus and echidnas are the only surviving examples.'
    },
    {
      id: 'sci_ani_004',
      category: 'Science',
      subcategory: 'Animals Science',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'In ethology, what is the specialized form of animal communication in honeybees discovered by Karl von Frisch that indicates distance and direction to nectar?',
      options: ['The Waggle Dance', 'Stridulation', 'Pheromone Trail', 'Echolocation Pulse'],
      answer: 'The Waggle Dance',
      hint: 'Host Hint: A figure-eight vibration pattern oriented relative to the sun.'
    },
    {
      id: 'sci_ani_005',
      category: 'Science',
      subcategory: 'Animals Science',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'What is the name of the specialized oxygen-binding respiratory pigment giving horseshoe crab blood its distinct blue color when oxygenated?',
      options: ['Hemocyanin', 'Hemoglobin', 'Chlorocruorin', 'Hemerythrin'],
      answer: 'Hemocyanin',
      hint: 'Host Hint: Uses copper ions rather than iron to bind oxygen.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
