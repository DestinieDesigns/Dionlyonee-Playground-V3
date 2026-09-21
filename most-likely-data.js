// Dionlyonee Most Likely To - Stream Discussion Flashcards Dataset
// Pure Vanilla JavaScript

const MOST_LIKELY_CATEGORIES = [
  { key: 'ALL', label: 'ALL DECKS (SHUFFLED)', icon: '🎭', color: '#d4af37' },
  { key: 'FUNNY', label: 'FUNNY & RELATABLE', icon: '😂', color: '#fbbf24' },
  { key: 'CHAOTIC', label: 'CHAOTIC & UNHINGED', icon: '😈', color: '#f43f5e' },
  { key: 'FRIENDS', label: 'FRIENDS & DYNAMICS', icon: '💕', color: '#ec4899' },
  { key: 'STREAMER', label: 'STREAMER & GAMER', icon: '🎮', color: '#8b5cf6' },
  { key: 'FUTURE', label: 'FUTURE & SUCCESS', icon: '🧠', color: '#3b82f6' },
  { key: 'EMBARRASSING', label: 'CRINGE & CONFESSIONS', icon: '💀', color: '#10b981' }
];

const MOST_LIKELY_CARDS = [
  // 😂 FUNNY & RELATABLE
  { id: 'f-1', category: 'FUNNY', text: 'Fall asleep in the middle of an intense movie? 😴' },
  { id: 'f-2', category: 'FUNNY', text: 'Walk into a room and instantly forget why they are there? 🤔' },
  { id: 'f-3', category: 'FUNNY', text: 'Start laughing at the absolute most inappropriate moment? 🤭' },
  { id: 'f-4', category: 'FUNNY', text: 'Trip over air and casually look around to see if anyone saw? 🤸' },
  { id: 'f-5', category: 'FUNNY', text: 'Search for their phone for 10 minutes while actively on a phone call? 📱' },
  { id: 'f-6', category: 'FUNNY', text: 'Talk to themselves out loud in public with dramatic hand gestures? 🗣️' },
  { id: 'f-7', category: 'FUNNY', text: 'Drop food on the floor and aggressively enforce the 5-second rule? 🍕' },
  { id: 'f-8', category: 'FUNNY', text: 'Forget someone’s name literally 2 seconds after being introduced? 😅' },
  { id: 'f-9', category: 'FUNNY', text: 'Accidentally send a screenshot to the exact person the screenshot is about? 📤' },
  { id: 'f-10', category: 'FUNNY', text: 'Laugh so hard that they start wheezing and clapping like a seal? 😂' },
  { id: 'f-11', category: 'FUNNY', text: 'Get hopelessly lost while using GPS navigation with voice guidance? 🗺️' },
  { id: 'f-12', category: 'FUNNY', text: 'Walk full speed into a squeaky-clean sliding glass door? 🚪' },
  { id: 'f-13', category: 'FUNNY', text: 'Leave the house wearing two completely different shoes or mismatched socks? 🧦' },
  { id: 'f-14', category: 'FUNNY', text: 'Sing the completely wrong song lyrics with 100% confidence? 🎤' },
  { id: 'f-15', category: 'FUNNY', text: 'Burn a bowl of instant noodles in the microwave? 🍳' },
  { id: 'f-16', category: 'FUNNY', text: 'Say "You too!" when the waiter says "Enjoy your meal!"? 🍽️' },
  { id: 'f-17', category: 'FUNNY', text: 'Accidentally like a 6-year-old Instagram photo while deep stalking? 📸' },

  // 😈 CHAOTIC & UNHINGED
  { id: 'c-1', category: 'CHAOTIC', text: 'Accidentally start drama without even realizing what they did? 💣' },
  { id: 'c-2', category: 'CHAOTIC', text: 'Survive an entire zombie apocalypse strictly on pure dumb luck? 🧟' },
  { id: 'c-3', category: 'CHAOTIC', text: 'Get kicked out of a venue for something completely ridiculous? 🚨' },
  { id: 'c-4', category: 'CHAOTIC', text: 'Accidentally become a viral internet meme with millions of views? 🌟' },
  { id: 'c-5', category: 'CHAOTIC', text: 'Disappear for 4 days and reappear acting like absolutely nothing happened? 👻' },
  { id: 'c-6', category: 'CHAOTIC', text: 'Press the giant red button marked "DO NOT TOUCH UNDER ANY CIRCUMSTANCES"? 🔴' },
  { id: 'c-7', category: 'CHAOTIC', text: 'Get into a 4-hour passionate argument with a complete stranger in the comments? ⌨️' },
  { id: 'c-8', category: 'CHAOTIC', text: 'Say "Watch this!" right before an absolute disaster occurs? ⚠️' },
  { id: 'c-9', category: 'CHAOTIC', text: 'Scream at the top of their lungs at a tiny harmless house moth? 🪳' },
  { id: 'c-10', category: 'CHAOTIC', text: 'Make a terrible life choice purely for the hilarious story afterwards? 📖' },
  { id: 'c-11', category: 'CHAOTIC', text: 'Order $120 of DoorDash at 3:00 AM and regret it by sunrise? 🍔' },
  { id: 'c-12', category: 'CHAOTIC', text: 'Adopt 5 stray animals without asking anyone in the house? 🐾' },

  // 💕 FRIENDS & DYNAMICS
  { id: 'r-1', category: 'FRIENDS', text: 'Cancel plans 10 minutes before with a wild dramatic excuse? 🛋️' },
  { id: 'r-2', category: 'FRIENDS', text: 'Show up 45 minutes late to their own birthday celebration with an iced coffee? ⏰' },
  { id: 'r-3', category: 'FRIENDS', text: 'Become everyone’s unofficial late-night therapist and life advisor? 🛋️' },
  { id: 'r-4', category: 'FRIENDS', text: 'Disappear from the group chat for 3 weeks with zero warning? 💨' },
  { id: 'r-5', category: 'FRIENDS', text: 'Reply to an urgent text message 5 business days later with "omg so sorry!"? 💬' },
  { id: 'r-6', category: 'FRIENDS', text: 'Know all the latest community gossip before anyone else even heard a whisper? ☕' },
  { id: 'r-7', category: 'FRIENDS', text: 'Take 40 minutes in front of the mirror just to make a quick corner store run? 💄' },
  { id: 'r-8', category: 'FRIENDS', text: 'Make 10 brand new best friends in the bathroom line at an event? 🤝' },
  { id: 'r-9', category: 'FRIENDS', text: 'Plan a weekend trip with a 15-page color-coded spreadsheet itinerary? 📋' },
  { id: 'r-10', category: 'FRIENDS', text: 'Rage quit the friend group chat after a heated debate on food or pineapple on pizza? 🚪' },

  // 🎮 STREAMER & GAMER
  { id: 'g-1', category: 'STREAMER', text: 'Rage quit and slam the desk after getting eliminated in the first 30 seconds? 💥' },
  { id: 'g-2', category: 'STREAMER', text: 'Blame lag, high ping, or the controller for missing the easiest shot in history? 🎮' },
  { id: 'g-3', category: 'STREAMER', text: 'Accidentally throw a grenade that wipes out their entire squad? 💣' },
  { id: 'g-4', category: 'STREAMER', text: 'Carry the entire team to victory with a legendary clutch moment? 🏆' },
  { id: 'g-5', category: 'STREAMER', text: 'Say "just one more quick match" and still be playing at 5:30 AM? 🌙' },
  { id: 'g-6', category: 'STREAMER', text: 'Talk enthusiastically for 10 minutes before realizing their mic was muted? 🔇' },
  { id: 'g-7', category: 'STREAMER', text: 'Spend half their monthly paycheck on in-game cosmetic skins and dances? 💎' },
  { id: 'g-8', category: 'STREAMER', text: 'Accidentally leak their desktop background or weird tabs live on stream? 🎙️' },
  { id: 'g-9', category: 'STREAMER', text: 'Get scared so badly by a horror game that they physically fall out of their chair? 😱' },
  { id: 'g-10', category: 'STREAMER', text: 'Have 47 open browser tabs with videos they swear they are going to watch later? 📑' },

  // 🧠 FUTURE & SUCCESS
  { id: 'p-1', category: 'FUTURE', text: 'Run for public office on a complete dare and somehow win? 🏛️' },
  { id: 'p-2', category: 'FUTURE', text: 'Move to a tropical island, buy a boat, and open a beach juice bar? 🌴' },
  { id: 'p-3', category: 'FUTURE', text: 'Invent a bizarre viral gadget that turns them into a multimillionaire? 💡' },
  { id: 'p-4', category: 'FUTURE', text: 'Win the jackpot lottery and tell absolutely nobody for 5 years? 💰' },
  { id: 'p-5', category: 'FUTURE', text: 'Write a bestselling, spicy tell-all autobiography about their friend group? 📚' },
  { id: 'p-6', category: 'FUTURE', text: 'Accidentally stumble into becoming a famous celebrity bodyguard? 🕶️' },
  { id: 'p-7', category: 'FUTURE', text: 'Start a luxury podcast studio in their garage? 🎙️' },

  // 💀 CRINGE & CONFESSIONS
  { id: 'e-1', category: 'EMBARRASSING', text: 'Wave back enthusiastically to someone who was waving to the person behind them? 🙋' },
  { id: 'e-2', category: 'EMBARRASSING', text: 'Nod along and pretend to understand a joke just to avoid feeling left out? 🤐' },
  { id: 'e-3', category: 'EMBARRASSING', text: 'Try to push a heavy glass door that clearly has a giant "PULL" sign on it? 🚪' },
  { id: 'e-4', category: 'EMBARRASSING', text: 'Have a full emotional breakdown because their favorite snack was out of stock? 😭' },
  { id: 'e-5', category: 'EMBARRASSING', text: 'Hold the elevator for someone who is clearly walking in the opposite direction? 🛗' },
  { id: 'e-6', category: 'EMBARRASSING', text: 'Accidentally call their teacher or boss "Mom"? 😳' }
];

window.MOST_LIKELY_CATEGORIES = MOST_LIKELY_CATEGORIES;
window.MOST_LIKELY_CARDS = MOST_LIKELY_CARDS;
