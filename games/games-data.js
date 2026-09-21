/**
 * Dionlyonee Playground - Registered Games Registry
 */
(function () {
  const GamesData = [
    {
      id: 'wheel',
      title: 'WHEEL OF FORTUNE',
      genre: 'Classic Word & Wheel Gameshow',
      icon: '🎡',
      accent: '#d4af37',
      desc: 'The complete broadcast Wheel experience. Live rotating 24-wedge wheel with realistic deceleration physics, 4-row TV puzzle board with letter reveals, contestant bank scores, and co-host phone companion.',
      links: {
        host: '/wheel/host/',
        cohost: '/wheel/cohost/',
        live: '/wheel/live/',
        waiting: '/wheel/waiting/'
      },
      features: ['24-Wedge Wheel Physics', 'Peg Sounds & Bankrupt/Lose', 'Co-Host Phone Buzzer', 'Dual-Screen Stage Mode']
    },
    {
      id: 'trivia',
      title: 'TRIVIA SHOWDOWN',
      genre: 'Speed Quiz & Buzzer Battle',
      icon: '⚡',
      accent: '#a855f7',
      desc: 'High-octane multi-tier trivia questions (Easy to Expert) with countdown timers, speed bonuses, live audience question cards, and phone buzzer triggers for contestant podiums.',
      links: {
        host: '/trivia/host/',
        cohost: '/trivia/cohost/',
        live: '/trivia/live/',
        waiting: '/trivia/waiting/'
      },
      features: ['Tiered Question Banks', 'Buzzer Lockout System', 'Live Reveal Animations', 'Speed Timer SFX']
    },
    {
      id: 'jeopardy',
      title: 'DION JEOPARDY',
      genre: 'Grid Trivia & Daily Doubles',
      icon: '🟦',
      accent: '#0284c7',
      desc: 'Full 5-column TV Jeopardy grid with dollar values ($200 - $1,000), host clue reader, live clue unveilings, contestant buzzer queues, Daily Doubles, and Final Jeopardy.',
      links: {
        host: '/jeopardy/host/',
        cohost: '/jeopardy/cohost/',
        live: '/jeopardy/live/',
        waiting: '/jeopardy/waiting/'
      },
      features: ['Interactive 25-Clue Board', 'Host Answer Sheet', 'Live Podium Scores', 'Daily Double Wagers']
    },
    {
      id: 'word-reveal',
      title: 'WORD REVEAL & MOST LIKELY',
      genre: 'Letter Reveal & Social Chat Guess',
      icon: '🔤',
      accent: '#10b981',
      desc: 'Dynamic word and phrase reveal engine. Uncover letters progressively, trigger clues, tally chat votes, and play hilarious "Most Likely To" stream social games with the audience.',
      links: {
        host: '/word-reveal/host/',
        cohost: '/word-reveal/cohost/',
        live: '/word-reveal/live/',
        waiting: '/word-reveal/waiting/'
      },
      features: ['Progressive Letter Flips', 'Clue & Hint Engine', 'Vote Counter', 'Social Stream Prompts']
    },
    {
      id: 'speak-out',
      title: 'DIONLYONEE SPEAK OUT!',
      genre: 'Live Speaking & Rapid Stream Challenge',
      icon: '🎤',
      accent: '#f59e0b',
      status: 'ready',
      desc: 'Fast-paced live stream speaking challenge with 650+ stream-tested prompts. Eliminate dead air with Tongue Twisters, Rapid Fire, Forbidden Words, Voice Challenges, Keep Talking, and Finish the Phrase.',
      links: {
        host: '/speak-out/host/',
        cohost: '/speak-out/cohost/',
        live: '/speak-out/live/',
        waiting: '/speak-out/waiting/'
      },
      features: ['650+ Dynamic Challenges', '7 Game Modes', 'Hot Streak Multipliers', 'Zero Dead Air Timer']
    }
  ];

  window.GamesData = GamesData;
})();
