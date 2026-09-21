/**
 * Trivia Questions: Biology
 */
(function () {
  const questions = [
    {
      id: 'sci_bio_001',
      category: 'Science',
      subcategory: 'Biology',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What green pigment in plant leaves absorbs sunlight for photosynthesis?',
      options: ['Carotene', 'Chlorophyll', 'Melanin', 'Anthocyanin'],
      answer: 'Chlorophyll',
      hint: 'Host Hint: Located inside chloroplasts.'
    },
    {
      id: 'sci_bio_002',
      category: 'Science',
      subcategory: 'Biology',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'How many chromosomes are found in a typical healthy human somatic cell?',
      options: ['23', '46', '48', '92'],
      answer: '46',
      hint: 'Host Hint: 23 pairs inherited from both parents.'
    },
    {
      id: 'sci_bio_003',
      category: 'Science',
      subcategory: 'Biology',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which of the four nucleotide bases in DNA pairs with Adenine through two hydrogen bonds?',
      options: ['Cytosine', 'Guanine', 'Thymine', 'Uracil'],
      answer: 'Thymine',
      hint: 'Host Hint: In RNA it is replaced by Uracil; in DNA it is Thymine (A-T).'
    },
    {
      id: 'sci_bio_004',
      category: 'Science',
      subcategory: 'Biology',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What enzyme family is responsible for unwinding and separating the double-stranded DNA helix ahead of the replication fork?',
      options: ['DNA Polymerase', 'Helicase', 'Ligase', 'Topoisomerase'],
      answer: 'Helicase',
      hint: 'Host Hint: Unzips the double helix like a zipper.'
    },
    {
      id: 'sci_bio_005',
      category: 'Science',
      subcategory: 'Biology',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In cellular metabolic respiration, what is the net yield of ATP molecules produced strictly from substrate-level phosphorylation during one cycle of glycolysis?',
      options: ['2 ATP', '4 ATP', '32 ATP', '38 ATP'],
      answer: '2 ATP',
      hint: 'Host Hint: 4 are generated, but 2 are consumed in the investment phase, leaving a net of 2.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
