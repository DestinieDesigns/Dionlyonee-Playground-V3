/**
 * Trivia Host Desk Controller
 */
(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const isSolo = urlParams.get('singleplayer') === 'true' || urlParams.get('solo') === 'true';
  let currentTier = 'all';
  let selectedCategory = 'all';
  let activeQuestion = null;
  let showWaitingScreen = false;
  let soloAnswered = false;

  function init() {
    if (window.FirebaseRoom) {
      window.FirebaseRoom.gameType = 'trivia';
    }
    if (window.HostAuth) {
      window.HostAuth.requireHostAccess(() => {
        setupDesk();
      });
    } else {
      setupDesk();
    }
  }

  function getAllQuestions() {
    if (window.TriviaHelpers && window.TriviaHelpers.getAll().length > 0) {
      return window.TriviaHelpers.getAll();
    }
    return window.TriviaData ? window.TriviaData.getAll() : (window.TriviaDataStore || []);
  }

  function getUniqueCategories() {
    const list = getAllQuestions();
    const cats = new Set();
    list.forEach(q => {
      if (q.category) cats.add(q.category);
    });
    return Array.from(cats);
  }

  function getQuestionsForCategory(cat) {
    const list = getAllQuestions();
    if (!cat || cat === 'all') return list;
    return list.filter(q => 
      (q.category && q.category.toLowerCase() === cat.toLowerCase()) ||
      (q.subcategory && q.subcategory.toLowerCase() === cat.toLowerCase())
    );
  }

  function populateCategoryControls() {
    const catSelect = document.getElementById('trivia-category-select');
    const qSelect = document.getElementById('trivia-question-select');
    const countEl = document.getElementById('trivia-question-count');
    if (!catSelect || !qSelect) return;

    const categories = getUniqueCategories();
    const allQuestions = getAllQuestions();

    catSelect.innerHTML = [
      `<option value="all" ${selectedCategory === 'all' ? 'selected' : ''}>🌟 ALL CATEGORIES (${allQuestions.length} Total)</option>`,
      ...categories.map(c => {
        const count = getQuestionsForCategory(c).length;
        return `<option value="${c}" ${selectedCategory === c ? 'selected' : ''}>📁 ${c} (${count})</option>`;
      })
    ].join('');

    populateQuestionSelect();

    catSelect.onchange = (e) => {
      selectedCategory = e.target.value;
      populateQuestionSelect();
      pickRandomInCategory();
    };

    qSelect.onchange = (e) => {
      const qId = e.target.value;
      const q = getAllQuestions().find(item => item.id === qId);
      if (q) {
        showWaitingScreen = false;
        updateWaitingButtonUI();
        loadSpecificQuestion(q);
      }
    };

    const randBtn = document.getElementById('btn-trivia-random-cat');
    if (randBtn) {
      randBtn.onclick = () => pickRandomInCategory();
    }

    const waitBtn = document.getElementById('btn-trivia-toggle-waiting');
    if (waitBtn) {
      waitBtn.onclick = () => toggleWaitingScreen();
    }
  }

  function populateQuestionSelect() {
    const qSelect = document.getElementById('trivia-question-select');
    const countEl = document.getElementById('trivia-question-count');
    if (!qSelect) return;

    const questions = getQuestionsForCategory(selectedCategory);
    if (countEl) countEl.textContent = `${questions.length} QUESTIONS IN CATEGORY`;

    qSelect.innerHTML = questions.map((q, idx) => {
      const isCurrent = activeQuestion && activeQuestion.id === q.id;
      const snippet = q.question.length > 55 ? q.question.substring(0, 52) + '...' : q.question;
      return `<option value="${q.id}" ${isCurrent ? 'selected' : ''}>#${idx + 1} [${q.points}pts] ${snippet}</option>`;
    }).join('');
  }

  function pickRandomInCategory() {
    const pool = getQuestionsForCategory(selectedCategory);
    if (!pool.length) return;
    const otherPool = activeQuestion ? pool.filter(q => q.id !== activeQuestion.id) : pool;
    const chosen = otherPool.length
      ? otherPool[Math.floor(Math.random() * otherPool.length)]
      : pool[0];
    showWaitingScreen = false;
    updateWaitingButtonUI();
    loadSpecificQuestion(chosen);
  }

  function toggleWaitingScreen() {
    showWaitingScreen = !showWaitingScreen;
    updateWaitingButtonUI();
    if (window.FirebaseRoom) {
      window.FirebaseRoom.broadcastState({
        gameType: 'trivia',
        showWaitingScreen,
        phase: showWaitingScreen ? 'waiting' : 'question',
        question: activeQuestion,
        timestamp: Date.now()
      });
    }
  }

  function updateWaitingButtonUI() {
    const waitBtn = document.getElementById('btn-trivia-toggle-waiting');
    if (!waitBtn) return;
    if (showWaitingScreen) {
      waitBtn.textContent = '📺 SHOWING WAITING SCREEN (CLICK TO GO LIVE)';
      waitBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      waitBtn.style.color = '#000';
    } else {
      waitBtn.textContent = '📺 PAST WAITING SCREEN (STAGE LIVE)';
      waitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      waitBtn.style.color = '#000';
    }
  }

  function setupDesk() {
    if (window.RoomUI) {
      window.RoomUI.attachHUD('.main-header', 'trivia');
    }

    if (isSolo) {
      const revealBtn = document.getElementById('btn-reveal-answer');
      if (revealBtn) revealBtn.textContent = '👁️ GIVE UP & REVEAL';
      const mainHeader = document.querySelector('.main-header');
      if (mainHeader && !document.getElementById('solo-trivia-badge')) {
        const badge = document.createElement('div');
        badge.id = 'solo-trivia-badge';
        badge.style.cssText = 'font-size: 12px; font-weight: 800; color: #10b981; background: rgba(16,185,129,0.15); border: 1px solid #10b981; padding: 4px 12px; border-radius: 8px; margin-top: 6px; display: inline-block;';
        badge.textContent = '🎯 SOLO MODE: Click an option to lock in your answer!';
        mainHeader.appendChild(badge);
      }
    }

    renderContestants();
    populateCategoryControls();

    // Tier buttons
    document.querySelectorAll('.tier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTier = btn.getAttribute('data-tier') || 'all';
        loadNext();
      });
    });

    document.getElementById('btn-next-question').addEventListener('click', () => {
      loadNext();
    });

    document.getElementById('btn-reveal-answer').addEventListener('click', () => {
      if (activeQuestion && window.TriviaGame) {
        window.TriviaGame.revealAnswer();
        document.querySelectorAll('.trivia-opt-btn').forEach(b => {
          if (b.getAttribute('data-opt') === activeQuestion.answer) {
            b.style.background = '#10b981';
            b.style.color = '#07090e';
          }
        });
      }
    });

    document.getElementById('btn-start-timer').addEventListener('click', () => {
      const timeSec = (activeQuestion && activeQuestion.timeSec) || 15;
      if (window.TimerManager) {
        window.TimerManager.start(timeSec, null, () => {
          if (window.SoundManager) window.SoundManager.playSound('timeup', true);
          else if (window.sounds) window.sounds.play('wrong');
        });
      }
      if (window.FirebaseRoom) {
        window.FirebaseRoom.broadcastState({
          gameType: 'trivia',
          phase: 'timer',
          showWaitingScreen: false,
          question: activeQuestion,
          timeSec,
          timestamp: Date.now()
        }, 'tick');
      }
    });

    // Soundboard buttons
    document.querySelectorAll('.btn-sfx-trivia').forEach(btn => {
      btn.addEventListener('click', () => {
        const sound = btn.getAttribute('data-sound');
        if (sound) {
          if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
            window.SoundManager.playSound(sound, true);
          } else if (window.sounds) {
            window.sounds.play(sound);
          }
        }
      });
    });

    // Listen for mobile buzzers
    if (window.FirebaseRoom) {
      window.FirebaseRoom.onBuzzer((data) => {
        if (window.sounds) window.sounds.play('buzzer');
        alert(`🚨 BUZZ IN: ${data.player || 'Player'} buzzed!`);
      });
    }

    // Listen for Phone Controller / Remote Actions
    const sync = window.RoomSync || window.FirebaseRoom;
    if (sync && typeof sync.onAction === 'function') {
      sync.onAction((data) => {
        const action = data.action;
        if (action === 'NEXT_QUESTION' || action === 'NEXT_ROUND' || action === 'START_ROUND') {
          showWaitingScreen = false;
          updateWaitingButtonUI();
          loadNext();
        } else if (action === 'REVEAL_ANSWER' || action === 'REVEAL' || action === 'REVEAL_ALL') {
          if (activeQuestion && window.TriviaGame) {
            window.TriviaGame.revealAnswer();
            document.querySelectorAll('.trivia-opt-btn').forEach(b => {
              if (b.getAttribute('data-opt') === activeQuestion.answer) {
                b.style.background = '#10b981';
                b.style.color = '#07090e';
              }
            });
          }
        } else if (action === 'START_TIMER' || action === 'TIMER') {
          const timeSec = (activeQuestion && activeQuestion.timeSec) || 15;
          if (window.TimerManager) {
            window.TimerManager.start(timeSec, null, () => {
              if (window.SoundManager) window.SoundManager.playSound('timeup', true);
            });
          }
          if (window.FirebaseRoom) {
            window.FirebaseRoom.broadcastState({
              gameType: 'trivia',
              phase: 'timer',
              showWaitingScreen: false,
              question: activeQuestion,
              timeSec,
              timestamp: Date.now()
            }, 'tick');
          }
        } else if (action === 'PAUSE_TIMER' || action === 'PAUSE') {
          if (window.TimerManager) window.TimerManager.stop();
        } else if (action === 'ENTER_COOLDOWN' || action === 'COOLDOWN') {
          showWaitingScreen = true;
          updateWaitingButtonUI();
          if (window.FirebaseRoom) {
            window.FirebaseRoom.broadcastState({
              gameType: 'trivia',
              phase: 'cooldown',
              isCooldown: true,
              showWaitingScreen: true,
              timestamp: Date.now()
            });
          }
        } else if (action === 'AWARD_POINTS' || action === 'CORRECT') {
          const idx = (data.payload && typeof data.payload.contestantIndex === 'number') ? data.payload.contestantIndex : 0;
          const pts = activeQuestion ? activeQuestion.points : 200;
          if (window.ContestantManager) {
            window.ContestantManager.addRoundScore(pts, idx);
            renderContestants();
          }
          if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
            window.SoundManager.playSound('correct', true);
          }
          if (window.FirebaseRoom) {
            window.FirebaseRoom.broadcastState({
              gameType: 'trivia',
              contestants: window.ContestantManager.getContestants()
            }, 'correct');
          }
        } else if (action === 'BUZZER' || action === 'WRONG') {
          if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
            window.SoundManager.playSound('buzzer', true);
          }
          if (window.FirebaseRoom) {
            window.FirebaseRoom.broadcastSound('buzzer');
          }
        }
      });
    }

    window.addEventListener('trivia-data-loaded', () => {
      populateCategoryControls();
      if (!activeQuestion) {
        loadNext();
      }
    });

    loadNext();
  }

  function loadNext() {
    if (window.TriviaRandomizer) {
      activeQuestion = window.TriviaRandomizer.pickQuestion(currentTier, selectedCategory);
      showWaitingScreen = false;
      updateWaitingButtonUI();
      loadSpecificQuestion(activeQuestion);
    }
  }

  function loadSpecificQuestion(q) {
    activeQuestion = q;
    soloAnswered = false;
    const container = document.getElementById('trivia-active-card');
    if (container && window.TriviaUI) {
      window.TriviaUI.renderQuestionCard(container, activeQuestion, isSolo ? false : true);
      if (isSolo) {
        container.querySelectorAll('.trivia-opt-btn').forEach(btn => {
          btn.style.cursor = 'pointer';
          btn.addEventListener('mouseenter', () => {
            if (!soloAnswered) btn.style.background = 'rgba(255,255,255,0.15)';
          });
          btn.addEventListener('mouseleave', () => {
            if (!soloAnswered) btn.style.background = 'rgba(255,255,255,0.05)';
          });
          btn.addEventListener('click', () => {
            if (soloAnswered) return;
            soloAnswered = true;
            const chosen = btn.getAttribute('data-opt');
            const isCorrect = chosen === activeQuestion.answer;
            container.querySelectorAll('.trivia-opt-btn').forEach(b => {
              b.style.pointerEvents = 'none';
              if (b.getAttribute('data-opt') === activeQuestion.answer) {
                b.style.background = '#10b981';
                b.style.color = '#07090e';
                b.style.borderColor = '#34d399';
                b.style.fontWeight = '900';
                b.innerHTML += ' <span style="float: right; font-weight: 900; color: #07090e;">✓ (CORRECT)</span>';
              }
            });
            if (isCorrect) {
              if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
                window.SoundManager.playSound('correct', true);
              } else if (window.sounds) {
                window.sounds.play('correct');
              }
              if (window.ContestantManager) {
                window.ContestantManager.addRoundScore(activeQuestion.points || 200, 0);
                renderContestants();
              }
            } else {
              btn.style.background = '#ef4444';
              btn.style.color = '#fff';
              btn.style.borderColor = '#f87171';
              btn.innerHTML += ' <span style="float: right; font-weight: 900; color: #fff;">❌ (YOUR GUESS)</span>';
              if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
                window.SoundManager.playSound('buzzer', true);
              } else if (window.sounds) {
                window.sounds.play('wrong');
              }
            }
          });
        });
      }
    }
    populateQuestionSelect();
    if (window.TriviaGame) {
      window.TriviaGame.startQuestion(activeQuestion);
    }
    if (window.FirebaseRoom) {
      window.FirebaseRoom.broadcastState({
        gameType: 'trivia',
        phase: 'question',
        showWaitingScreen: false,
        question: activeQuestion,
        timestamp: Date.now()
      });
    }
  }

  function renderContestants() {
    const list = document.getElementById('trivia-contestants-list');
    if (!list || !window.ContestantManager) return;
    const contestants = window.ContestantManager.getContestants();

    contestants.forEach((c, i) => {
      let row = document.getElementById(`trivia-host-c-row-${i}`);
      if (!row) {
        row = document.createElement('div');
        row.id = `trivia-host-c-row-${i}`;
        row.style.cssText = `
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 6px;
        `;
        row.innerHTML = `
          <span class="trivia-host-c-name" style="font-weight: 700; color: #fff;">${c.name}</span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong id="trivia-host-score-${i}" class="contestant-score-val" style="color: #c084fc;">${c.roundScore || 0} PTS</strong>
            <button class="add-pts-btn" data-idx="${i}" style="
              background: rgba(16,185,129,0.2); color: #10b981; border: 1px solid #10b981;
              padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 800; cursor: pointer;
            ">+PTS</button>
          </div>
        `;
        list.appendChild(row);

        const btn = row.querySelector('.add-pts-btn');
        if (btn) {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            const pts = activeQuestion ? activeQuestion.points : 200;
            window.ContestantManager.addRoundScore(pts, idx);
            renderContestants();
            if (window.SoundManager && typeof window.SoundManager.playSound === 'function') {
              window.SoundManager.playSound('correct', true);
            }
            if (window.FirebaseRoom) {
              window.FirebaseRoom.broadcastState({
                gameType: 'trivia',
                contestants: window.ContestantManager.getContestants()
              }, 'correct');
            }
          });
        }
      } else {
        const nameEl = row.querySelector('.trivia-host-c-name');
        const scoreEl = document.getElementById(`trivia-host-score-${i}`);
        if (nameEl) nameEl.textContent = c.name;
        if (scoreEl && window.animateScoreDisplay) {
          window.animateScoreDisplay(scoreEl, c.roundScore || 0, { prefix: '', suffix: ' PTS' });
        }
      }
    });
  }

  window.addEventListener('DOMContentLoaded', init);
})();
