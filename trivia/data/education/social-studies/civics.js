/**
 * Trivia Questions: Social Studies - Civics
 */
(function () {
  const questions = [
    {
      id: 'ss_civ_001',
      category: 'Social Studies',
      subcategory: 'Civics',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the primary civic duty and democratic right through which citizens select their government leaders?',
      options: ['Voting in elections', 'Paying tolls', 'Attending parades', 'Filing patents'],
      answer: 'Voting in elections',
      hint: 'Host Hint: Exercised at the ballot box.'
    },
    {
      id: 'ss_civ_002',
      category: 'Social Studies',
      subcategory: 'Civics',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'What are the first ten amendments to the United States Constitution collectively called?',
      options: ['The Articles of Confederation', 'The Bill of Rights', 'The Magna Carta', 'The Federalist Papers'],
      answer: 'The Bill of Rights',
      hint: 'Host Hint: Guarantees essential freedoms such as speech, religion, and trial by jury.'
    },
    {
      id: 'ss_civ_003',
      category: 'Social Studies',
      subcategory: 'Civics',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What mandatory civic obligation requires summoned citizens to serve as sworn arbiters in a court trial?',
      options: ['Jury Duty', 'Military Conscription', 'Public Notary', 'Census Canvassing'],
      answer: 'Jury Duty',
      hint: 'Host Hint: Deliberating on criminal or civil verdicts as a jury of peers.'
    },
    {
      id: 'ss_civ_004',
      category: 'Social Studies',
      subcategory: 'Civics',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'Which landmark 1954 U.S. Supreme Court decision unanimously struck down the "separate but equal" doctrine in public education?',
      options: ['Brown v. Board of Education', 'Plessy v. Ferguson', 'Marbury v. Madison', 'Roe v. Wade'],
      answer: 'Brown v. Board of Education',
      hint: 'Host Hint: Overturned Plessy v. Ferguson and mandated school desegregation.'
    },
    {
      id: 'ss_civ_005',
      category: 'Social Studies',
      subcategory: 'Civics',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'In international law and political philosophy, what Latin doctrine determines citizenship based strictly on the place or soil of a person’s birth, as opposed to bloodline (jus sanguinis)?',
      options: ['Jus soli', 'Jus gentium', 'Jus cogens', 'Lex loci'],
      answer: 'Jus soli',
      hint: 'Host Hint: Latin for "right of the soil" (birthright citizenship).'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
