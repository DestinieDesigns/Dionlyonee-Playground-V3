/**
 * Trivia Helpers & Data Registry
 * Dionlyonee Stream Trivia
 */
(function () {
  window.TriviaDataStore = window.TriviaDataStore || [];

  const tierPoints = {
    easy: 100,
    medium: 200,
    hard: 300,
    expert: 500,
    extreme: 1000
  };

  const TriviaHelpers = {
    addQuestions(list) {
      if (!Array.isArray(list)) return;
      list.forEach((item, index) => {
        const diff = (item.difficulty || item.tier || 'medium').toLowerCase();
        let hintText = item.hint || (item.hostHint ? item.hostHint : 'Host Hint: Think carefully about the key details in the question.');
        if (window.HintValidator && item.answer) {
          const check = window.HintValidator.validateHint(item.answer, hintText);
          hintText = check.safeHint;
        }

        const normalized = {
          id: item.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
          category: item.category || 'General',
          subcategory: item.subcategory || item.subCategory || item.category || 'General',
          difficulty: diff,
          tier: diff,
          points: item.points || tierPoints[diff] || 200,
          question: item.question || '',
          options: Array.isArray(item.options) ? item.options : [],
          answer: item.answer || '',
          hint: hintText
        };
        window.TriviaDataStore.push(normalized);
      });
    },

    getAll() {
      return window.TriviaDataStore;
    },

    getByCategory(category) {
      if (!category || category === 'all' || category === 'ALL') {
        return window.TriviaDataStore;
      }
      return window.TriviaDataStore.filter(q => 
        (q.category && q.category.toLowerCase() === category.toLowerCase()) ||
        (q.subcategory && q.subcategory.toLowerCase() === category.toLowerCase())
      );
    },

    getByTier(tier) {
      if (!tier || tier === 'all' || tier === 'ALL') {
        return window.TriviaDataStore;
      }
      return window.TriviaDataStore.filter(q => (q.difficulty || q.tier || '').toLowerCase() === tier.toLowerCase());
    },

    getByDifficulty(diff) {
      return this.getByTier(diff);
    },

    getByCategoryAndTier(category, tier) {
      let list = this.getByCategory(category);
      if (!tier || tier === 'all' || tier === 'ALL') {
        return list;
      }
      return list.filter(q => (q.difficulty || q.tier || '').toLowerCase() === tier.toLowerCase());
    },

    getCategories() {
      const cats = new Set();
      window.TriviaDataStore.forEach(q => {
        if (q.category) cats.add(q.category);
      });
      return Array.from(cats);
    },

    getSubcategories(category) {
      const subcats = new Set();
      window.TriviaDataStore.forEach(q => {
        if (!category || category === 'all' || q.category.toLowerCase() === category.toLowerCase()) {
          if (q.subcategory) subcats.add(q.subcategory);
        }
      });
      return Array.from(subcats);
    }
  };

  window.TriviaHelpers = TriviaHelpers;
})();
