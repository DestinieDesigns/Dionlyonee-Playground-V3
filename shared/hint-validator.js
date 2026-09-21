/**
 * Dionlyonee Stream Games - Hint Validator & Quality Engine
 * Ensures hints are helpful, contextual, and NEVER spoil the answer.
 * 
 * Rules:
 * - Hint must NOT contain the exact answer (case-insensitive)
 * - Hint must NOT contain prominent answer words (e.g. "fried chicken" -> "chicken")
 * - Hint must NOT repeat phrases like "the answer is..."
 * - Multi-word answers: filters out keywords that give away the puzzle
 */
(function (root) {
  'use strict';

  // Common stopwords to exclude when checking keyword overlap
  const STOP_WORDS = new Set([
    'A', 'AN', 'THE', 'AND', 'OR', 'BUT', 'NOR', 'FOR', 'SO', 'YET',
    'IN', 'ON', 'AT', 'TO', 'OF', 'BY', 'WITH', 'ABOUT', 'AGAINST',
    'BETWEEN', 'INTO', 'THROUGH', 'DURING', 'BEFORE', 'AFTER', 'ABOVE',
    'BELOW', 'FROM', 'UP', 'DOWN', 'OUT', 'OFF', 'OVER', 'UNDER',
    'IS', 'AM', 'ARE', 'WAS', 'WERE', 'BE', 'BEEN', 'BEING',
    'HAVE', 'HAS', 'HAD', 'DO', 'DOES', 'DID', 'WILL', 'WOULD', 'SHALL',
    'SHOULD', 'MAY', 'MIGHT', 'MUST', 'CAN', 'COULD', 'YOU', 'YOUR', 'HE',
    'SHE', 'IT', 'WE', 'THEY', 'THIS', 'THAT', 'THESE', 'THOSE'
  ]);

  const HintValidator = {
    /**
     * Extracts significant content words from a phrase (excluding stopwords and short tokens).
     */
    getSignificantWords(phrase) {
      if (!phrase || typeof phrase !== 'string') return [];
      const tokens = phrase.toUpperCase().replace(/[^A-Z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
      return tokens.filter((w) => w.length > 2 && !STOP_WORDS.has(w));
    },

    /**
     * Validates whether a hint is safe to display or contains answer spoilers.
     * @param {string} answer The puzzle answer
     * @param {string} hint The proposed hint text
     * @returns {{ valid: boolean, warnings: string[], safeHint: string }}
     */
    validateHint(answer, hint) {
      const warnings = [];
      if (!hint || typeof hint !== 'string') {
        return {
          valid: false,
          warnings: ['No hint provided'],
          safeHint: 'Think carefully about the category and common patterns.'
        };
      }

      if (!answer || typeof answer !== 'string') {
        return { valid: true, warnings: [], safeHint: hint.trim() };
      }

      const cleanAns = answer.trim().toUpperCase();
      const cleanHint = hint.trim();
      const upperHint = cleanHint.toUpperCase();

      // 1. Check for exact full answer inside hint
      if (upperHint.includes(cleanAns)) {
        warnings.push(`Hint contains the exact answer "${cleanAns}".`);
      }

      // 2. Check for significant words in the answer
      const answerWords = this.getSignificantWords(cleanAns);
      const spoiledWords = [];

      answerWords.forEach((word) => {
        // Use word boundary regex to avoid partial substring false positives
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(upperHint)) {
          spoiledWords.push(word);
        }
      });

      if (spoiledWords.length > 0) {
        warnings.push(`Hint directly contains key answer words: [${spoiledWords.join(', ')}]`);
      }

      // 3. Check for lazy hint phrasing
      if (/THE ANSWER IS/i.test(upperHint) || /THE PHRASE IS/i.test(upperHint) || /BASICALLY/i.test(upperHint)) {
        warnings.push('Hint uses prohibited giveaway phrasing ("the answer is...", "basically").');
      }

      // Generate a sanitized safe hint if spoilers exist
      let safeHint = cleanHint;
      if (spoiledWords.length > 0 || upperHint.includes(cleanAns)) {
        // Obscure or redact the spoiled words
        let sanitized = cleanHint;
        spoiledWords.forEach((word) => {
          const reg = new RegExp(`\\b${word}\\b`, 'gi');
          sanitized = sanitized.replace(reg, '[CLUE]');
        });
        safeHint = sanitized;
      }

      return {
        valid: warnings.length === 0,
        warnings,
        safeHint
      };
    },

    /**
     * Formats hint text with progressive levels (Level 1: General Category Clue, Level 2: Context Clue, Level 3: Closer Clue)
     */
    formatProgressiveHint(answer, baseHint, level = 1) {
      const val = this.validateHint(answer, baseHint);
      const cleanHint = val.safeHint;
      const wordCount = (answer || '').trim().split(/\s+/).length;
      const letterCount = (answer || '').replace(/[^A-Za-z0-9]/g, '').length;

      if (level === 1) {
        return `💡 Structure: ${wordCount} word${wordCount > 1 ? 's' : ''}, ${letterCount} letters total.`;
      } else if (level === 2) {
        return `💡 Clue: ${cleanHint}`;
      } else {
        const firstLetter = (answer || '').trim().charAt(0).toUpperCase();
        return `💡 Direct Clue: ${cleanHint} (Starts with letter "${firstLetter}")`;
      }
    }
  };

  root.HintValidator = HintValidator;
})(typeof window !== 'undefined' ? window : this);
