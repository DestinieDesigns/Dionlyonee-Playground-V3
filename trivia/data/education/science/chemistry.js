/**
 * Trivia Questions: Chemistry
 */
(function () {
  const questions = [
    {
      id: 'sci_chem_001',
      category: 'Science',
      subcategory: 'Chemistry',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the atomic number of Hydrogen, the lightest element on the periodic table?',
      options: ['1', '2', '6', '8'],
      answer: '1',
      hint: 'Host Hint: Has only one proton in its nucleus.'
    },
    {
      id: 'sci_chem_002',
      category: 'Science',
      subcategory: 'Chemistry',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What is the pH value of a completely neutral aqueous solution at 25 degrees Celsius?',
      options: ['0', '5', '7', '14'],
      answer: '7',
      hint: 'Host Hint: Pure distilled water sits right in the middle of 0 and 14.'
    },
    {
      id: 'sci_chem_003',
      category: 'Science',
      subcategory: 'Chemistry',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'Which noble gas glows with a distinctive reddish-orange light when ionized in high-voltage electric discharge signs?',
      options: ['Argon', 'Neon', 'Helium', 'Xenon'],
      answer: 'Neon',
      hint: 'Host Hint: Gave its name to all vintage glowing advertising signs.'
    },
    {
      id: 'sci_chem_004',
      category: 'Science',
      subcategory: 'Chemistry',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Avogadro\'s number defines the number of constituent particles in one mole of substance. What is its standard scientific value?',
      options: ['6.022 x 10^23', '3.141 x 10^21', '9.807 x 10^24', '1.602 x 10^-19'],
      answer: '6.022 x 10^23',
      hint: 'Host Hint: Celebrated on "Mole Day" on October 23 (10/23).'
    },
    {
      id: 'sci_chem_005',
      category: 'Science',
      subcategory: 'Chemistry',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In coordinate chemistry, what is EDTA (ethylenediaminetetraacetic acid) classified as due to its ability to bind to a central metal ion with six donor atoms?',
      options: ['Hexadentate ligand', 'Bidentate chelate', 'Monodentate Lewis base', 'Bridging ambidentate'],
      answer: 'Hexadentate ligand',
      hint: 'Host Hint: "Hexa-" meaning six "teeth" clutching the metal.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
