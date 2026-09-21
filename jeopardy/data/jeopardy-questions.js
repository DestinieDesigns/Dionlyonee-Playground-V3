/**
 * Jeopardy Clues & Questions Dataset
 */
(function () {
  const JeopardyQuestions = window.jeopardyData || [
    {
      category: 'RAP ROYALTY',
      clues: [
        { value: 200, clue: 'This Brooklyn legend declared "It was all a dream" in his 1994 breakout anthem "Juicy".', answer: 'Who is The Notorious B.I.G. (Biggie)?' },
        { value: 400, clue: 'His album "good kid, m.A.A.d city" cemented this Compton poet as a generational icon.', answer: 'Who is Kendrick Lamar?' },
        { value: 600, clue: 'This Queensbridge storyteller chronicled street life on his 1994 masterpiece "Illmatic".', answer: 'Who is Nas?' },
        { value: 800, clue: 'This Atlanta duo composed of André 3000 and Big Boi revolutionized southern hip-hop.', answer: 'Who is OutKast?' },
        { value: 1000, clue: 'Before Roc-A-Fella, this rap titan sold CDs out of his car in Marcy Projects.', answer: 'Who is Jay-Z?' }
      ]
    },
    {
      category: 'GAMING LORE',
      clues: [
        { value: 200, clue: 'This spartan soldier became the Ghost of Sparta after being deceived by Ares.', answer: 'Who is Kratos?' },
        { value: 400, clue: 'The primary currency used throughout the Kingdom of Hyrule in The Legend of Zelda.', answer: 'What are Rupees?' },
        { value: 600, clue: 'In Minecraft, crafting an enchantment table requires obsidian, diamonds, and this item.', answer: 'What is a Book?' },
        { value: 800, clue: 'This iconic Konami cheat code begins with Up, Up, Down, Down, Left, Right, Left, Right.', answer: 'What is B, A (Start)?' },
        { value: 1000, clue: 'The original working title for Nintendo\'s GameCube during its early development.', answer: 'What is Project Dolphin?' }
      ]
    },
    {
      category: 'STREAM CHAOS',
      clues: [
        { value: 200, clue: 'This feature allows viewers to highlight their chats with colorful paid super stickers.', answer: 'What are Super Chats / Bits?' },
        { value: 400, clue: 'A sudden wave of enthusiastic viewers directed from one live creator to another.', answer: 'What is a Raid / Host?' },
        { value: 600, clue: 'The classic streamer reaction phrase when an audio device deafens the audience.', answer: 'What is "Loud is funny" / Headphone Warning?' },
        { value: 800, clue: 'This green surface allows broadcasters to replace their room backdrop with graphics.', answer: 'What is a Chroma Key / Green Screen?' },
        { value: 1000, clue: 'The technical term for dropped network video packets during a live broadcast.', answer: 'What is Frame Loss / Bitrate Drop?' }
      ]
    },
    {
      category: 'MOVIE MAGIC',
      clues: [
        { value: 200, clue: 'This 1997 James Cameron epic featured Jack and Rose aboard an ill-fated luxury ship.', answer: 'What is Titanic?' },
        { value: 400, clue: 'He voiced the wisecracking Genie in Disney\'s animated 1992 classic Aladdin.', answer: 'Who is Robin Williams?' },
        { value: 600, clue: 'This Wachowski sci-fi masterpiece asked Keanu Reeves to pick red or blue pills.', answer: 'What is The Matrix?' },
        { value: 800, clue: 'The top-grossing movie of all time worldwide, set on the alien moon Pandora.', answer: 'What is Avatar?' },
        { value: 1000, clue: 'The real-world year Marty McFly traveled to in Back to the Future Part II.', answer: 'What is 2015?' }
      ]
    },
    {
      category: 'WORLD RECORDS',
      clues: [
        { value: 200, clue: 'This Jamaican sprint king holds the 100m world record at 9.58 seconds.', answer: 'Who is Usain Bolt?' },
        { value: 400, clue: 'The tallest building on planet Earth, piercing the skies of Dubai at 828 meters.', answer: 'What is the Burj Khalifa?' },
        { value: 600, clue: 'The deepest known oceanic trench on Earth, plunging nearly 36,000 feet down.', answer: 'What is the Mariana Trench?' },
        { value: 800, clue: 'The largest living land animal currently walking on Earth.', answer: 'What is the African Bush Elephant?' },
        { value: 1000, clue: 'The first artificial satellite successfully launched into orbit in 1957.', answer: 'What is Sputnik 1?' }
      ]
    }
  ];

  window.JeopardyQuestions = JeopardyQuestions;
})();
