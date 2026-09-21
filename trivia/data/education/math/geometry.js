/**
 * Trivia Questions: Geometry
 */
(function () {
  const questions = [
    {
      id: 'math_geo_001',
      category: 'Mathematics',
      subcategory: 'Geometry',
      difficulty: 'easy',
      tier: 'easy',
      points: 100,
      question: 'What is the perimeter of a rectangle with length 8 cm and width 5 cm?',
      options: ['13 cm', '26 cm', '40 cm', '48 cm'],
      answer: '26 cm',
      hint: 'Host Hint: 2 * (8 + 5) = 26.'
    },
    {
      id: 'math_geo_002',
      category: 'Mathematics',
      subcategory: 'Geometry',
      difficulty: 'medium',
      tier: 'medium',
      points: 200,
      question: 'According to the Pythagorean Theorem, if a right triangle has legs of length 3 and 4, what is the hypotenuse?',
      options: ['5', '6', '7', '8'],
      answer: '5',
      hint: 'Host Hint: 3^2 + 4^2 = 9 + 16 = 25, sqrt(25) = 5.'
    },
    {
      id: 'math_geo_003',
      category: 'Mathematics',
      subcategory: 'Geometry',
      difficulty: 'hard',
      tier: 'hard',
      points: 300,
      question: 'What is the sum of the interior angles of a regular hexagon (6-sided polygon)?',
      options: ['540 degrees', '720 degrees', '900 degrees', '1080 degrees'],
      answer: '720 degrees',
      hint: 'Host Hint: (n - 2) * 180 = (6 - 2) * 180 = 720.'
    },
    {
      id: 'math_geo_004',
      category: 'Mathematics',
      subcategory: 'Geometry',
      difficulty: 'expert',
      tier: 'expert',
      points: 500,
      question: 'What is the surface area of a sphere with radius r?',
      options: ['2 * pi * r', 'pi * r^2', '4 * pi * r^2', '(4/3) * pi * r^3'],
      answer: '4 * pi * r^2',
      hint: 'Host Hint: Four times the area of its great circle.'
    },
    {
      id: 'math_geo_005',
      category: 'Mathematics',
      subcategory: 'Geometry',
      difficulty: 'extreme',
      tier: 'extreme',
      points: 1000,
      question: 'According to Euler\'s polyhedral formula for any convex polyhedron, V - E + F (Vertices - Edges + Faces) always equals what constant?',
      options: ['0', '1', '2', '4'],
      answer: '2',
      hint: 'Host Hint: Test a cube: 8 vertices - 12 edges + 6 faces = 2.'
    }
  ];

  if (window.TriviaHelpers) {
    window.TriviaHelpers.addQuestions(questions);
  } else {
    window.TriviaDataStore = (window.TriviaDataStore || []).concat(questions);
  }
})();
