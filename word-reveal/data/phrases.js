/**
 * Word Reveal Mystery - Phrases & Prompts Dataset
 * Features progressive multi-tier hints and point values for streaming showdowns
 */
(function () {
  const PhrasesData = [
    // 🇯🇲 CARIBBEAN & JAMAICAN SLANG
    {
      phrase: 'WEH YUH A SEH',
      category: 'CARIBBEAN_SLANG',
      categoryLabel: '🇯🇲 CARIBBEAN SLANG',
      hintTier1: 'Classic Jamaican greeting asking what is going on',
      hintTier2: 'Equivalent to "What are you saying?" or "What\'s up?"',
      hintTier3: 'Starts with W, four words, rhymes with day',
      difficulty: 'EASY',
      points: 600
    },
    {
      phrase: 'MI DEH YA PON DI APP',
      category: 'CARIBBEAN_SLANG',
      categoryLabel: '🇯🇲 CARIBBEAN SLANG',
      hintTier1: 'Official Dionlyonee live stream phrase',
      hintTier2: 'Expressing presence right here on this interactive show',
      hintTier3: 'Begins with MI DEH YA...',
      difficulty: 'MEDIUM',
      points: 850
    },
    {
      phrase: 'EVERYTING IRIE',
      category: 'CARIBBEAN_SLANG',
      categoryLabel: '🇯🇲 CARIBBEAN SLANG',
      hintTier1: 'Rastafari peaceful sentiment meaning all is good',
      hintTier2: 'Two words: everything is alright and peaceful',
      hintTier3: 'First word is EVERYTING, second is IRIE',
      difficulty: 'EASY',
      points: 500
    },
    {
      phrase: 'PULL UP SELECTOR',
      category: 'CARIBBEAN_SLANG',
      categoryLabel: '🇯🇲 CARIBBEAN SLANG',
      hintTier1: 'Dancehall sound system call to restart the track',
      hintTier2: 'What the crowd shouts when the song is too good to let finish',
      hintTier3: 'Three words: PULL...',
      difficulty: 'MEDIUM',
      points: 750
    },
    {
      phrase: 'SMALL UP YUHSELF',
      category: 'CARIBBEAN_SLANG',
      categoryLabel: '🇯🇲 CARIBBEAN SLANG',
      hintTier1: 'What passengers hear on a crowded route taxi or bus',
      hintTier2: 'Make room so another person can squeeze into the seat',
      hintTier3: 'Opposite of "big up yourself"',
      difficulty: 'HARD',
      points: 900
    },
    {
      phrase: 'TOUCH DI ROAD',
      category: 'CARIBBEAN_SLANG',
      categoryLabel: '🇯🇲 CARIBBEAN SLANG',
      hintTier1: 'Getting ready to step outside or head into the street',
      hintTier2: 'Heading out for the night or starting a road journey',
      hintTier3: 'Three words: Touch...',
      difficulty: 'EASY',
      points: 550
    },
    {
      phrase: 'NUH WATCH NO FACE',
      category: 'CARIBBEAN_SLANG',
      categoryLabel: '🇯🇲 CARIBBEAN SLANG',
      hintTier1: 'Advice to focus on your own business without fearing haters',
      hintTier2: 'Mind your own lane and ignore onlookers',
      hintTier3: 'Four words: NUH WATCH...',
      difficulty: 'HARD',
      points: 1000
    },
    {
      phrase: 'DUTTY WINE',
      category: 'CARIBBEAN_SLANG',
      categoryLabel: '🇯🇲 CARIBBEAN SLANG',
      hintTier1: 'Legendary 2000s Jamaican dance craze created by Tony Matterhorn',
      hintTier2: 'High-energy head-spinning dancehall move',
      hintTier3: 'Two words: Dirty Wine in Patois',
      difficulty: 'EASY',
      points: 500
    },

    // 🤔 MOST LIKELY TO...
    {
      phrase: 'MOST LIKELY TO DROP THEIR PHONE IN WATER',
      category: 'MOST_LIKELY',
      categoryLabel: '🤔 MOST LIKELY TO',
      hintTier1: 'Accidental tech disaster by the pool or sink',
      hintTier2: 'Careless handheld gadget mishap',
      hintTier3: 'Eight words starting with MOST LIKELY TO DROP...',
      difficulty: 'EASY',
      points: 650
    },
    {
      phrase: 'MOST LIKELY TO FORGET THEIR OWN PASSWORD',
      category: 'MOST_LIKELY',
      categoryLabel: '🤔 MOST LIKELY TO',
      hintTier1: 'Locked out of your stream or laptop again',
      hintTier2: 'Hitting "Reset Password" every single week',
      hintTier3: 'Seven words ending in OWN PASSWORD',
      difficulty: 'MEDIUM',
      points: 750
    },
    {
      phrase: 'MOST LIKELY TO EAT ALL THE SNACKS BEFORE THE SHOW',
      category: 'MOST_LIKELY',
      categoryLabel: '🤔 MOST LIKELY TO',
      hintTier1: 'Green room munchies champion',
      hintTier2: 'Emptying the chip bags and sodas before stream goes live',
      hintTier3: 'Ten words beginning with MOST LIKELY TO EAT...',
      difficulty: 'HARD',
      points: 1100
    },
    {
      phrase: 'MOST LIKELY TO START DANCING IN PUBLIC',
      category: 'MOST_LIKELY',
      categoryLabel: '🤔 MOST LIKELY TO',
      hintTier1: 'When the beat drops in the grocery store aisle',
      hintTier2: 'No shame rhythm king or queen in the crowd',
      hintTier3: 'Ends with DANCING IN PUBLIC',
      difficulty: 'MEDIUM',
      points: 800
    },
    {
      phrase: 'MOST LIKELY TO BUY TICKETS LAST MINUTE',
      category: 'MOST_LIKELY',
      categoryLabel: '🤔 MOST LIKELY TO',
      hintTier1: 'Procrastinating until the event is almost sold out',
      hintTier2: 'Running to the gate five minutes before gate closure',
      hintTier3: 'Ends with TICKETS LAST MINUTE',
      difficulty: 'MEDIUM',
      points: 850
    },
    {
      phrase: 'MOST LIKELY TO SING WRONG LYRICS WITH CONFIDENCE',
      category: 'MOST_LIKELY',
      categoryLabel: '🤔 MOST LIKELY TO',
      hintTier1: 'Singing loud in the car without knowing the real words',
      hintTier2: 'Making up your own verse like nobody noticed',
      hintTier3: 'Ends with LYRICS WITH CONFIDENCE',
      difficulty: 'HARD',
      points: 1200
    },

    // 📺 STREAM LORE & CHAT BANTER
    {
      phrase: 'DROP A LIKE AND SUBSCRIBE',
      category: 'STREAM_LORE',
      categoryLabel: '📺 STREAM LORE',
      hintTier1: 'Every creator\'s favorite outro call to action',
      hintTier2: 'Smash the thumbs up button and join the squad',
      hintTier3: 'Starts with DROP A LIKE...',
      difficulty: 'EASY',
      points: 600
    },
    {
      phrase: 'SPAM THE EMOTES IN THE CHAT',
      category: 'STREAM_LORE',
      categoryLabel: '📺 STREAM LORE',
      hintTier1: 'What the streamer shouts during high-energy hype moments',
      hintTier2: 'Filling the chat feed with channel stickers and icons',
      hintTier3: 'Begins with SPAM THE EMOTES...',
      difficulty: 'MEDIUM',
      points: 800
    },
    {
      phrase: 'LET HIM COOK NOW',
      category: 'STREAM_LORE',
      categoryLabel: '📺 STREAM LORE',
      hintTier1: 'Internet meme phrase giving someone room to execute their plan',
      hintTier2: 'Hold on, wait and see what genius play he makes next',
      hintTier3: 'Four words: LET HIM...',
      difficulty: 'EASY',
      points: 500
    },
    {
      phrase: 'SOUND THE HORN SELECTOR',
      category: 'STREAM_LORE',
      categoryLabel: '📺 STREAM LORE',
      hintTier1: 'Air horn blast during soundclash or stream hype',
      hintTier2: 'Air horn siren button in the studio',
      hintTier3: 'Begins with SOUND THE HORN...',
      difficulty: 'MEDIUM',
      points: 750
    },
    {
      phrase: 'MASSIVE RAID INCOMING',
      category: 'STREAM_LORE',
      categoryLabel: '📺 STREAM LORE',
      hintTier1: 'When a fellow creator ends stream and sends their viewers over',
      hintTier2: 'Chat wave of new viewers flooding the broadcast',
      hintTier3: 'Three words: MASSIVE RAID...',
      difficulty: 'EASY',
      points: 600
    },

    // 🍲 CARIBBEAN FOOD & DRINKS
    {
      phrase: 'ACKEE AND SALTFISH WITH FRIED DUMPLING',
      category: 'CARIBBEAN_FOOD',
      categoryLabel: '🍲 CARIBBEAN FOOD',
      hintTier1: 'The official national breakfast dish of Jamaica',
      hintTier2: 'Yellow fruit cooked with seasoned cod and golden dough',
      hintTier3: 'Starts with ACKEE AND...',
      difficulty: 'HARD',
      points: 1100
    },
    {
      phrase: 'CURRY GOAT AND RICE AND PEAS',
      category: 'CARIBBEAN_FOOD',
      categoryLabel: '🍲 CARIBBEAN FOOD',
      hintTier1: 'Sunday dinner or wedding reception staple in the West Indies',
      hintTier2: 'Spiced meat simmering with coconut milk kidney beans and rice',
      hintTier3: 'Seven words starting with CURRY GOAT...',
      difficulty: 'MEDIUM',
      points: 850
    },
    {
      phrase: 'OXTAIL WITH BUTTER BEANS',
      category: 'CARIBBEAN_FOOD',
      categoryLabel: '🍲 CARIBBEAN FOOD',
      hintTier1: 'Tender braised beef delicacy with rich brown gravy',
      hintTier2: 'Served with large soft white beans over steamed rice',
      hintTier3: 'Four words: OXTAIL WITH...',
      difficulty: 'MEDIUM',
      points: 750
    },
    {
      phrase: 'BEEF PATTY WITH COCO BREAD',
      category: 'CARIBBEAN_FOOD',
      categoryLabel: '🍲 CARIBBEAN FOOD',
      hintTier1: 'The ultimate handheld lunchtime sandwich combo in Kingston',
      hintTier2: 'Golden flake pastry folded inside soft folded sweet bread',
      hintTier3: 'Five words: BEEF PATTY...',
      difficulty: 'EASY',
      points: 650
    },
    {
      phrase: 'ESCOVITCH FISH AND FESTIVAL',
      category: 'CARIBBEAN_FOOD',
      categoryLabel: '🍲 CARIBBEAN FOOD',
      hintTier1: 'Crispy fried red snapper topped with pickled onions & scotch bonnet',
      hintTier2: 'Served with sweet fried cornmeal fritters on the beach',
      hintTier3: 'Starts with ESCOVITCH FISH...',
      difficulty: 'HARD',
      points: 950
    },

    // 👑 DANCEHALL & REGGAE LEGENDS
    {
      phrase: 'ROBERT NESTA MARLEY',
      category: 'DANCEHALL_REGGAE',
      categoryLabel: '👑 REGGAE LEGENDS',
      hintTier1: 'Full birth name of the greatest reggae icon of all time',
      hintTier2: 'Honorable prophet of Nine Mile who sang "One Love"',
      hintTier3: 'Middle name is NESTA',
      difficulty: 'MEDIUM',
      points: 800
    },
    {
      phrase: 'WORLD BOSS ADIDJA PALMER',
      category: 'DANCEHALL_REGGAE',
      categoryLabel: '👑 REGGAE LEGENDS',
      hintTier1: 'Gaza emperor and most prolific dancehall lyricist from Portmore',
      hintTier2: 'Real name of Vybz Kartel with his famous moniker',
      hintTier3: 'Starts with WORLD BOSS ADIDJA...',
      difficulty: 'HARD',
      points: 1000
    },
    {
      phrase: 'KING OF THE DANCEHALL BEENIE MAN',
      category: 'DANCEHALL_REGGAE',
      categoryLabel: '👑 REGGAE LEGENDS',
      hintTier1: 'Veteran entertainer who sang "Who Am I" (Sim Simma)',
      hintTier2: 'Grammy winner known as Moses Davis',
      hintTier3: 'Ends with BEENIE MAN',
      difficulty: 'HARD',
      points: 950
    },
    {
      phrase: 'DUTTY ROCK SEAN PAUL',
      category: 'DANCEHALL_REGGAE',
      categoryLabel: '👑 REGGAE LEGENDS',
      hintTier1: 'Global superstar behind "Get Busy" and "Temperature"',
      hintTier2: 'Multi-platinum crossover icon with the signature sunglasses and buzzcut',
      hintTier3: 'Ends with SEAN PAUL',
      difficulty: 'EASY',
      points: 600
    },

    // 🎵 90s & 2000s R&B & HIP HOP
    {
      phrase: 'THE MISEDUCATION OF LAURYN HILL',
      category: 'RNB_HIPHOP',
      categoryLabel: '🎵 90s & 2000s R&B',
      hintTier1: 'Historic 1998 Grammy album of the year debut solo masterpiece',
      hintTier2: 'Featured "Doo Wop (That Thing)" and "Ex-Factor"',
      hintTier3: 'Begins with THE MISEDUCATION OF...',
      difficulty: 'HARD',
      points: 1050
    },
    {
      phrase: 'CONFESSIONS PART TWO BY USHER',
      category: 'RNB_HIPHOP',
      categoryLabel: '🎵 90s & 2000s R&B',
      hintTier1: 'Mega chart-topping 2004 ballad about a dramatic revelation',
      hintTier2: 'The signature track from Usher\'s diamond album',
      hintTier3: 'Five words: CONFESSIONS PART TWO...',
      difficulty: 'MEDIUM',
      points: 800
    },
    {
      phrase: 'CRAZY IN LOVE BY BEYONCE',
      category: 'RNB_HIPHOP',
      categoryLabel: '🎵 90s & 2000s R&B',
      hintTier1: 'Iconic horn intro with Jay-Z that defined the summer of 2003',
      hintTier2: 'Debut solo lead single from "Dangerously in Love"',
      hintTier3: 'Starts with CRAZY IN LOVE...',
      difficulty: 'EASY',
      points: 600
    },
    {
      phrase: 'CALIFORNIA LOVE WITH TUPAC AND DR DRE',
      category: 'RNB_HIPHOP',
      categoryLabel: '🎵 90s & 2000s HIP HOP',
      hintTier1: 'West Coast anthem with talkbox hook and Mad Max video',
      hintTier2: 'Death Row classic with Dr. Dre on the piano beat',
      hintTier3: 'Begins with CALIFORNIA LOVE...',
      difficulty: 'HARD',
      points: 1150
    },

    // 🎬 MOVIES & POP CULTURE
    {
      phrase: 'FEEL THE RHYTHM FEEL THE RHYME',
      category: 'MOVIES_CULTURE',
      categoryLabel: '🎬 MOVIES & TV',
      hintTier1: 'Chant from the famous 1993 Jamaican bobsled film "Cool Runnings"',
      hintTier2: '"Get on up, it\'s bobsled time!"',
      hintTier3: 'Seven words: FEEL THE RHYTHM...',
      difficulty: 'MEDIUM',
      points: 850
    },
    {
      phrase: 'BAD BOYS FOR LIFE',
      category: 'MOVIES_CULTURE',
      categoryLabel: '🎬 MOVIES & TV',
      hintTier1: 'Will Smith and Martin Lawrence action comedy catchphrase',
      hintTier2: '"We ride together, we die together"',
      hintTier3: 'Four words: BAD BOYS...',
      difficulty: 'EASY',
      points: 500
    },
    {
      phrase: 'WAKANDA FOREVER SALUTE',
      category: 'MOVIES_CULTURE',
      categoryLabel: '🎬 MOVIES & TV',
      hintTier1: 'Crossed arms chest gesture from Marvel\'s Black Panther',
      hintTier2: 'Tribute honoring King T\'Challa and Chadwick Boseman',
      hintTier3: 'Three words: WAKANDA FOREVER...',
      difficulty: 'EASY',
      points: 550
    },

    // 💡 PROVERBS & WORD RIDDLES
    {
      phrase: 'NO PRESSURE NO DIAMONDS',
      category: 'PROVERBS_RIDDLES',
      categoryLabel: '💡 PROVERBS & WISDOM',
      hintTier1: 'Hard challenges produce the most brilliant results',
      hintTier2: 'Extreme heat and weight underground create sparkling gems',
      hintTier3: 'Four words: NO PRESSURE...',
      difficulty: 'EASY',
      points: 550
    },
    {
      phrase: 'A BIRD IN THE HAND IS WORTH TWO IN THE BUSH',
      category: 'PROVERBS_RIDDLES',
      categoryLabel: '💡 PROVERBS & WISDOM',
      hintTier1: 'Appreciate what you already hold rather than risking it for more',
      hintTier2: 'Better to keep a certain prize than chase double uncertainty',
      hintTier3: 'Starts with A BIRD IN THE HAND...',
      difficulty: 'HARD',
      points: 1250
    },
    {
      phrase: 'PRESSURE BUSS PIPE',
      category: 'PROVERBS_RIDDLES',
      categoryLabel: '💡 PROVERBS & WISDOM',
      hintTier1: 'Caribbean proverbs explaining that tough times reveal what\'s inside',
      hintTier2: 'When tension builds up too high, something has to break',
      hintTier3: 'Three words: PRESSURE...',
      difficulty: 'MEDIUM',
      points: 750
    },
    {
      phrase: 'BETTER LATE THAN NEVER',
      category: 'PROVERBS_RIDDLES',
      categoryLabel: '💡 PROVERBS & WISDOM',
      hintTier1: 'Arriving eventually is better than not showing up at all',
      hintTier2: 'Showing up after the bell rings is still a pass',
      hintTier3: 'Four words: BETTER LATE...',
      difficulty: 'EASY',
      points: 500
    },
    {
      phrase: 'ACTION SPEAKS LOUDER THAN WORDS',
      category: 'PROVERBS_RIDDLES',
      categoryLabel: '💡 PROVERBS & WISDOM',
      hintTier1: 'What you actually do matters much more than what you claim',
      hintTier2: 'Don\'t just talk about it, show and prove',
      hintTier3: 'Five words: ACTION SPEAKS...',
      difficulty: 'MEDIUM',
      points: 750
    }
  ];

  window.PhrasesData = PhrasesData;
})();
