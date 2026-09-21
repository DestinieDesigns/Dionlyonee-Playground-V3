/**
 * Dionlyonee Playground - Stream Games Content Registry
 * Rich prompt banks for all live chat and stream games
 */
(function () {
  const StreamGamesData = {
    'finish-the-sentence': {
      title: 'FINISH THE SENTENCE',
      badge: '😂 CHAT CREATIVE',
      icon: '😂',
      type: 'CHAT GAME',
      description: 'Host reads the prompt setup, chat finishes the punchline!',
      prompts: [
        { setup: "I knew the date was officially over when they...", category: "DATING DISASTERS" },
        { setup: "The real reason I showed up 45 minutes late was...", category: "LAME EXCUSES" },
        { setup: "Never trust anyone who unironically puts ketchup on...", category: "FOOD CRIMES" },
        { setup: "If you look closely at my bank account, 90% of it went to...", category: "BAD SPENDING" },
        { setup: "My biggest red flag that I refuse to fix is...", category: "RED FLAGS" },
        { setup: "The fastest way to start a family argument at Thanksgiving is...", category: "HOLIDAY CHAOS" },
        { setup: "I don't need therapy, I just need...", category: "STREAM CONFESSIONS" },
        { setup: "The most embarrassing thing currently in my search history is...", category: "CONFESSIONS" },
        { setup: "You know you're getting old when your favorite part of Friday night is...", category: "GROWING UP" },
        { setup: "If my FBI agent saw what I did today, they would...", category: "INTERNET CHAOS" },
        { setup: "My toxic trait is thinking I could easily survive...", category: "DELUSIONS" },
        { setup: "The worst piece of unsolicited advice I've ever received was...", category: "BAD ADVICE" },
        { setup: "If I was banned from the stream, it would definitely be for...", category: "CHAT WILDIN" },
        { setup: "You can tell someone has never worked in retail because they...", category: "WORK STORIES" },
        { setup: "The one thing keeping me going this week is pure...", category: "DAILY STRUGGLE" }
      ]
    },

    'what-would-you-do': {
      title: 'WHAT WOULD YOU DO?',
      badge: '🤔 MORAL DILEMMAS',
      icon: '🤔',
      type: 'CHAT CREATIVE',
      description: 'Wild moral, financial, and survival dilemmas for the stream to debate!',
      prompts: [
        { scenario: "You find a bag with $25,000 in unmarked cash in the back of an Uber. No cameras, driver didn't notice.", options: ["Keep every dollar", "Return it to the driver", "Split it 50/50 with chat"], category: "FINANCIAL" },
        { scenario: "Your best friend's fiancé tries to hit on you in 4K at a party. The wedding is in 48 hours.", options: ["Expose them immediately with proof", "Tell your friend in private", "Stay out of the drama"], category: "RELATIONSHIP" },
        { scenario: "You have 60 seconds to spend $1,000,000 right now or forfeit the entire bag forever. No stocks or savings.", options: ["Buy real estate instantly", "Clear entire family debt", "Spend it on wildest luxury items"], category: "HIGH STAKES" },
        { scenario: "You accidentally see your boss's private email draft planning to fire your closest work coworker next week.", options: ["Warn your friend immediately", "Stay silent to keep your job", "Help them find a backup job silently"], category: "CAREER" },
        { scenario: "You are given immortality, but a radioactive snail is perpetually moving toward you. If it touches you, you're done.", options: ["Trap the snail in titanium sphere", "Fly to another continent every year", "Decline the immortality"], category: "SURVIVAL" },
        { scenario: "You get access to anyone's DMs in the world for 10 minutes, but they get a notification that you read them.", options: ["Check your partner / crush", "Check a celebrity / politician", "Close the app and walk away"], category: "DRAMA" },
        { scenario: "Every time you sneeze, a random person within 10 feet gets slapped in the face invisibly.", options: ["Carry pepper spray everywhere", "Warn everyone you meet", "Just sneeze and apologize"], category: "COMEDY" },
        { scenario: "You are offered $500,000 cash, but you can never use a smartphone, tablet, or PC for the rest of your life.", options: ["Take the money and live off the grid", "Decline the offer immediately"], category: "TECH DILEMMA" }
      ]
    },

    'who-would-you-pick': {
      title: 'WHO WOULD YOU PICK?',
      badge: '👑 DRAFT SHOWDOWN',
      icon: '👑',
      type: 'CHAT CREATIVE',
      description: 'Head-to-head celebrity, character, and streamer draft choices!',
      prompts: [
        { question: "Who would you pick to survive a zombie apocalypse bunker with you?", choices: ["The Rock", "Batman", "Gordon Ramsay", "Keanu Reeves"], category: "SURVIVAL DRAFT" },
        { question: "Who would you pick to defend you in a high-stakes court trial?", choices: ["Saul Goodman", "Harvey Specter", "Elle Woods", "Judge Judy"], category: "LEGAL BATTLE" },
        { question: "Who would you pick to cook your final meal on Earth?", choices: ["Gordon Ramsay", "Your Grandma", "Guy Fieri", "Snoop Dogg"], category: "FOOD DRAFT" },
        { question: "Who would you pick as your getaway driver in a heist?", choices: ["Vin Diesel (Dom)", "Baby Driver", "Ryan Gosling (Drive)", "Lightning McQueen"], category: "ESCAPE DRAFT" },
        { question: "Who would you pick to lend you $5,000 with zero interest and no rush?", choices: ["MrBeast", "Shaq", "Your Richest Friend", "Elon Musk"], category: "FINANCE DRAFT" },
        { question: "Who would you pick to plan your surprise birthday weekend?", choices: ["Drake", "Cardi B", "Kevin Hart", "Zendaya"], category: "PARTY DRAFT" }
      ]
    },

    'emoji-guess': {
      title: 'EMOJI GUESS',
      badge: '👀 PUZZLE DECODER',
      icon: '👀',
      type: 'GUESSING',
      description: 'Decode the movie, song, or celebrity hidden behind the emoji combo!',
      prompts: [
        { emojis: "🦁 👑", answer: "THE LION KING", hint: "Disney Animation Classic", category: "MOVIES" },
        { emojis: "🕷️ 👨 🕸️", answer: "SPIDER-MAN", hint: "Marvel Superhero", category: "MOVIES" },
        { emojis: "👻 🚫", answer: "GHOSTBUSTERS", hint: "Who you gonna call?", category: "MOVIES" },
        { emojis: "❄️ ⛄ 👭 👑", answer: "FROZEN", hint: "Let it go!", category: "MOVIES" },
        { emojis: "🦇 👨 🃏 🌃", answer: "THE DARK KNIGHT", hint: "Gotham's protector", category: "MOVIES" },
        { emojis: "🚢 🧊 💔 🌊", answer: "TITANIC", hint: "Jack and Rose", category: "MOVIES" },
        { emojis: "🥊 🐝 🦋", answer: "MUHAMMAD ALI", hint: "Float like a butterfly", category: "PEOPLE" },
        { emojis: "🐍 ✈️", answer: "SNAKES ON A PLANE", hint: "Samuel L. Jackson thriller", category: "MOVIES" },
        { emojis: "🍫 🏭 🎩 🎟️", answer: "WILLY WONKA", hint: "Golden ticket", category: "MOVIES" },
        { emojis: "🦖 🏝️ 🚙 ⚡", answer: "JURASSIC PARK", hint: "Life finds a way", category: "MOVIES" },
        { emojis: "🚀 🌕 👨‍🚀 🇺🇸", answer: "MOON LANDING", hint: "One giant leap for mankind", category: "HISTORY" },
        { emojis: "☕ 🛋️ 👫 👫 👫", answer: "FRIENDS", hint: "Central Perk sit-com", category: "TV SHOWS" }
      ]
    },

    'unscramble-it': {
      title: 'UNSCRAMBLE IT',
      badge: '🔀 ANAGRAM CLASH',
      icon: '🔀',
      type: 'GUESSING',
      description: 'Speed anagram puzzle! Unscramble the letters before time runs out!',
      prompts: [
        { scrambled: "D I O N L Y O N E E", answer: "DIONLYONEE", hint: "The Playground Boss", category: "STREAM" },
        { scrambled: "C H A M P I O N S", answer: "CHAMPIONS", hint: "Winners of the game", category: "TITLES" },
        { scrambled: "J E O P A R D Y", answer: "JEOPARDY", hint: "Legendary TV quiz show", category: "TV SHOWS" },
        { scrambled: "B R O A D C A S T", answer: "BROADCAST", hint: "Live on the air", category: "MEDIA" },
        { scrambled: "A T L A N T I C", answer: "ATLANTIC", hint: "Major ocean", category: "GEOGRAPHY" },
        { scrambled: "H O L L Y W O O D", answer: "HOLLYWOOD", hint: "Entertainment capital", category: "PLACES" },
        { scrambled: "S U N S H I N E", answer: "SUNSHINE", hint: "Bright daylight", category: "NATURE" },
        { scrambled: "P A S S C O D E", answer: "PASSCODE", hint: "Secret key", category: "TECH" },
        { scrambled: "S T R E A M E R", answer: "STREAMER", hint: "Live content creator", category: "INTERNET" },
        { scrambled: "F O R T U N E", answer: "FORTUNE", hint: "Great wealth or luck", category: "WHEEL" }
      ]
    },

    'who-dis': {
      title: 'WHO DIS?',
      badge: '🕵🏾 MYSTERY GUESS',
      icon: '🕵🏾',
      type: 'GUESSING',
      description: 'Progressive clues & silhouette reveal! Can chat guess who it is on Clue 1?',
      prompts: [
        {
          name: "MICHAEL JORDAN",
          category: "SPORTS LEGENDS",
          clue1: "Won 6 NBA Championships in the 1990s with the Chicago Bulls",
          clue2: "Famous for the #23 jersey, Air sneakers, and Flu Game",
          clue3: "Star of the original 1996 Space Jam film"
        },
        {
          name: "BEYONCÉ",
          category: "MUSIC ICONS",
          clue1: "Started her career in the iconic group Destiny's Child",
          clue2: "Holds the record for the most Grammy wins in history (32+)",
          clue3: "Known as Queen Bey, Renaissance tour, Single Ladies"
        },
        {
          name: "STEVE JOBS",
          category: "TECH TITANS",
          clue1: "Co-founded a revolutionary computer company in a garage in 1976",
          clue2: "Famously wore a black turtleneck, blue jeans, and New Balance",
          clue3: "Introduced the original iPhone in 2007"
        },
        {
          name: "LEBRON JAMES",
          category: "SPORTS LEGENDS",
          clue1: "Drafted #1 straight out of high school from Akron, Ohio in 2003",
          clue2: "All-time leading scorer in NBA history",
          clue3: "Known as 'The King', won titles with Miami, Cleveland, and LA"
        },
        {
          name: "RIHANNA",
          category: "MUSIC & BUSINESS",
          clue1: "Born in Barbados, broke out with the smash hit 'Umbrella'",
          clue2: "Billionaire founder of Fenty Beauty and Savage X Fenty",
          clue3: "Headlined the 2023 Super Bowl Halftime show while pregnant"
        },
        {
          name: "DRAKE",
          category: "HIP HOP",
          clue1: "Former Canadian teen soap actor on Degrassi",
          clue2: "OVO founder with record-shattering Billboard chart runs",
          clue3: "Certified Lover Boy, God's Plan, Hotline Bling"
        }
      ]
    },

    'hangman': {
      title: 'HANGMAN',
      badge: '🔤 CLASSIC WORD GUESS',
      icon: '🔤',
      type: 'GUESSING',
      description: 'Classic word guesser! Guess letters, avoid strikes, and save the stickman!',
      prompts: [
        // CARIBBEAN CULTURE & VIBES
        { word: "JERK CHICKEN", category: "CARIBBEAN CULTURE", hint: "Smoky, spicy Jamaican barbecue specialty", difficulty: "EASY" },
        { word: "PLANTAIN CHIPS", category: "CARIBBEAN CULTURE", hint: "Crispy fried golden tropical snack", difficulty: "EASY" },
        { word: "BOB MARLEY", category: "CARIBBEAN CULTURE", hint: "Legendary King of Reggae music", difficulty: "EASY" },
        { word: "BLUE MOUNTAIN COFFEE", category: "CARIBBEAN CULTURE", hint: "World famous Jamaican premium mountain roast", difficulty: "MEDIUM" },
        { word: "RED STRIPE", category: "CARIBBEAN CULTURE", hint: "Iconic Jamaican lager in the stubby bottle", difficulty: "EASY" },
        { word: "PATTIES AND COCO BREAD", category: "CARIBBEAN CULTURE", hint: "The ultimate lunchtime combo from the bakery", difficulty: "MEDIUM" },
        { word: "USAIN BOLT", category: "CARIBBEAN CULTURE", hint: "Fastest human lightning in Olympic track history", difficulty: "EASY" },
        { word: "DUNNS RIVER FALLS", category: "CARIBBEAN CULTURE", hint: "Famous terraced cascading waterfall near Ocho Rios", difficulty: "MEDIUM" },
        { word: "DOMINO CHAMPION", category: "CARIBBEAN CULTURE", hint: "Slamming down the double-six on the table", difficulty: "MEDIUM" },
        { word: "STEEL DRUM BAND", category: "CARIBBEAN CULTURE", hint: "Melodic percussion instrument originally from Trinidad", difficulty: "MEDIUM" },
        { word: "ROAST BREADFRUIT", category: "CARIBBEAN CULTURE", hint: "Starchy island staple roasted over open fire", difficulty: "HARD" },
        { word: "CALYPSO MUSIC", category: "CARIBBEAN CULTURE", hint: "Upbeat rhythmic island storytelling genre", difficulty: "MEDIUM" },
        { word: "PORT ROYAL PIRATES", category: "CARIBBEAN CULTURE", hint: "Historical Jamaican sunken pirate city", difficulty: "HARD" },
        { word: "ACKEE AND SALTFISH", category: "CARIBBEAN CULTURE", hint: "Jamaica's beloved national breakfast dish", difficulty: "MEDIUM" },
        { word: "MANGO TREE", category: "CARIBBEAN CULTURE", hint: "Shady backyard tree dropping sweet orange fruit", difficulty: "EASY" },
        { word: "REGGAE SUNSPLASH", category: "CARIBBEAN CULTURE", hint: "Historic outdoor reggae festival in Montego Bay", difficulty: "MEDIUM" },

        // BLOCKBUSTER MOVIES & TV
        { word: "PIRATES OF THE CARIBBEAN", category: "MOVIES & TV", hint: "Captain Jack Sparrow sailing the Black Pearl", difficulty: "MEDIUM" },
        { word: "JURASSIC PARK", category: "MOVIES & TV", hint: "Dinosaurs brought back to life on an island", difficulty: "EASY" },
        { word: "AVENGERS ENDGAME", category: "MOVIES & TV", hint: "Superheroes assemble to defeat Thanos", difficulty: "MEDIUM" },
        { word: "BLACK PANTHER", category: "MOVIES & TV", hint: "King T'Challa protecting Wakanda", difficulty: "EASY" },
        { word: "SPIDER MAN", category: "MOVIES & TV", hint: "Friendly neighborhood wall-crawler", difficulty: "EASY" },
        { word: "STRANGER THINGS", category: "MOVIES & TV", hint: "Kids in Hawkins fighting the Upside Down", difficulty: "MEDIUM" },
        { word: "THE MATRIX", category: "MOVIES & TV", hint: "Neo choosing between the red or blue pill", difficulty: "EASY" },
        { word: "BACK TO THE FUTURE", category: "MOVIES & TV", hint: "Time travel at 88 miles per hour in a DeLorean", difficulty: "MEDIUM" },
        { word: "GHOSTBUSTERS", category: "MOVIES & TV", hint: "Who ya gonna call when spirits run wild?", difficulty: "EASY" },
        { word: "STAR WARS", category: "MOVIES & TV", hint: "Jedi knights and lightsabers far away", difficulty: "EASY" },
        { word: "THE LION KING", category: "MOVIES & TV", hint: "Simba learning Hakuna Matata on Pride Rock", difficulty: "EASY" },
        { word: "MISSION IMPOSSIBLE", category: "MOVIES & TV", hint: "Secret agent Tom Cruise doing dangerous stunts", difficulty: "MEDIUM" },
        { word: "FINDING NEMO", category: "MOVIES & TV", hint: "Clownfish father swimming across the ocean", difficulty: "EASY" },
        { word: "TOP GUN MAVERICK", category: "MOVIES & TV", hint: "High flying fighter jet dogfights", difficulty: "MEDIUM" },

        // VIDEO GAMES & STREAMING
        { word: "SUPER MARIO BROS", category: "VIDEO GAMES", hint: "Mushroom Kingdom jumping plumber", difficulty: "EASY" },
        { word: "MINECRAFT", category: "VIDEO GAMES", hint: "Punch trees, build shelters, mine diamonds", difficulty: "EASY" },
        { word: "FORTNITE BATTLE ROYALE", category: "VIDEO GAMES", hint: "100 players jumping off the battle bus", difficulty: "MEDIUM" },
        { word: "CALL OF DUTY", category: "VIDEO GAMES", hint: "Popular first-person military shooter", difficulty: "EASY" },
        { word: "THE LEGEND OF ZELDA", category: "VIDEO GAMES", hint: "Link exploring Hyrule with the Master Sword", difficulty: "MEDIUM" },
        { word: "GRAND THEFT AUTO", category: "VIDEO GAMES", hint: "Open world city chaos and heist missions", difficulty: "MEDIUM" },
        { word: "POKEMON", category: "VIDEO GAMES", hint: "Gotta catch 'em all in red and white balls", difficulty: "EASY" },
        { word: "SONIC THE HEDGEHOG", category: "VIDEO GAMES", hint: "Blue blur collecting golden rings at sound speed", difficulty: "MEDIUM" },
        { word: "TWITCH STREAMER", category: "STREAM LIFE", hint: "Broadcasting live with webcam and chat", difficulty: "EASY" },
        { word: "VICTORY ROYALE", category: "VIDEO GAMES", hint: "The #1 gold banner when you survive to the end", difficulty: "EASY" },
        { word: "DIONLYONEE", category: "THE HOST", hint: "The one and only host di stream pon di app!", difficulty: "EASY" },
        { word: "WHEEL OF FORTUNE", category: "GAMESHOW", hint: "Spin the giant colorful cash wheel", difficulty: "EASY" },
        { word: "FINAL JEOPARDY", category: "GAMESHOW", hint: "Write your answer in the form of a question", difficulty: "MEDIUM" },
        { word: "HEADSHOT", category: "VIDEO GAMES", hint: "Precision shot dealing critical damage", difficulty: "EASY" },

        // FOOD & FLAVORS
        { word: "PEPPERONI PIZZA", category: "FOOD & DRINK", hint: "Cheesy baked crust with cured meat rounds", difficulty: "EASY" },
        { word: "CHERRY CHEESECAKE", category: "FOOD & DRINK", hint: "Rich creamy dessert topped with sweet fruit", difficulty: "MEDIUM" },
        { word: "CHOCOLATE CHIP COOKIES", category: "FOOD & DRINK", hint: "Warm baked treats best enjoyed with cold milk", difficulty: "MEDIUM" },
        { word: "WAFFLES AND SYRUP", category: "FOOD & DRINK", hint: "Golden grid breakfast with melting butter", difficulty: "EASY" },
        { word: "SMASH BURGER", category: "FOOD & DRINK", hint: "Thin crispy-edged beef patty on a brioche bun", difficulty: "EASY" },
        { word: "TACOS AND GUACAMOLE", category: "FOOD & DRINK", hint: "Mexican street food with avocado dip", difficulty: "MEDIUM" },
        { word: "MANGO SMOOTHIE", category: "FOOD & DRINK", hint: "Blended tropical icy fruit shake", difficulty: "EASY" },
        { word: "MACARONI AND CHEESE", category: "FOOD & DRINK", hint: "Golden baked pasta comfort food classic", difficulty: "MEDIUM" },
        { word: "FRENCH FRIES", category: "FOOD & DRINK", hint: "Crispy salted golden potato strips", difficulty: "EASY" },
        { word: "BANANA PUDDING", category: "FOOD & DRINK", hint: "Southern sweet dessert with vanilla wafers", difficulty: "MEDIUM" },

        // ANIMALS & WILDLIFE
        { word: "GOLDEN RETRIEVER", category: "ANIMALS", hint: "Friendly fluffy dog breed that loves tennis balls", difficulty: "MEDIUM" },
        { word: "BALD EAGLE", category: "ANIMALS", hint: "Majestic soaring raptor with sharp talons", difficulty: "EASY" },
        { word: "GIANT PANDA", category: "ANIMALS", hint: "Black and white bear munching on bamboo shoots", difficulty: "EASY" },
        { word: "GREAT WHITE SHARK", category: "ANIMALS", hint: "Apex ocean predator with powerful jaws", difficulty: "MEDIUM" },
        { word: "CHAMELEON", category: "ANIMALS", hint: "Reptile that shifts skin colors to blend in", difficulty: "MEDIUM" },
        { word: "HUMMINGBIRD", category: "ANIMALS", hint: "Tiny bird that hovers and drinks sweet flower nectar", difficulty: "MEDIUM" },
        { word: "KANGAROO", category: "ANIMALS", hint: "Australian jumper carrying a baby in her pouch", difficulty: "EASY" },
        { word: "DOLPHIN POD", category: "ANIMALS", hint: "Intelligent ocean creatures leaping waves together", difficulty: "EASY" },
        { word: "OCTOPUS", category: "ANIMALS", hint: "Clever sea animal with eight tentacled arms", difficulty: "EASY" },

        // SPORTS & CHAMPIONS
        { word: "GOLDEN STATE WARRIORS", category: "SPORTS", hint: "NBA dynasty known for lights-out three pointers", difficulty: "MEDIUM" },
        { word: "SLAM DUNK", category: "SPORTS", hint: "Throwing down the basketball two-handed through the rim", difficulty: "EASY" },
        { word: "SUPER BOWL TROPHY", category: "SPORTS", hint: "The Lombardi prize awarded on NFL Sunday", difficulty: "MEDIUM" },
        { word: "HAT TRICK", category: "SPORTS", hint: "Scoring three goals in a single game", difficulty: "EASY" },
        { word: "KNOCKOUT PUNCH", category: "SPORTS", hint: "Ending the boxing fight before the final bell", difficulty: "EASY" },
        { word: "GRAND SLAM", category: "SPORTS", hint: "Home run hit when all bases are loaded", difficulty: "EASY" },
        { word: "MARATHON RUNNER", category: "SPORTS", hint: "Racing twenty six point two miles on foot", difficulty: "MEDIUM" },

        // EVERYDAY & SCIENCE
        { word: "ROLLER COASTER", category: "THEME PARKS", hint: "High speed thrill ride with steep loops and drops", difficulty: "EASY" },
        { word: "ASTRONAUT IN SPACE", category: "SCIENCE", hint: "Floating weightless on the space station", difficulty: "MEDIUM" },
        { word: "METEOR SHOWER", category: "SCIENCE", hint: "Shooting stars blazing across the night sky", difficulty: "MEDIUM" },
        { word: "THUNDER AND LIGHTNING", category: "WEATHER", hint: "Electric flashes and booming rumbles in a storm", difficulty: "MEDIUM" },
        { word: "SOLAR ECLIPSE", category: "SCIENCE", hint: "Moon passing directly between the Sun and Earth", difficulty: "MEDIUM" },
        { word: "TREASURE CHEST", category: "ADVENTURE", hint: "Locked wooden trunk filled with gold doubloons", difficulty: "EASY" },
        { word: "HOT AIR BALLOON", category: "TRAVEL", hint: "Floating silently through the clouds with a burner", difficulty: "MEDIUM" },
        { word: "WIRELESS HEADPHONES", category: "TECHNOLOGY", hint: "Bluetooth earbuds playing your favorite beats", difficulty: "MEDIUM" }
      ]
    },

    'charades': {
      title: 'CHARADES',
      badge: '🎭 ACT IT OUT',
      icon: '🎭',
      type: 'PERFORMANCE',
      description: 'Host acts it out with NO words! Chat guesses live on stream!',
      prompts: [
        // EASY EVERYDAY
        {
          prompt: "Drinking Super Hot Soup",
          category: "EASY EVERYDAY",
          difficulty: "SUPER EASY",
          words: 4,
          chatClue: "Food & Eating",
          hostSecret: "Hold an imaginary hot bowl, blow on your spoon, then fan your burning tongue!",
          actingTips: [
            "Hold an imaginary bowl with both hands and blow gently",
            "Take an eager sip from a spoon, then freeze in shock",
            "Open your mouth wide and frantically fan your tongue with both hands!"
          ]
        },
        {
          prompt: "Brushing Teeth and Spitting",
          category: "EASY EVERYDAY",
          difficulty: "SUPER EASY",
          words: 4,
          chatClue: "Morning Routine",
          hostSecret: "Squeeze imaginary toothpaste, brush vigorously, gargle and spit!",
          actingTips: [
            "Pretend to squeeze a toothpaste tube onto a toothbrush",
            "Brush your front and back teeth vigorously with puffed cheeks",
            "Swish imaginary water with puffed cheeks, then lean over and spit!"
          ]
        },
        {
          prompt: "Taking a Freezing Cold Shower",
          category: "EASY EVERYDAY",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Bathroom & Water",
          hostSecret: "Turn imaginary knob, step in, shiver violently, and hug yourself!",
          actingTips: [
            "Turn an imaginary shower knob with confidence",
            "Step one foot forward and immediately gasp from the icy water",
            "Shiver with chattering teeth, hug your shoulders, and jump out!"
          ]
        },
        {
          prompt: "Trying to Swat a Mosquito",
          category: "EASY EVERYDAY",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Insects & Pests",
          hostSecret: "Follow an imaginary buzzing insect with your eyes, clap missed swats!",
          actingTips: [
            "Tilt your head and follow an imaginary flying bug around your ears",
            "Clap your hands together quickly and miss, checking between palms",
            "Slap your own arm or neck, sigh in defeat, and swat with an imaginary magazine!"
          ]
        },
        {
          prompt: "Eating a Very Sour Lemon",
          category: "EASY EVERYDAY",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Food & Flavors",
          hostSecret: "Take a confident bite, then squint eyes and pucker your entire face!",
          actingTips: [
            "Peel an imaginary fruit wedge and smile casually",
            "Take a huge bite and chew once",
            "Instantly squeeze your eyes shut, pucker your lips, and shudder!"
          ]
        },
        {
          prompt: "Walking a Dog Pulling Hard",
          category: "EASY EVERYDAY",
          difficulty: "EASY",
          words: 6,
          chatClue: "Pets & Outdoors",
          hostSecret: "Hold an imaginary leash with two hands, lean backward as dog drags you!",
          actingTips: [
            "Hold an imaginary leash tight in both fists",
            "Get yanked forward suddenly, stumbling and leaning backwards to brake",
            "Whistle and gesture 'heel!' while sliding across the floor!"
          ]
        },
        {
          prompt: "Carrying Too Many Grocery Bags",
          category: "EASY EVERYDAY",
          difficulty: "EASY",
          words: 5,
          chatClue: "Shopping & Errands",
          hostSecret: "Load both forearms with heavy imaginary bags, struggle to walk upright!",
          actingTips: [
            "Hook multiple imaginary plastic grocery bags onto each arm",
            "Struggle to stand up straight with shoulders sagging and strained face",
            "Try to kick the front door open with your foot without dropping bags!"
          ]
        },
        {
          prompt: "Opening an Umbrella in Wind",
          category: "EASY EVERYDAY",
          difficulty: "EASY",
          words: 5,
          chatClue: "Weather & Rain",
          hostSecret: "Pop open umbrella, get blown backwards, umbrella inverts inside out!",
          actingTips: [
            "Look up at rain, press the button to pop an imaginary umbrella",
            "Grip the handle tight as gust of wind pushes you backwards",
            "Umbrella flips inside-out—stare up at it in disbelief with rain on face!"
          ]
        },
        {
          prompt: "Ironing Clothes and Burning Them",
          category: "EASY EVERYDAY",
          difficulty: "EASY",
          words: 5,
          chatClue: "Chore & Clothes",
          hostSecret: "Smooth cloth, press iron, get distracted, smell smoke, panic!",
          actingTips: [
            "Smooth out an imaginary shirt on an ironing board",
            "Press iron down, then look away or check imaginary phone",
            "Sniff the air, see smoke, lift the iron in horror, and fan the scorch mark!"
          ]
        },
        {
          prompt: "Putting on Extremely Tight Jeans",
          category: "EASY EVERYDAY",
          difficulty: "EASY",
          words: 5,
          chatClue: "Getting Dressed",
          hostSecret: "Hop on one foot pulling up waistline, suck in stomach to button!",
          actingTips: [
            "Step into pants and pull up, getting stuck at the thighs",
            "Hop frantically on one foot, wriggling your hips to pull them up",
            "Suck your stomach in until you can barely breathe, straining to zip!"
          ]
        },

        // FUNNY ANIMALS & CHARACTERS
        {
          prompt: "A T-Rex Making a Bed",
          category: "FUNNY ANIMALS",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Prehistoric & Comedy",
          hostSecret: "Tuck arms tight to chest with tiny hands, roar and try to pull sheets!",
          actingTips: [
            "Tuck your elbows to your ribs and make tiny claw hands",
            "Lean over an imaginary bed, straining because your arms can't reach the pillow",
            "Roar silently in frustration and stomp heavy dinosaur feet!"
          ]
        },
        {
          prompt: "A Robot Running Low on Battery",
          category: "FUNNY ANIMALS",
          difficulty: "SUPER EASY",
          words: 6,
          chatClue: "Sci-Fi & Machines",
          hostSecret: "Start with crisp robotic arm movements, gradually stutter and shut down!",
          actingTips: [
            "Do crisp, sharp mechanical 90-degree robot arm motions",
            "Slow down, movements become stuttery and twitchy",
            "Head slowly drops forward, eyes shut, completely powered off!"
          ]
        },
        {
          prompt: "A Sleepy Cat Stretching",
          category: "FUNNY ANIMALS",
          difficulty: "SUPER EASY",
          words: 4,
          chatClue: "Cute Animals",
          hostSecret: "Paw the air, do a huge stretch, rub whiskers, and curl into a ball!",
          actingTips: [
            "Make little paw hands, yawn widely with eyes squeezed shut",
            "Arch your back and stretch front paws forward",
            "Lick an imaginary paw and swipe it over your ear!"
          ]
        },
        {
          prompt: "A Sneaky Ninja Tiptoeing",
          category: "FUNNY ANIMALS",
          difficulty: "EASY",
          words: 4,
          chatClue: "Action & Stealth",
          hostSecret: "Stealthy high steps, karate chops, freeze when someone looks!",
          actingTips: [
            "Tip-toe on very exaggerated silent steps, peering side to side",
            "Freeze completely still like a statue when you hear a sound",
            "Throw imaginary throwing stars (shurikens) and do a ninja pose!"
          ]
        },
        {
          prompt: "A Rock Star on Air Guitar",
          category: "FUNNY ANIMALS",
          difficulty: "SUPER EASY",
          words: 6,
          chatClue: "Music & Concert",
          hostSecret: "Grip air guitar fretboard, strum aggressively, wind-mill arm spin!",
          actingTips: [
            "Hold an imaginary electric guitar at your hip",
            "Fret rapidly with left hand and strum furiously with right hand",
            "Do an exaggerated Pete Townshend windmill spin and slide on your knees!"
          ]
        },
        {
          prompt: "A Chef Dropping a Pancake",
          category: "FUNNY ANIMALS",
          difficulty: "EASY",
          words: 5,
          chatClue: "Cooking & Kitchen",
          hostSecret: "Grip frying pan, flip pancake high, watch it miss and land on head/floor!",
          actingTips: [
            "Hold an imaginary skillet and swirl the batter gently",
            "Flick your wrist with flair to launch the pancake high in the air",
            "Track it flying too high, try to catch it with pan, it splats on your face!"
          ]
        },
        {
          prompt: "A Penguin on Slippery Ice",
          category: "FUNNY ANIMALS",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Cold Wildlife",
          hostSecret: "Press arms stiff to sides, waddle quickly, slip and slide on belly!",
          actingTips: [
            "Keep arms pinned flat to your sides like stiff flippers",
            "Waddle rapidly side to side on small feet",
            "Lose your footing, slide wildly on your tummy!"
          ]
        },
        {
          prompt: "A Monkey Eating a Banana",
          category: "FUNNY ANIMALS",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Jungle Animals",
          hostSecret: "Scratch armpit, peel banana from bottom, chew with puffed cheeks!",
          actingTips: [
            "Scratch your head and under your arm with loose curved fingers",
            "Peel an imaginary banana skin in four clean strips",
            "Stuff the whole thing in your mouth and jump around excitedly!"
          ]
        },

        // SPORTS & GAMES
        {
          prompt: "Bowling a Strike and Celebrating",
          category: "SPORTS & GAMES",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Recreation & Pins",
          hostSecret: "Pick ball, wipe on shirt, swing arm back, release, high five imaginary team!",
          actingTips: [
            "Pick up a heavy bowling ball, stick fingers into holes, wipe on hip",
            "Take three deliberate steps, swing back, release smooth down the lane",
            "Watch the pins crash, pump your fist, and do a wild victory dance!"
          ]
        },
        {
          prompt: "Hitting a Home Run in Baseball",
          category: "SPORTS & GAMES",
          difficulty: "SUPER EASY",
          words: 6,
          chatClue: "Sports & Bats",
          hostSecret: "Grip bat, tap plate, look at pitcher, swing hard, point to outfield!",
          actingTips: [
            "Grip bat above your back shoulder, tap imaginary home plate",
            "Keep eyes locked on incoming pitch, swing with full body torque",
            "Drop the bat, shade eyes to watch it fly out of the park, jog bases!"
          ]
        },
        {
          prompt: "Fishing and Catching an Old Boot",
          category: "SPORTS & GAMES",
          difficulty: "EASY",
          words: 6,
          chatClue: "Outdoors & Water",
          hostSecret: "Cast rod, wait peacefully, huge tug! Reel furiously, lift up smelly boot!",
          actingTips: [
            "Cast your fishing line overhead and sit back relaxing",
            "Sudden aggressive jerk on the line—reel the crank vigorously!",
            "Pull it out of the water triumphantly... hold up a dripping, stinky shoe!"
          ]
        },
        {
          prompt: "Weightlifting Barbell Too Heavy",
          category: "SPORTS & GAMES",
          difficulty: "SUPER EASY",
          words: 4,
          chatClue: "Gym & Fitness",
          hostSecret: "Chalk hands, grip bar, strain with shaking red face, drop immediately!",
          actingTips: [
            "Clap chalk dust onto hands and slap your own face to get hyped",
            "Bend knees, grab heavy bar, heave it to knees with trembling knees",
            "Eyes bug out, arms shake uncontrollably, drop it with a loud thud!"
          ]
        },
        {
          prompt: "Swimming and Spotting a Shark",
          category: "SPORTS & GAMES",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Ocean & Swimming",
          hostSecret: "Do calm front-crawl swimming, look to the side, see shark fin, speed paddle!",
          actingTips: [
            "Do relaxed, leisurely swimming strokes with happy breathing",
            "Look across water, see an imaginary fin circling you",
            "Eyes widen in terror—switch into frantic splashing paddle sprint!"
          ]
        },
        {
          prompt: "Shooting a Basketball Free Throw",
          category: "SPORTS & GAMES",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Court & Hoops",
          hostSecret: "Bounce ball 3 times, spin in hands, bend knees, follow through wrist flick!",
          actingTips: [
            "Stand at foul line, bounce imaginary basketball three rhythm bounces",
            "Breathe out, look up at the rim, bend knees into shooting stance",
            "Elevate and release with an exaggerated wrist goose-neck flick!"
          ]
        },
        {
          prompt: "Playing Tennis and Arguing with Umpire",
          category: "SPORTS & GAMES",
          difficulty: "EASY",
          words: 7,
          chatClue: "Racket Sports",
          hostSecret: "Serve or volley, ball called out, throw hands up shouting 'You cannot be serious!'",
          actingTips: [
            "Bounce tennis ball, toss high, hit huge overhead serve",
            "Hear umpire call 'OUT!'—stare in utter disbelief",
            "Walk up to umpire chair, point at the line, argue vehemently waving hands!"
          ]
        },

        // CARIBBEAN & STREAM CULTURE
        {
          prompt: "Dancing Dancehall at Street Party",
          category: "CARIBBEAN & STREAM",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Music & Dancing",
          hostSecret: "Bust out classic dancehall steps, shoulder roll, salute the selector!",
          actingTips: [
            "Bust out classic dancehall shoulder bounce and knee roll",
            "Do the Bogle or signal 'Pull up selector!' with finger in the air",
            "Hyped up footwork smiling with pure Caribbean rhythm!"
          ]
        },
        {
          prompt: "Slamming Domino on the Table",
          category: "CARIBBEAN & STREAM",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Board & Table Games",
          hostSecret: "Study your hand, find the winning double-six, slam tile with full authority!",
          actingTips: [
            "Hold imaginary tiles in your hand, peeking carefully from opponents",
            "Spot the open end, raise your right arm high in the air with dramatic flourish",
            "Slam the domino down with full Caribbean table force and stand up celebrating!"
          ]
        },
        {
          prompt: "Eating Extra Spicy Jerk Chicken",
          category: "CARIBBEAN & STREAM",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Jamaican Cuisine",
          hostSecret: "Take a huge bite off the bone, chew happily, then scotch bonnet heat hits!",
          actingTips: [
            "Hold an imaginary chicken leg drumstick, take a big juicy bite",
            "Chew with big smile, giving a thumbs up to the chef",
            "Scotch bonnet pepper kicks in—eyes water, grab water pitcher, fan mouth!"
          ]
        },
        {
          prompt: "Running Like Usain Bolt",
          category: "CARIBBEAN & STREAM",
          difficulty: "SUPER EASY",
          words: 4,
          chatClue: "Olympics & Track",
          hostSecret: "Get in starting blocks, sprint like lightning, hit the iconic 'To Di World' pose!",
          actingTips: [
            "Get down into track starting blocks with fingertips on the line",
            "Blast off into a high-knee sprint, checking imaginary opponents over shoulder",
            "Cross the finish line and strike the world-famous Usain Bolt lightning pose!"
          ]
        },
        {
          prompt: "Drinking Fresh Coconut Water",
          category: "CARIBBEAN & STREAM",
          difficulty: "SUPER EASY",
          words: 4,
          chatClue: "Tropical Drinks",
          hostSecret: "Chop coconut with imaginary cutlass, pop in a straw, sip in paradise!",
          actingTips: [
            "Hold a round coconut in left hand, chop top with imaginary machete",
            "Tilt back the coconut or stick in a straw",
            "Take a long refreshing gulp, wipe your mouth, and sigh in pure tropical bliss!"
          ]
        },
        {
          prompt: "Raging at Video Game Lag",
          category: "CARIBBEAN & STREAM",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Stream & Gaming",
          hostSecret: "Focused gaming, sudden screen freeze, mashed buttons, throw controller!",
          actingTips: [
            "Grip an imaginary gamepad, furiously tapping buttons with game face",
            "Screen freezes from 999ms ping—freeze in horror mid-action",
            "Mash all buttons, throw imaginary headset on desk, and bury face in hands!"
          ]
        },

        // RELATABLE FAILS & COMEDY
        {
          prompt: "Walking Into a Sticky Spiderweb",
          category: "RELATABLE FAILS",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Outdoor Mishaps",
          hostSecret: "Walk casually, face hits invisible web, flail arms wildly brushing face!",
          actingTips: [
            "Stroll along with head held high whistling happily",
            "Your face walks directly into an invisible web—freeze with wide eyes",
            "Flail both arms wildly around your hair and face doing an awkward ninja dance!"
          ]
        },
        {
          prompt: "Stubbing Pinky Toe on Furniture",
          category: "RELATABLE FAILS",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Everyday Pain",
          hostSecret: "Walk, toe strikes corner, silent scream of agony, hop on other leg!",
          actingTips: [
            "Walk barefoot, kick an imaginary coffee table corner with pinky toe",
            "Open mouth wide in a completely silent, agonizing delayed scream",
            "Grab your foot with both hands, hopping across the room on one foot!"
          ]
        },
        {
          prompt: "Stopping Microwave at One Second",
          category: "RELATABLE FAILS",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Late Night Snack",
          hostSecret: "Tip-toe to microwave, watch 3...2...1 countdown, slap door button like a bomb squad!",
          actingTips: [
            "Tip-toe in secret, lean in close to an imaginary microwave screen",
            "Hover finger over open button, watching timer count 3... 2...",
            "Smack the open button at 0:01! Breathe massive sigh of relief at silence!"
          ]
        },
        {
          prompt: "Brain Freeze from Ice Slushy",
          category: "RELATABLE FAILS",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Cold Drinks",
          hostSecret: "Drink fast through straw, freeze, clutch temples with both hands in agony!",
          actingTips: [
            "Suck enthusiastically on an imaginary icy slushy drink through a straw",
            "Sudden electric freeze—eyes lock wide, drop cup",
            "Clutch both temples with your palms, grimacing until the freeze passes!"
          ]
        },
        {
          prompt: "Pretending You Heard Someone",
          category: "RELATABLE FAILS",
          difficulty: "EASY",
          words: 4,
          chatClue: "Awkward Social",
          hostSecret: "Lean in say 'What?', lean in again, third time just nod and laugh awkwardly!",
          actingTips: [
            "Listen to someone talking, cup your ear and tilt head: 'What?'",
            "Lean in closer, squint, and cup ear again: 'Say that one more time?'",
            "They repeat it a third time—still didn't hear, so just smile, nod, and laugh awkwardly!"
          ]
        },
        {
          prompt: "Untangling Mess of Wired Earbuds",
          category: "RELATABLE FAILS",
          difficulty: "SUPER EASY",
          words: 5,
          chatClue: "Gadgets & Tech",
          hostSecret: "Pull knot from pocket, pick apart intricate loops, end up in worse knot!",
          actingTips: [
            "Pull a ball of tangled headphone cords out of your pocket",
            "Inspect the impossible knot with squinted eyes and gentle pulling",
            "Pull one string through a loop, it gets tighter—groan in utter exasperation!"
          ]
        }
      ]
    },

    'would-you-rather': {
      title: 'WOULD YOU RATHER',
      badge: '⚖️ CHAT GAME',
      icon: '⚖️',
      type: 'CHAT GAME',
      description: 'Two impossible choices. Chat votes live on the debate meter!',
      prompts: [
        { optionA: "Always speak in rhymes forever", optionB: "Whisper everything you say forever", category: "SPEECH" },
        { optionA: "Have unlimited free flights anywhere", optionB: "Never have to pay for food anywhere", category: "PERKS" },
        { optionA: "Live without music for 5 years", optionB: "Live without video / movies / TV for 5 years", category: "ENTERTAINMENT" },
        { optionA: "Read everyone's mind within 5 feet", optionB: "Be able to teleport anywhere instantly once a day", category: "SUPERPOWERS" },
        { optionA: "Always know when someone is lying to you", optionB: "Always get away with any lie you tell", category: "TRUTH" },
        { optionA: "Only be able to sleep for 3 hours a night with no fatigue", optionB: "Wake up fully refreshed whenever you want but sleep 10 hours", category: "LIFESTYLE" },
        { optionA: "Have your browser history made public right now", optionB: "Let your ex read every text you sent in the past 6 months", category: "DRAMA" },
        { optionA: "Win $5,000,000 but you can never leave your hometown", optionB: "Win $250,000 and travel freely anywhere worldwide", category: "FINANCIAL" }
      ]
    },

    'guess-the-lyrics': {
      title: 'GUESS THE LYRICS',
      badge: '🎵 R&B • REGGAE • LOVE • GOSPEL',
      icon: '🎤',
      type: 'GUESSING',
      description: 'Sing along and finish the missing lyric! Spanning nostalgic R&B, Reggae & Jamaican classics, Dancehall party anthems, romantic Love songs, and uplifting Gospel!',
      prompts: [
        // ==========================================
        // 90S R&B CLASSICS
        // ==========================================
        {
          song: "No Scrubs",
          artist: "TLC",
          year: "1999",
          genre: "90s R&B",
          category: "90S R&B CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "A scrub is a guy that thinks he's fly, and is also known as a busta. Always talkin' about what he wants, and...",
          missingLyrics: "JUST SITS ON HIS BROKE ASS",
          acceptableAnswers: ["just sits on his broke ass", "sits on his broke ass", "sitting on his broke ass"],
          hint: "Iconic TLC anthem from 'FanMail'. What does Chilli say that scrub is doing all day?"
        },
        {
          song: "End of the Road",
          artist: "Boyz II Men",
          year: "1992",
          genre: "90s R&B",
          category: "90S R&B CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Although we've come to the end of the road, still I can't let go. It's unnatural, you belong to me, I belong to you. Come to the end of the road...",
          missingLyrics: "STILL I CAN'T LET GO",
          acceptableAnswers: ["still i can't let go", "still i cant let go", "i can't let go", "i cant let go"],
          hint: "Record-breaking Motown ballad from the 'Boomerang' soundtrack."
        },
        {
          song: "I Will Always Love You",
          artist: "Whitney Houston",
          year: "1992",
          genre: "90s R&B / Soul",
          category: "90S R&B CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "If I should stay, I would only be in your way. So I'll go, but I know I'll think of you each step of the way. And I...",
          missingLyrics: "WILL ALWAYS LOVE YOU",
          acceptableAnswers: ["will always love you", "i will always love you", "always love you"],
          hint: "The legendary, soaring key-change ballad from 'The Bodyguard'."
        },
        {
          song: "Doo Wop (That Thing)",
          artist: "Lauryn Hill",
          year: "1998",
          genre: "90s R&B / Neo-Soul",
          category: "90S R&B CLASSICS",
          difficulty: "MEDIUM",
          lyricsSnippet: "Guys, you know you'd better watch out. Some girls, some girls are only about that thing, that thing, that thing! Girls, you know you'd better watch out...",
          missingLyrics: "SOME GUYS ARE ONLY ABOUT THAT THING",
          acceptableAnswers: ["some guys are only about that thing", "some guys only about that thing", "some guys are about that thing"],
          hint: "Classic from 'The Miseducation of Lauryn Hill' warning both brothers and sisters."
        },
        {
          song: "Pony",
          artist: "Ginuwine",
          year: "1996",
          genre: "90s R&B",
          category: "90S R&B CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "I'm just a bachelor, I'm looking for a partner. Someone who knows how to ride, without even falling off. If you're horny, let's do it...",
          missingLyrics: "RIDE IT MY PONY",
          acceptableAnswers: ["ride it my pony", "ride it pony", "ride my pony"],
          hint: "Timbaland-produced bassline masterpiece from Ginuwine's debut."
        },
        {
          song: "Back at One",
          artist: "Brian McKnight",
          year: "1999",
          genre: "90s R&B",
          category: "90S R&B CLASSICS",
          difficulty: "MEDIUM",
          lyricsSnippet: "One, you're like a dream come true. Two, just wanna be with you. Three, girl, it's plain to see that you're the only one for me. And four, repeat steps one through three. Five, make you fall in love with me. If ever I believe my work is done...",
          missingLyrics: "THEN I'LL START BACK AT ONE",
          acceptableAnswers: ["then i'll start back at one", "then ill start back at one", "start back at one", "i'll start back at one"],
          hint: "The countdown love song that every couple slow danced to in 1999."
        },
        {
          song: "Say My Name",
          artist: "Destiny's Child",
          year: "1999",
          genre: "90s R&B",
          category: "90S R&B CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Say my name, say my name. If no one is around you, say 'Baby I love you', if you ain't runnin' game. Say my name, say my name, you actin' kinda shady...",
          missingLyrics: "AIN'T CALLIN' ME BABY",
          acceptableAnswers: ["ain't callin me baby", "aint callin me baby", "not callin me baby", "ain't calling me baby", "aint calling me baby"],
          hint: "Darkchild produced signature anthem checking an unfaithful partner."
        },
        {
          song: "This Is How We Do It",
          artist: "Montell Jordan",
          year: "1995",
          genre: "90s R&B / Party",
          category: "90S R&B CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "This is how we do it, it's Friday night and I feel alright. The party's here on the West side. So I reach for my 40 and I turn it up...",
          missingLyrics: "DESIGNATED DRIVER TAKE THE KEYS TO MY TRUCK",
          acceptableAnswers: ["designated driver take the keys to my truck", "take the keys to my truck", "designated driver take the keys"],
          hint: "The ultimate Friday night party anthem responsible for safe driving."
        },
        {
          song: "I'll Make Love to You",
          artist: "Boyz II Men",
          year: "1994",
          genre: "90s R&B",
          category: "90S R&B CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "I'll make love to you, like you want me to. And I'll hold you tight, baby, all through the night. I'll make love to you, when you want me to...",
          missingLyrics: "AND I WILL NOT LET GO 'TIL YOU TELL ME TO",
          acceptableAnswers: ["and i will not let go till you tell me to", "and i will not let go until you tell me to", "and i will not let go"],
          hint: "Babyface-written smash hit that spent 14 weeks at number one on the Billboard Hot 100."
        },

        // ==========================================
        // 2000S R&B ANTHEMS
        // ==========================================
        {
          song: "Yeah!",
          artist: "Usher ft. Lil Jon & Ludacris",
          year: "2004",
          genre: "2000s R&B / Crunk",
          category: "2000S R&B ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "Peace up, A-Town down! Up in the club with my homies, tryin' to get a lil' V-I. Next thing I knew, she was all up on me, screaming...",
          missingLyrics: "YEAH YEAH YEAH YEAH YEAH",
          acceptableAnswers: ["yeah yeah yeah yeah yeah", "yeah yeah yeah", "yeah", "shawty got down low said come and get me"],
          hint: "The synth-brass crunk anthem that owned the entire summer of 2004."
        },
        {
          song: "Burn",
          artist: "Usher",
          year: "2004",
          genre: "2000s R&B",
          category: "2000S R&B ANTHEMS",
          difficulty: "MEDIUM",
          lyricsSnippet: "I don't understand why I sleep at night, but I can't sleep. I've been thinking about the way things used to be between you and me. Deep down you know it's best for yourself, but you...",
          missingLyrics: "HATE THE THOUGHT OF HER WITH SOMEBODY ELSE",
          acceptableAnswers: ["hate the thought of her with somebody else", "hate the thought of him with somebody else", "with somebody else"],
          hint: "Jermaine Dupri and Bryan-Michael Cox production on the 'Confessions' album."
        },
        {
          song: "Fallin'",
          artist: "Alicia Keys",
          year: "2001",
          genre: "2000s R&B / Soul",
          category: "2000S R&B ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "I keep on fallin' in and out of love with you. Sometimes I love ya, sometimes you make me blue. Sometimes I feel good, at times I feel used. Lovin' you darling...",
          missingLyrics: "MAKES ME SO CONFUSED",
          acceptableAnswers: ["makes me so confused", "so confused", "confused"],
          hint: "Alicia's soulful piano debut that took home multiple Grammy Awards."
        },
        {
          song: "If I Ain't Got You",
          artist: "Alicia Keys",
          year: "2003",
          genre: "2000s R&B / Soul",
          category: "2000S R&B ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "Some people live for the fortune, some people live just for the fame. Some people live for the power, yeah, some people live just to play the game. Some people want it all, but I don't want nothing at all...",
          missingLyrics: "IF I AIN'T GOT YOU BABY",
          acceptableAnswers: ["if i ain't got you baby", "if i aint got you baby", "if i ain't got you", "if i aint got you"],
          hint: "Classic ballad inspired by the tragic passing of singer Aaliyah."
        },
        {
          song: "Family Affair",
          artist: "Mary J. Blige",
          year: "2001",
          genre: "2000s R&B / Hip Hop",
          category: "2000S R&B ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "Let's get it crunk upon, have fun upon on up in this dancery. We got ya hollerin', we pimpin' everybody jumpin'. See, we don't need no...",
          missingLyrics: "HATERATION HOLLERATIN IN THIS DANCERY",
          acceptableAnswers: ["hateration holleratin in this dancery", "hateration holleratin", "hateration in this dancery", "no hateration"],
          hint: "Dr. Dre produced beat that introduced 'hateration' and 'dancery' to the culture."
        },
        {
          song: "Let Me Love You",
          artist: "Mario",
          year: "2004",
          genre: "2000s R&B",
          category: "2000S R&B ANTHEMS",
          difficulty: "MEDIUM",
          lyricsSnippet: "Baby, I just don't get it. Do you enjoy being hurt? I know you smelled the perfume, the make-up on his shirt. You should let me love you...",
          missingLyrics: "LET ME BE THE ONE TO GIVE YOU EVERYTHING YOU WANT AND NEED",
          acceptableAnswers: ["let me be the one to give you everything you want and need", "let me be the one", "give you everything you want and need"],
          hint: "Ne-Yo penned smash single from Mario's 'Turning Point' album."
        },
        {
          song: "So Sick",
          artist: "Ne-Yo",
          year: "2005",
          genre: "2000s R&B",
          category: "2000S R&B ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "Gotta change my answering machine, now that I'm alone. 'Cause right now it says that we can't come to the phone. And I'm so sick of love songs...",
          missingLyrics: "SO TIRED OF TEARS",
          acceptableAnswers: ["so tired of tears", "tired of tears", "so sick of love songs so tired of tears"],
          hint: "Stargate-produced debut single about hearing heartbreak songs on the radio."
        },
        {
          song: "Kill Bill",
          artist: "SZA",
          year: "2022",
          genre: "Modern R&B",
          category: "2000S R&B ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "I might kill my ex, not the best idea. His new girlfriend's next, how'd I get here? I might kill my ex, I still love him though...",
          missingLyrics: "RATHER BE IN JAIL THAN ALONE",
          acceptableAnswers: ["rather be in jail than alone", "rather be in hell than alone", "in jail than alone"],
          hint: "SZA's smash record inspired by Quentin Tarantino's revenge film."
        },

        // ==========================================
        // SOUL & MOTOWN CLASSICS
        // ==========================================
        {
          song: "Isn't She Lovely",
          artist: "Stevie Wonder",
          year: "1976",
          genre: "Motown / Classic Soul",
          category: "SOUL & MOTOWN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Isn't she lovely? Isn't she wonderful? Isn't she precious, less than one minute old? I never thought through love we'd be making one as lovely as she. But isn't she lovely...",
          missingLyrics: "MADE FROM LOVE",
          acceptableAnswers: ["made from love", "truly made from love"],
          hint: "Stevie celebrating the birth of his daughter Aisha on 'Songs in the Key of Life'."
        },
        {
          song: "Never Too Much",
          artist: "Luther Vandross",
          year: "1981",
          genre: "Soul / R&B",
          category: "SOUL & MOTOWN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Oh, my love, a thousand kisses from you is never too much. I just don't wanna stop. Oh, my love, a million days in your arms is never too much...",
          missingLyrics: "AND I JUST KEEP ON TICKIN' AND TOCKIN'",
          acceptableAnswers: ["and i just keep on tickin and tockin", "and i just keep on ticking and tocking", "never too much", "a thousand kisses from you is never too much"],
          hint: "Luther Vandross's upbeat funky debut that fills any dance floor."
        },
        {
          song: "September",
          artist: "Earth, Wind & Fire",
          year: "1978",
          genre: "Soul / Funk",
          category: "SOUL & MOTOWN CLASSICS",
          difficulty: "MEDIUM",
          lyricsSnippet: "Do you remember the 21st night of September? Love was changin' the minds of pretenders, while chasin' the clouds away. Our hearts were ringin' in the key that our souls were singin'. As we danced in the night, remember...",
          missingLyrics: "HOW THE STARS STOLE THE NIGHT AWAY",
          acceptableAnswers: ["how the stars stole the night away", "the stars stole the night away"],
          hint: "Maurice White and Al McKay timeless horn-driven party groove."
        },
        {
          song: "Let's Stay Together",
          artist: "Al Green",
          year: "1971",
          genre: "Soul",
          category: "SOUL & MOTOWN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "I'm, I'm so in love with you. Whatever you want to do is all right with me, 'cause you make me feel so brand new. And I want to spend my life with you. Let's stay together...",
          missingLyrics: "LOVIN' YOU WHETHER TIMES ARE GOOD OR BAD HAPPY OR SAD",
          acceptableAnswers: ["lovin you whether times are good or bad happy or sad", "whether times are good or bad", "times are good or bad", "whether times are good or bad happy or sad"],
          hint: "Willie Mitchell's Memphis soul classic later famously sung by President Obama."
        },

        // ==========================================
        // TIMELESS LOVE SONGS & SLOW JAMS
        // ==========================================
        {
          song: "Sweet Love",
          artist: "Anita Baker",
          year: "1986",
          genre: "Quiet Storm / R&B",
          category: "TIMELESS LOVE SONGS",
          difficulty: "EASY",
          lyricsSnippet: "Sweet love, hear me calling out your name, I feel no shame, I'm in love. Sweet love, don't you ever go away, it'll always be this way. Oh, no, you've given me a love so true, and I will always...",
          missingLyrics: "GIVE MY LOVE TO YOU",
          acceptableAnswers: ["give my love to you", "love you", "give my love", "sweet love"],
          hint: "The signature quiet storm masterpiece from 'Rapture' that won two Grammy Awards."
        },
        {
          song: "All My Life",
          artist: "K-Ci & JoJo",
          year: "1997",
          genre: "R&B / Love Ballad",
          category: "TIMELESS LOVE SONGS",
          difficulty: "EASY",
          lyricsSnippet: "All my life I prayed for someone like you, and I thank God that I, that I finally found you. All my life I prayed for someone like you, and I hope that you feel the same way too. Yes, I pray that you do...",
          missingLyrics: "LOVE ME TOO",
          acceptableAnswers: ["love me too", "love me", "feel the same way too"],
          hint: "The Hailey brothers' heartfelt piano wedding vow that topped the Billboard Hot 100."
        },
        {
          song: "Back at One",
          artist: "Brian McKnight",
          year: "1999",
          genre: "R&B / Love Ballad",
          category: "TIMELESS LOVE SONGS",
          difficulty: "EASY",
          lyricsSnippet: "One, you're like a dream come true. Two, just wanna be with you. Three, girl, it's plain to see that you're the only one for me. And four, repeat steps one through three. Five, make you fall in love with me. If ever I believe my work is done, then I'll...",
          missingLyrics: "START BACK AT ONE",
          acceptableAnswers: ["start back at one", "start at one", "back at one", "go back at one"],
          hint: "Brian McKnight's mathematical love countdown setting the golden standard for devotion."
        },
        {
          song: "I Wanna Know",
          artist: "Joe",
          year: "2000",
          genre: "R&B / Slow Jam",
          category: "TIMELESS LOVE SONGS",
          difficulty: "EASY",
          lyricsSnippet: "I wanna know what turns you on, I'd like to know so I can be all you need and more. I wanna know what turns you on, I'd like to know so I can be all that you need, and...",
          missingLyrics: "LOVE YOU RIGHT",
          acceptableAnswers: ["love you right", "treat you right", "be all you need"],
          hint: "Joe's mega-hit featured on 'The Wood' soundtrack that spent 44 weeks on the charts."
        },
        {
          song: "By Your Side",
          artist: "Sade",
          year: "2000",
          genre: "Soul / Love Ballad",
          category: "TIMELESS LOVE SONGS",
          difficulty: "EASY",
          lyricsSnippet: "You think I'd leave your side, baby? You know me better than that. You think I'd leave you down when you're down on your knees? I wouldn't do that. Oh, when you're cold, I'll be there to hold you tight to me. When you're on the outside, baby, and you can't get in, I will show you...",
          missingLyrics: "YOU'RE STILL MY FRIEND",
          acceptableAnswers: ["you're still my friend", "youre still my friend", "you are still my friend", "still my friend"],
          hint: "Sade's acoustic soul promise of unconditional loyalty and timeless love."
        },
        {
          song: "Let's Get Married",
          artist: "Jagged Edge",
          year: "2000",
          genre: "R&B / Romance",
          category: "TIMELESS LOVE SONGS",
          difficulty: "EASY",
          lyricsSnippet: "Meet me at the altar in your white dress. We ain't gettin' no younger, we might as well do it. Been chillin' for a minute in this sweet relationship, so we might as well get married, yeah. Can't you see us in that house with a picket fence...",
          missingLyrics: "AND A BABY IN A CRIB",
          acceptableAnswers: ["and a baby in a crib", "baby in a crib", "a baby in a crib"],
          hint: "The quintessential 2000s proposal anthem written and sung by twin brothers Brandon and Brian Casey."
        },
        {
          song: "My, My, My",
          artist: "Johnny Gill",
          year: "1990",
          genre: "R&B / Slow Jam",
          category: "TIMELESS LOVE SONGS",
          difficulty: "EASY",
          lyricsSnippet: "Put on your red dress, baby, and slip on your high heel shoes. Oh yeah, we're gonna celebrate tonight, just me and you. And I'm gonna put on my favorite suit, yeah. Baby, tonight is your night. My, my, my, my, my...",
          missingLyrics: "YOU SURE LOOK GOOD TONIGHT",
          acceptableAnswers: ["you sure look good tonight", "you look good tonight", "my my my you sure look good tonight"],
          hint: "Babyface-produced R&B romance classic with Kenny G's iconic saxophone solo."
        },
        {
          song: "For You I Will",
          artist: "Monica",
          year: "1997",
          genre: "R&B / Love Ballad",
          category: "TIMELESS LOVE SONGS",
          difficulty: "EASY",
          lyricsSnippet: "When you're feeling lost in the night, when you feel your world just ain't right, call on me, I will be waiting. Count on me, I will be there. Just mention my name and I'll walk in the rain, through the fire I would walk for you. For you I will...",
          missingLyrics: "PROMISE YOU THE SKY",
          acceptableAnswers: ["promise you the sky", "cross the ocean", "lay my life down for you", "for you i will"],
          hint: "Diane Warren ballad from the multi-platinum 'Space Jam' soundtrack sung by teen sensation Monica."
        },
        {
          song: "Sweet Lady",
          artist: "Tyrese",
          year: "1998",
          genre: "R&B / Slow Jam",
          category: "TIMELESS LOVE SONGS",
          difficulty: "EASY",
          lyricsSnippet: "Sweet lady, should I call you my baby? Can I come over and see you tonight? Sweet lady, will you be my baby? Come on, let me love you, 'cause you're so...",
          missingLyrics: "SWEET AND YOU LOOK SO FLY",
          acceptableAnswers: ["sweet and you look so fly", "sweet", "fly", "look so fly"],
          hint: "The debut love slow jam that made Tyrese an R&B heartthrob."
        },
        {
          song: "Ascension (Don't Ever Wonder)",
          artist: "Maxwell",
          year: "1996",
          genre: "Neo-Soul / Romance",
          category: "TIMELESS LOVE SONGS",
          difficulty: "MEDIUM",
          lyricsSnippet: "If you ever wonder, could this be magic at all? If you ever wonder, could this be love? Don't ever wonder, don't ever wonder. If you ever wonder, could this be love? So don't ever wonder...",
          missingLyrics: "DON'T EVER WONDER",
          acceptableAnswers: ["don't ever wonder", "dont ever wonder", "could this be love", "wonder"],
          hint: "The sensual neo-soul groove from Maxwell's debut 'Urban Hang Suite'."
        },

        // ==========================================
        // REGGAE & JAMAICAN CLASSICS
        // ==========================================
        {
          song: "One Love / People Get Ready",
          artist: "Bob Marley & The Wailers",
          year: "1977",
          genre: "Roots Reggae",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "One love, one heart! Let's get together and feel all right. Hear the children crying: One love! Hear the children crying: One heart! Saying: Give thanks and praise to the Lord and...",
          missingLyrics: "I WILL FEEL ALL RIGHT",
          acceptableAnswers: ["i will feel all right", "i will feel alright", "feel all right", "feel alright", "lets get together and feel all right"],
          hint: "Universal anthem of peace and Rastafari unity, named Song of the Millennium by the BBC."
        },
        {
          song: "Three Little Birds",
          artist: "Bob Marley & The Wailers",
          year: "1977",
          genre: "Roots Reggae",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Rise up this mornin', smile with the risin' sun. Three little birds pitch by my doorstep, singin' sweet songs of melodies pure and true, sayin': This is my message to you-ou-ou. Singin' don't worry about a thing, 'cause every little thing...",
          missingLyrics: "IS GONNA BE ALRIGHT",
          acceptableAnswers: ["is gonna be alright", "is gonna be all right", "gonna be alright", "every little thing is gonna be alright"],
          hint: "The quintessential message of optimism and reassurance from Bob Marley's landmark 'Exodus' album."
        },
        {
          song: "Could You Be Loved",
          artist: "Bob Marley & The Wailers",
          year: "1980",
          genre: "Reggae / Dance",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Could you be loved and be loved? Could you be loved and be loved? Don't let them fool ya, or even try to school ya, oh no! We've got a mind...",
          missingLyrics: "OF OUR OWN",
          acceptableAnswers: ["of our own", "a mind of our own", "we've got a mind of our own", "we got a mind of our own"],
          hint: "Uptempo disco-reggae crossover groove written on an airplane in 1979."
        },
        {
          song: "Rockaway",
          artist: "Beres Hammond",
          year: "2001",
          genre: "Lovers Rock / Reggae",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Put on some music, sweet reggae music, and let's just rock away! When you hear the bassline hit, and the rhythm start to play... I feel like rocking away, girl, rocking away. Play me some reggae music...",
          missingLyrics: "SWEET REGGAE MUSIC",
          acceptableAnswers: ["sweet reggae music", "reggae music", "make me feel like dancing"],
          hint: "Lovers rock icon Beres Hammond celebrating the golden nostalgia of Jamaican dancehalls."
        },
        {
          song: "They Gonna Talk",
          artist: "Beres Hammond",
          year: "2001",
          genre: "Lovers Rock",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "They gonna talk, they gonna talk, they gonna talk, talk, talk. But what can they say? They see we're holding hands, they don't understand. When true love is in your heart...",
          missingLyrics: "NOTHING CAN TEAR US APART",
          acceptableAnswers: ["nothing can tear us apart", "nothing can break us apart", "tear us apart"],
          hint: "Beres Hammond's sweet reassurance to his lover to ignore the gossip in the neighborhood."
        },
        {
          song: "She's Royal",
          artist: "Tarrus Riley",
          year: "2006",
          genre: "Roots Reggae / Lovers Rock",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Now I see why you are queen, yes you're royal. The way you carry yourself, royal. Naturally a queen, you don't have to try. The beauty that shines from the inside, never denies that you're royal. One in a million...",
          missingLyrics: "SO HARD TO FIND",
          acceptableAnswers: ["so hard to find", "hard to find", "yes you're royal", "you're royal"],
          hint: "Dean Fraser-produced acoustic reggae masterpiece honoring women with royal grace and dignity."
        },
        {
          song: "Smile Jamaica",
          artist: "Chronixx",
          year: "2013",
          genre: "Roots Reggae",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "MEDIUM",
          lyricsSnippet: "She's sweet like sugar cane, cool like the morning rain. Even when trouble come her way, she put a smile pon her face. Sweet Jamaica, smile Jamaica! No matter what the people say...",
          missingLyrics: "SMILE JAMAICA",
          acceptableAnswers: ["smile jamaica", "sweet jamaica", "put a smile pon her face"],
          hint: "Roots reggae revival leader Chronixx praising the warmth and beauty of his homeland."
        },
        {
          song: "Toast",
          artist: "Koffee",
          year: "2018",
          genre: "Reggae / Modern Roots",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Toast! Yeah, toast! Gratitude is a must, yeah. Me haffi thank God for the journey, the earnings, just watch how di blessing a flow like...",
          missingLyrics: "RIVER",
          acceptableAnswers: ["river", "a river", "water", "flow like river"],
          hint: "Historic Grammy-winning breakout hit from Spanish Town's phenomenal Koffee."
        },
        {
          song: "Destiny",
          artist: "Buju Banton",
          year: "1997",
          genre: "Roots Reggae",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "MEDIUM",
          lyricsSnippet: "Set your heart free, you gotta let love lead the way. You have your own destiny to fulfill! I wanna rule my destiny, yeah. I wanna rule my destiny. Living in a world of frustration, can't take this stress no more. I wanna rule...",
          missingLyrics: "MY DESTINY",
          acceptableAnswers: ["my destiny", "rule my destiny", "i wanna rule my destiny"],
          hint: "Buju Banton's soulful, conscious declaration of spiritual independence from 'Inna Heights'."
        },
        {
          song: "Hold Yuh",
          artist: "Gyptian",
          year: "2010",
          genre: "Reggae / Lovers Rock",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "EASY",
          lyricsSnippet: "Shoo-wop, shoo-wop. Shoo-wop, shoo-wop. Gyal, mi wan' yuh fi hold mi tight, hold mi tight. Squeeze mi tight, squeeze mi tight. And make mi feel alright, make mi feel alright. Gyal, tonight is...",
          missingLyrics: "YOUR NIGHT",
          acceptableAnswers: ["your night", "the night", "tonight is your night", "alright"],
          hint: "Ricky Blaze-produced hypnotic piano reggae track that crossed from Brooklyn dances to international stardom."
        },
        {
          song: "Here I Come",
          artist: "Dennis Brown",
          year: "1981",
          genre: "Roots Reggae",
          category: "REGGAE & JAMAICAN CLASSICS",
          difficulty: "MEDIUM",
          lyricsSnippet: "Here I come with love and not fighting! That's not my style. I'm taking you with love and affection, for a little while. Love and hate can never be friends, oh no! Here I come with love...",
          missingLyrics: "AND NOT FIGHTING",
          acceptableAnswers: ["and not fighting", "not fighting", "love and affection"],
          hint: "The Crown Prince of Reggae Dennis Brown's unforgettable declaration of peace over conflict."
        },

        // ==========================================
        // DANCEHALL PARTY ANTHEMS
        // ==========================================
        {
          song: "Temperature",
          artist: "Sean Paul",
          year: "2005",
          genre: "Dancehall",
          category: "DANCEHALL PARTY ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "The gal dem schillaci, Sean Paul, so mi go so then! Well, woman di way you roll dat body give mi temperature! Boy from di day you seh you love mi girl you got di cure! Lord have his mercy girl you look good mi haffi holler out: I got the right temperature to...",
          missingLyrics: "SHELTER YOU FROM THE STORM",
          acceptableAnswers: ["shelter you from the storm", "shelter you from the rain", "shelter you", "keep you warm"],
          hint: "Sean Paul's Billboard Hot 100 #1 hit on the iconic Applause riddim."
        },
        {
          song: "Get Busy",
          artist: "Sean Paul",
          year: "2002",
          genre: "Dancehall",
          category: "DANCEHALL PARTY ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "Shake that thing, miss Cana, Cana. Shake that thing, miss Annabella. Shake that thing, yan Donna, Donna. Jodi and Rebecca. Woman, don't test di champion sound! Can't you hear di beat a jump up from the underground? So let's get busy, just...",
          missingLyrics: "SHAKE THAT THING",
          acceptableAnswers: ["shake that thing", "get busy", "shake that thing miss cana cana"],
          hint: "The Diwali riddim dancehall anthem that made Sean Paul a household name around the globe."
        },
        {
          song: "No Letting Go",
          artist: "Wayne Wonder",
          year: "2002",
          genre: "Dancehall / Lovers Rock",
          category: "DANCEHALL PARTY ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "Got somebody, she's a work of art. She got the finest body and the sweet, sweet heart. I wanna hold her, I wanna love her, and I'm never, never letting go! What you say? You're the one that I've been waiting for, and I won't let you...",
          missingLyrics: "WALK OUT MY DOOR",
          acceptableAnswers: ["walk out my door", "out my door", "go", "leave"],
          hint: "Wayne Wonder's smooth, silky vocals on the Diwali riddim that took over radio worldwide."
        },
        {
          song: "Girls Dem Sugar",
          artist: "Beenie Man ft. Mýa",
          year: "2000",
          genre: "Dancehall / R&B",
          category: "DANCEHALL PARTY ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "Sim simma, who got the keys to my Bimma? Who am I? The girls dem sugar! How can I make love to a fellow in a rush? One girl a time and the rest haffi crush! Beenie Man and Mýa in di place, hear di King say: Excuse me, mister, can I get a...",
          missingLyrics: "WITNESS",
          acceptableAnswers: ["witness", "dance", "whine"],
          hint: "The King of Dancehall joined by Mýa over a bouncy Neptunes groove."
        },
        {
          song: "It Wasn't Me",
          artist: "Shaggy ft. RikRok",
          year: "2000",
          genre: "Dancehall / Pop Reggae",
          category: "DANCEHALL PARTY ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "Honey came in and she caught me red-handed creeping with the girl next door. Picture this, we were both butt-naked banging on the bathroom floor. How could I forget that I had given her an extra key? All this time she was standing there, she never took her eyes off me! She caught me on the counter...",
          missingLyrics: "IT WASN'T ME",
          acceptableAnswers: ["it wasn't me", "it wasnt me", "wasnt me", "was not me"],
          hint: "Shaggy's multi-platinum global anthem of comical and brazen relationship denial."
        },
        {
          song: "Bam Bam",
          artist: "Sister Nancy",
          year: "1982",
          genre: "Classic Dancehall",
          category: "DANCEHALL PARTY ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "What a bam bam! Bam bam dilla, bam bam! This woman never trouble no one, I'm a lady, I'm not a man! MCs they come and they can't understand. What a bam bam, what a bam bam! I'm a lady, I'm not a man, MC is my...",
          missingLyrics: "AMBITION",
          acceptableAnswers: ["ambition", "profession", "mission"],
          hint: "Pioneering dancehall DJ Sister Nancy on the Stalag 17 riddim — the most sampled reggae song in history."
        },
        {
          song: "Gyal You A Party Animal",
          artist: "Charly Black",
          year: "2014",
          genre: "Dancehall / Soca",
          category: "DANCEHALL PARTY ANTHEMS",
          difficulty: "EASY",
          lyricsSnippet: "Wine and come up, gyal you a party animal! The way you bubble pon di riddim, gyal you full of talent, yuh a champion! Wine for me, darling, wine for me, baby! Gyal you a party...",
          missingLyrics: "ANIMAL",
          acceptableAnswers: ["animal", "party animal"],
          hint: "Diamond-certified Latin and Caribbean party anthem from Jamaican deejay Charly Black."
        },
        {
          song: "No Games",
          artist: "Serani",
          year: "2008",
          genre: "Dancehall / R&B",
          category: "DANCEHALL PARTY ANTHEMS",
          difficulty: "MEDIUM",
          lyricsSnippet: "She told me that she love me, but she playing no games. She told me that she love me, but she playing no games! I want to be your man, girl, I can't even lie. But every time I look into your eyes, you tell me you're not...",
          missingLyrics: "THAT KIND OF GIRL",
          acceptableAnswers: ["that kind of girl", "that type of girl", "playing no games", "playing games"],
          hint: "Serani's piano-heavy dancehall ballad on the Unfinished Business riddim."
        },

        // ==========================================
        // CONTEMPORARY GOSPEL
        // ==========================================
        {
          song: "Revolution",
          artist: "Kirk Franklin",
          year: "1998",
          genre: "Contemporary Gospel",
          category: "CONTEMPORARY GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "Do you want a revolution? Whoop whoop! Sick and tired of people tellin' us what to do! We're the next generation, we got something to say to you! No more sitting back, we're taking it back! Tell me...",
          missingLyrics: "DO YOU WANT A REVOLUTION",
          acceptableAnswers: ["do you want a revolution", "revolution", "whoop whoop"],
          hint: "Kirk Franklin bridging high-energy hip-hop and gospel on 'The Nu Nation Project'."
        },
        {
          song: "Stomp",
          artist: "Kirk Franklin & God's Property",
          year: "1997",
          genre: "Contemporary Gospel",
          category: "CONTEMPORARY GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "For those of you who think gospel music has gone too far, you think we got too radical with our message... Well, I got news for ya! You ain't heard nothin' yet! Lately I've been going through some things that's really got me down. I need someone to talk to, someone to...",
          missingLyrics: "HEAR MY CRY AND KEEP ME SAFE AND SOUND",
          acceptableAnswers: ["hear my cry and keep me safe and sound", "hear my cry", "keep me safe and sound"],
          hint: "Featuring Cheryl 'Salt' James, this single dominated MTV and BET in 1997."
        },
        {
          song: "I Smile",
          artist: "Kirk Franklin",
          year: "2011",
          genre: "Contemporary Gospel",
          category: "CONTEMPORARY GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "I smile, even though I hurt see I smile. I know God is working so I smile. Even though I've been here for a while, I smile, smile. It's so hard to look up when you been down for so long, but...",
          missingLyrics: "I LOOK IN THE MIRROR AND WHAT DO I SEE",
          acceptableAnswers: ["i look in the mirror and what do i see", "a new me", "i smile even though i hurt"],
          hint: "Kirk's joyful, infectious groove reminding everyone to keep smiling through the pain."
        },
        {
          song: "Shackles (Praise You)",
          artist: "Mary Mary",
          year: "2000",
          genre: "Contemporary Gospel / R&B",
          category: "CONTEMPORARY GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "Take the shackles off my feet so I can dance! I just wanna praise you, I just wanna praise you! You broke the chains now I can lift my hands! And I'm gonna praise you...",
          missingLyrics: "I'M GONNA PRAISE YOU",
          acceptableAnswers: ["i'm gonna praise you", "im gonna praise you", "praise you", "take the shackles off my feet"],
          hint: "Erica and Tina Campbell's global cross-over gospel smash produced by Warryn Campbell."
        },
        {
          song: "Victory",
          artist: "Tye Tribbett & G.A.",
          year: "2006",
          genre: "Contemporary Gospel",
          category: "CONTEMPORARY GOSPEL",
          difficulty: "MEDIUM",
          lyricsSnippet: "Look at yourself in the mirror, tell yourself: I've got the victory! We're marching in the light of God, we're stepping on the enemy's camp! When I say VICTORY, you say YES! Victory! (Yes!) Victory! (Yes!)...",
          missingLyrics: "I'VE GOT THE VICTORY",
          acceptableAnswers: ["i've got the victory", "ive got the victory", "got the victory", "victory"],
          hint: "High-voltage marching band gospel energy from Tye Tribbett & Greater Anointing."
        },
        {
          song: "Never Would Have Made It",
          artist: "Marvin Sapp",
          year: "2007",
          genre: "Contemporary Gospel",
          category: "CONTEMPORARY GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "Never would have made it without you. I would have lost it all, but now I see how you were there for me. And I can say I'm stronger, I'm wiser. I'm better, much better. When I look back over...",
          missingLyrics: "ALL YOU BROUGHT ME THROUGH",
          acceptableAnswers: ["all you brought me through", "all youve brought me through", "everything you brought me through"],
          hint: "Record-setting gospel anthem inspired by the loss of Marvin Sapp's father."
        },
        {
          song: "Take Me to the King",
          artist: "Tamela Mann",
          year: "2012",
          genre: "Contemporary Gospel",
          category: "CONTEMPORARY GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "Take me to the King, I don't have much to bring. My heart is torn in pieces, it's my offering. Take me to the King. Truth is I'm tired, options are few. I'm trying to pray, but where are you? I'm all out of church and...",
          missingLyrics: "I'M ALL OUT OF WORDS",
          acceptableAnswers: ["i'm all out of words", "im all out of words", "all out of words", "take me to the king"],
          hint: "Written and produced by Kirk Franklin, showcasing Tamela Mann's powerhouse vocals."
        },

        // ==========================================
        // GOSPEL CHOIR & PRAISE
        // ==========================================
        {
          song: "Every Praise",
          artist: "Hezekiah Walker",
          year: "2013",
          genre: "Gospel Choir",
          category: "GOSPEL CHOIR & PRAISE",
          difficulty: "EASY",
          lyricsSnippet: "Every praise is to our God. Every word of worship with one accord. Every praise, every praise is to our God. Sing hallelujah to our God. Glory hallelujah is to our God...",
          missingLyrics: "EVERY PRAISE EVERY PRAISE IS TO OUR GOD",
          acceptableAnswers: ["every praise every praise is to our God", "every praise is to our god", "every praise"],
          hint: "The international praise choir anthem that key-modulates four times into pure joy."
        },
        {
          song: "No Weapon",
          artist: "Fred Hammond & Radical for Christ",
          year: "1996",
          genre: "Praise & Worship",
          category: "GOSPEL CHOIR & PRAISE",
          difficulty: "EASY",
          lyricsSnippet: "No weapon formed against me shall prosper, it won't work! No weapon formed against me shall prosper, it won't work! God will do what He said He would do, He's not a man that He should lie...",
          missingLyrics: "HE WILL COME THROUGH",
          acceptableAnswers: ["he will come through", "he will stand by his word", "no weapon formed against me shall prosper", "it won't work"],
          hint: "Fred Hammond's faith-affirming standard based on Isaiah 54:17."
        },
        {
          song: "Blessed",
          artist: "Fred Hammond",
          year: "1998",
          genre: "Praise & Worship",
          category: "GOSPEL CHOIR & PRAISE",
          difficulty: "MEDIUM",
          lyricsSnippet: "Late in the midnight hour, God's gonna turn it around. It's gonna work in your favor! We're blessed in the city, we're blessed in the field. We're blessed in our going...",
          missingLyrics: "AND WE'RE BLESSED IN OUR COMING",
          acceptableAnswers: ["and we're blessed in our coming", "and were blessed in our coming", "blessed in our coming"],
          hint: "Uplifting praise anthem quoting the Deuteronomy blessings."
        },
        {
          song: "Total Praise",
          artist: "Richard Smallwood",
          year: "1996",
          genre: "Gospel Choir",
          category: "GOSPEL CHOIR & PRAISE",
          difficulty: "MEDIUM",
          lyricsSnippet: "Lord, I will lift mine eyes to the hills. Knowing my help is coming from You. Your peace You give me in time of the storm. You are the source of my strength, You are the strength of my life...",
          missingLyrics: "I LIFT MY HANDS IN TOTAL PRAISE TO YOU",
          acceptableAnswers: ["i lift my hands in total praise to you", "in total praise to you", "total praise to you", "total praise"],
          hint: "Majestic choral masterpiece written during the illness of Richard Smallwood's mother."
        },
        {
          song: "Goodness of God",
          artist: "CeCe Winans",
          year: "2021",
          genre: "Praise & Worship",
          category: "GOSPEL CHOIR & PRAISE",
          difficulty: "EASY",
          lyricsSnippet: "I love you, Lord, for your mercy never fails me. All my days, I've been held in your hands. From the moment that I wake up, until I lay my head, oh I will sing of...",
          missingLyrics: "THE GOODNESS OF GOD",
          acceptableAnswers: ["the goodness of god", "goodness of god", "your goodness"],
          hint: "CeCe Winans's chart-topping version of the beloved worship ballad."
        },
        {
          song: "More Abundantly",
          artist: "Ricky Dillard & New G",
          year: "1990",
          genre: "Gospel Choir",
          category: "GOSPEL CHOIR & PRAISE",
          difficulty: "MEDIUM",
          lyricsSnippet: "I've got it, I've got it! Life more abundantly! Jesus came that I might have life, and that I might have it more abundantly! God has given me...",
          missingLyrics: "POWER JOY PEACE AND HAPPINESS",
          acceptableAnswers: ["power joy peace and happiness", "power and joy", "life more abundantly", "power"],
          hint: "The high-stepping Chicago choir master Ricky Dillard's explosive breakout hit."
        },
        {
          song: "Grateful",
          artist: "Hezekiah Walker & The Love Fellowship Crusade Choir",
          year: "2008",
          genre: "Gospel Choir",
          category: "GOSPEL CHOIR & PRAISE",
          difficulty: "EASY",
          lyricsSnippet: "I am grateful for the things that You have done. Yes, I'm grateful for the victories we've won. I could go on and on and on about Your works, because I'm grateful, so grateful...",
          missingLyrics: "JUST TO PRAISE YOU LORD",
          acceptableAnswers: ["just to praise you lord", "grateful just to praise you lord", "to praise you lord"],
          hint: "Brooklyn bishop Hezekiah Walker's standard sung at Sunday morning communion services."
        },

        // ==========================================
        // TRADITIONAL & INSPIRATIONAL GOSPEL
        // ==========================================
        {
          song: "We Fall Down",
          artist: "Donnie McClurkin",
          year: "2000",
          genre: "Traditional Gospel",
          category: "TRADITIONAL & INSPIRATIONAL GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "We fall down, but we get up. We fall down, but we get up. We fall down, but we get up, for a saint is just a sinner who...",
          missingLyrics: "FELL DOWN AND GOT UP",
          acceptableAnswers: ["fell down and got up", "got up", "fell down and got back up"],
          hint: "Donnie McClurkin's comforting reminder that grace restores every believer."
        },
        {
          song: "Stand",
          artist: "Donnie McClurkin",
          year: "1996",
          genre: "Traditional Gospel / Inspirational",
          category: "TRADITIONAL & INSPIRATIONAL GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "What do you do when you've done all you can, and it seems like you can't make it through? What do you say when your friends turn away, and you're all alone into the night? After you've done all you can...",
          missingLyrics: "YOU JUST STAND",
          acceptableAnswers: ["you just stand", "just stand", "stand and be strong"],
          hint: "Oprah Winfrey's favorite gospel encouragement anthem on holding fast."
        },
        {
          song: "Hold My Mule",
          artist: "Pastor Shirley Caesar",
          year: "1988",
          genre: "Traditional Gospel",
          category: "TRADITIONAL & INSPIRATIONAL GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "When the deacons told old brother John he was making too much noise in church, John looked at the preacher and said: 'If you don't wanna praise Him, get out of my way! Somebody hold my mule while I...'",
          missingLyrics: "SHOUT AND DANCE",
          acceptableAnswers: ["shout and dance", "dance", "praise the lord", "shout", "dance for the lord"],
          hint: "The First Lady of Gospel telling the hilarious story of 86-year-old John praising God in his field."
        },
        {
          song: "Open My Heart",
          artist: "Yolanda Adams",
          year: "1999",
          genre: "Inspirational Gospel",
          category: "TRADITIONAL & INSPIRATIONAL GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "Alone in a room, it's just me and you. I feel so lost, 'cause I don't know what to do. Now what if I choose the wrong thing to do? I'm so afraid of disappointing you. So I need to talk to you, and ask you for your guidance. With one touch from you...",
          missingLyrics: "MY WHOLE LIFE WILL BE CHANGED",
          acceptableAnswers: ["my whole life will be changed", "my life will be changed", "open my heart", "open my heart dear lord"],
          hint: "Jimmy Jam & Terry Lewis produced inspirational ballad from 'Mountain High... Valley Low'."
        },
        {
          song: "Goin' Up Yonder",
          artist: "Walter Hawkins & The Love Center Choir",
          year: "1975",
          genre: "Traditional Gospel",
          category: "TRADITIONAL & INSPIRATIONAL GOSPEL",
          difficulty: "EASY",
          lyricsSnippet: "If you want to know where I'm going, where I'm going, soon. If anybody ask you where I'm going, where I'm going, soon. I'm goin' up yonder...",
          missingLyrics: "TO BE WITH MY LORD",
          acceptableAnswers: ["to be with my lord", "to be with the lord", "with my lord", "up yonder to be with my lord"],
          hint: "The Hawkins Family Oakland classic sung at homegoing celebrations across the world."
        },
        {
          song: "You Brought the Sunshine",
          artist: "The Clark Sisters",
          year: "1981",
          genre: "Gospel Soul / Reggae Groove",
          category: "TRADITIONAL & INSPIRATIONAL GOSPEL",
          difficulty: "MEDIUM",
          lyricsSnippet: "You brought the sunshine in my life. You brought the sunshine in my life! You gave me peace, joy, and love. Everything I need comes from up above. Because of You...",
          missingLyrics: "MY LIFE IS FULL OF HAPPINESS",
          acceptableAnswers: ["my life is full of happiness", "you brought the sunshine in my life", "my life is full of joy"],
          hint: "Twinkie Clark's Stevie Wonder-inspired reggae-gospel crossover that played in Studio 54."
        }
      ]
    }
  };

  window.StreamGamesData = StreamGamesData;

  // Classic Hangman Gallows & Stick Figure SVG visual representation
  window.renderHangmanStageSvg = function(strikes = 0, status = 'PLAYING', maxWidth = 340, maxHeight = 280) {
    strikes = Math.max(0, Math.min(6, Number(strikes) || 0));

    let bannerText = '';
    let bannerColor = '#d4af37';
    let figureSvg = '';

    if (status === 'WON') {
      bannerText = '🏆 CHAT SAVED THE HANGMAN! 🏆';
      bannerColor = '#10b981';
      figureSvg = `
        <!-- Snapped Rope -->
        <line x1="200" y1="30" x2="200" y2="52" stroke="#e2b93b" stroke-width="3" stroke-dasharray="2,2" />
        <text x="200" y="66" font-size="14" text-anchor="middle">✂️</text>

        <!-- Winner Podium -->
        <rect x="165" y="200" width="70" height="50" rx="6" fill="#10b981" stroke="#34d399" stroke-width="2.5" />
        <text x="200" y="234" font-size="22" text-anchor="middle">⭐</text>

        <!-- Confetti & Celebration Stars -->
        <text x="145" y="90" font-size="16">✨</text>
        <text x="245" y="85" font-size="18">🎉</text>
        <text x="150" y="145" font-size="14">🌟</text>
        <text x="248" y="140" font-size="16">🎊</text>

        <!-- Cheering Free Stick Figure -->
        <!-- Head with Sunglasses & Crown -->
        <circle cx="200" cy="100" r="18" fill="#fde047" stroke="#ca8a04" stroke-width="2.5" />
        <rect x="189" y="95" width="22" height="7" rx="2" fill="#020303" />
        <path d="M 193 109 Q 200 115 207 109" stroke="#000" stroke-width="2" fill="none" />
        <polygon points="188,88 194,92 200,83 206,92 212,88 212,93 188,93" fill="#f59e0b" stroke="#d4af37" stroke-width="1" />

        <!-- Torso -->
        <line x1="200" y1="118" x2="200" y2="175" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />

        <!-- Victory Raised Arms -->
        <line x1="200" y1="130" x2="170" y2="92" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />
        <line x1="200" y1="130" x2="230" y2="92" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />
        <text x="232" y="90" font-size="16">🏆</text>

        <!-- Standing Legs -->
        <line x1="200" y1="175" x2="185" y2="200" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />
        <line x1="200" y1="175" x2="215" y2="200" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />
      `;
    } else if (status === 'LOST') {
      bannerText = '💀 6 / 6 STRIKES — CHAT LOST! 💀';
      bannerColor = '#ef4444';
      figureSvg = `
        <!-- Hanging Rope -->
        <line x1="200" y1="30" x2="200" y2="72" stroke="#e2b93b" stroke-width="3" stroke-dasharray="2,2" />
        <ellipse cx="200" cy="74" rx="5" ry="6" fill="none" stroke="#ca8a04" stroke-width="2.5" />

        <!-- Red Alert Danger Glow -->
        <circle cx="200" cy="150" r="70" fill="rgba(239,68,68,0.12)" />

        <!-- 1: Head with X eyes -->
        <circle cx="200" cy="96" r="18" fill="#fde047" stroke="#ef4444" stroke-width="3" />
        <!-- Left X Eye -->
        <line x1="192" y1="91" x2="197" y2="97" stroke="#b91c1c" stroke-width="2" />
        <line x1="197" y1="91" x2="192" y2="97" stroke="#b91c1c" stroke-width="2" />
        <!-- Right X Eye -->
        <line x1="203" y1="91" x2="208" y2="97" stroke="#b91c1c" stroke-width="2" />
        <line x1="208" y1="91" x2="203" y2="97" stroke="#b91c1c" stroke-width="2" />
        <!-- Frown -->
        <path d="M 194 107 Q 200 102 206 107" stroke="#7f1d1d" stroke-width="2" fill="none" />

        <!-- 2: Torso -->
        <line x1="200" y1="114" x2="200" y2="175" stroke="#ef4444" stroke-width="5" stroke-linecap="round" />

        <!-- 3: Left Arm (Limp) -->
        <line x1="200" y1="126" x2="175" y2="165" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" />

        <!-- 4: Right Arm (Limp) -->
        <line x1="200" y1="126" x2="225" y2="165" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" />

        <!-- 5: Left Leg -->
        <line x1="200" y1="175" x2="180" y2="230" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" />

        <!-- 6: Right Leg -->
        <line x1="200" y1="175" x2="220" y2="230" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" />
      `;
    } else {
      // ACTIVE PLAYING: Progressive strikes 0-6
      bannerColor = strikes >= 5 ? '#ef4444' : (strikes >= 3 ? '#f59e0b' : '#d4af37');
      bannerText = strikes === 0 
        ? 'HANGMAN: SAFE (0 / 6 STRIKES)' 
        : (strikes === 5 ? '⚠️ 1 STRIKE LEFT — CHAT IN DANGER!' : `HANGMAN STRIKES: ${strikes} / 6`);

      // Hanging Rope
      let ropeSvg = `
        <line x1="200" y1="30" x2="200" y2="72" stroke="#e2b93b" stroke-width="3" stroke-dasharray="2,2" />
        <ellipse cx="200" cy="74" rx="5" ry="6" fill="none" stroke="#ca8a04" stroke-width="2.5" />
      `;

      if (strikes === 0) {
        figureSvg = ropeSvg + `
          <!-- Empty Gallows Prompt -->
          <text x="200" y="140" fill="#94a3b8" font-size="13" font-weight="900" text-anchor="middle">NO STRIKES YET</text>
          <text x="200" y="162" fill="#64748b" font-size="11" font-weight="700" text-anchor="middle">GUESS LETTERS IN CHAT!</text>
        `;
      } else {
        // 1: Head
        let headSvg = `
          <circle cx="200" cy="96" r="18" fill="#fde047" stroke="#ca8a04" stroke-width="2.5" />
          <circle cx="194" cy="94" r="2.2" fill="#000" />
          <circle cx="206" cy="94" r="2.2" fill="#000" />
          ${strikes >= 4 ? `
            <!-- Worried Eyebrows & Nervous Mouth -->
            <line x1="191" y1="89" x2="197" y2="92" stroke="#000" stroke-width="1.5" />
            <line x1="203" y1="92" x2="209" y2="89" stroke="#000" stroke-width="1.5" />
            <path d="M 195 106 Q 200 102 205 106" stroke="#000" stroke-width="2" fill="none" />
            <text x="214" y="90" font-size="14">💦</text>
          ` : `
            <path d="M 195 104 Q 200 108 205 104" stroke="#000" stroke-width="1.8" fill="none" />
          `}
        `;

        // 2: Torso
        let torsoSvg = strikes >= 2 ? `
          <line x1="200" y1="114" x2="200" y2="175" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
        ` : '';

        // 3: Left Arm
        let leftArmSvg = strikes >= 3 ? `
          <line x1="200" y1="126" x2="170" y2="158" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />
        ` : '';

        // 4: Right Arm
        let rightArmSvg = strikes >= 4 ? `
          <line x1="200" y1="126" x2="230" y2="158" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />
        ` : '';

        // 5: Left Leg
        let leftLegSvg = strikes >= 5 ? `
          <line x1="200" y1="175" x2="175" y2="225" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />
        ` : '';

        // 6: Right Leg
        let rightLegSvg = strikes >= 6 ? `
          <line x1="200" y1="175" x2="225" y2="225" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />
        ` : '';

        figureSvg = ropeSvg + headSvg + torsoSvg + leftArmSvg + rightArmSvg + leftLegSvg + rightLegSvg;
      }
    }

    return `
      <svg viewBox="0 0 320 270" style="max-width: ${maxWidth}px; max-height: ${maxHeight}px; width: 100%; height: auto; display: block; margin: 0 auto; filter: drop-shadow(0 8px 25px rgba(0,0,0,0.7));">
        <!-- Top Status Text Banner -->
        <text x="160" y="20" fill="${bannerColor}" font-size="12" font-weight="900" text-anchor="middle" letter-spacing="1.5">
          ${bannerText}
        </text>

        <!-- Gallows Platform Base -->
        <line x1="25" y1="250" x2="140" y2="250" stroke="#d4af37" stroke-width="7" stroke-linecap="round" />
        
        <!-- Gallows Upright Pole -->
        <line x1="60" y1="250" x2="60" y2="30" stroke="#d4af37" stroke-width="7" stroke-linecap="round" />
        
        <!-- Gallows Top Horizontal Beam -->
        <line x1="56" y1="30" x2="215" y2="30" stroke="#d4af37" stroke-width="7" stroke-linecap="round" />
        
        <!-- Gallows Diagonal Support Brace -->
        <line x1="60" y1="80" x2="110" y2="30" stroke="#d4af37" stroke-width="5" stroke-linecap="round" />
        
        <!-- Gallows Small Anchor Peg -->
        <circle cx="200" cy="30" r="4" fill="#f59e0b" stroke="#d4af37" stroke-width="1.5" />

        <!-- Ground Shadow Line -->
        <line x1="15" y1="258" x2="305" y2="258" stroke="rgba(212,175,55,0.2)" stroke-width="3" stroke-linecap="round" />

        <!-- Hangman Figure Parts & Animations -->
        ${figureSvg}
      </svg>
    `;
  };
})();
