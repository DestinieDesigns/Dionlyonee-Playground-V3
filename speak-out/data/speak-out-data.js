/**
 * DIONLYONEE SPEAK OUT! - Unified Game Catalog & Mode Metadata
 */
(function () {
  const SpeakOutModes = {
    'tongue-twister': {
      id: 'tongue-twister',
      shortId: 'tongue',
      name: 'TONGUE TWISTER',
      icon: '👅',
      accent: '#ec4899', // Hot pink
      defaultTimer: 20,
      badge: 'SPEED & DICTION',
      rules: 'Say the tongue twister clearly as directed without stuttering, spitting, or halting! The Co-Host judges clarity.',
      scoring: { easy: 50, medium: 100, hard: 200, extreme: 500 },
      getItems: () => window.TongueTwisters || []
    },
    'rapid-fire': {
      id: 'rapid-fire',
      shortId: 'rapid',
      name: 'RAPID FIRE',
      icon: '⚡',
      accent: '#f59e0b', // Amber
      defaultTimer: 15,
      badge: 'QUICK THINKING',
      rules: 'Name the required number of items before the timer reaches zero! No pauses, no duplicates.',
      scoring: { easy: 50, medium: 100, hard: 200, extreme: 500 },
      getItems: () => window.RapidFire || []
    },
    'forbidden-words': {
      id: 'forbidden-words',
      shortId: 'forbidden',
      name: 'FORBIDDEN WORDS',
      icon: '🚫',
      accent: '#ef4444', // Red
      defaultTimer: 30,
      badge: 'TABOO CHALLENGE',
      rules: 'Describe the secret target word without saying ANY of the 4 forbidden words! If you slip, Co-Host hits the buzzer!',
      scoring: { easy: 50, medium: 100, hard: 200, extreme: 500 },
      getItems: () => window.ForbiddenWords || []
    },
    'voice-challenge': {
      id: 'voice-challenge',
      shortId: 'voice',
      name: 'VOICE CHALLENGE',
      icon: '🎭',
      accent: '#a855f7', // Purple
      defaultTimer: 20,
      badge: 'CHARACTER ACTING',
      rules: 'Deliver the phrase in full character voice with facial expressions! No breaking character or laughing.',
      scoring: { easy: 50, medium: 100, hard: 200, extreme: 500 },
      getItems: () => window.VoiceChallenges || []
    },
    'keep-talking': {
      id: 'keep-talking',
      shortId: 'talk',
      name: 'KEEP TALKING',
      icon: '🗣️',
      accent: '#3b82f6', // Blue
      defaultTimer: 30,
      badge: 'ZERO DEAD AIR',
      rules: 'Talk continuously about the given topic for the entire duration! No pauses longer than 2 seconds, no filler spam.',
      scoring: { easy: 50, medium: 100, hard: 200, extreme: 500 },
      getItems: () => window.KeepTalking || []
    },
    'finish-the-phrase': {
      id: 'finish-the-phrase',
      shortId: 'phrase',
      name: 'FINISH THE PHRASE',
      icon: '🧩',
      accent: '#10b981', // Emerald
      defaultTimer: 15,
      badge: 'IDIOM REACTION',
      rules: 'Complete the famous idiom, proverb, or catchphrase before the buzzer sounds! Hint can be revealed if stuck.',
      scoring: { easy: 50, medium: 100, hard: 200, extreme: 500 },
      getItems: () => window.FinishThePhrase || []
    }
  };

  const SpeakOutData = {
    modes: SpeakOutModes,
    modeKeys: Object.keys(SpeakOutModes),
    getMode(key) {
      if (!key) return SpeakOutModes['tongue-twister'];
      const clean = key.toLowerCase();
      if (SpeakOutModes[clean]) return SpeakOutModes[clean];
      for (const m of Object.values(SpeakOutModes)) {
        if (m.shortId === clean || m.id === clean) return m;
      }
      return SpeakOutModes['tongue-twister'];
    },
    getAllItems(modeKey) {
      const mode = this.getMode(modeKey);
      return mode ? mode.getItems() : [];
    },
    getTotalChallengeCount() {
      let count = 0;
      for (const m of Object.values(SpeakOutModes)) {
        count += m.getItems().length;
      }
      return count;
    }
  };

  window.SpeakOutModes = SpeakOutModes;
  window.SpeakOutData = SpeakOutData;
})();
