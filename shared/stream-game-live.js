/**
 * Dionlyonee Playground - Universal Stream Game Live Audience Screen
 * Receives broadcast updates over BroadcastChannel and displays live prompt cards,
 * countdown timers, reveal animations, and sound effects.
 */
(function () {
  'use strict';

  class StreamGameLive {
    constructor(gameId) {
      this.gameId = gameId;
      this.gameMeta = (window.StreamGamesData && window.StreamGamesData[gameId]) || {
        title: gameId.toUpperCase().replace(/-/g, ' '),
        badge: 'LIVE SHOW',
        prompts: []
      };

      this.channel = new BroadcastChannel('dionlyonee-stream-games');
      this.state = null;

      this.init();
    }

    init() {
      this.ensureHeartPowerLoaded();

      // Listen for broadcasts
      this.channel.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'HEART_ME_TRIGGER' || data.action === 'HEART_ME_TRIGGER') {
          if (window.HeartPowerSystem) {
            window.HeartPowerSystem.triggerLiveAnimation(data);
          }
          return;
        }

        if (data.type === 'UPDATE_STATE' && data.state && data.state.gameId === this.gameId) {
          this.state = data.state;
          this.render();
        } else if (data.type === 'PLAY_SOUND' && data.gameId === this.gameId) {
          if (window.Sounds && typeof window.Sounds[data.sound] === 'function') {
            window.Sounds[data.sound]();
          }
        }
      };

      // Load cached state
      try {
        const cached = sessionStorage.getItem(`dion_stream_game_${this.gameId}`);
        if (cached) {
          this.state = JSON.parse(cached);
        }
      } catch (e) {}

      // If no state yet, load default first prompt
      if (!this.state) {
        const firstPrompt = (this.gameMeta.prompts && this.gameMeta.prompts[0]) || {};
        this.state = {
          gameId: this.gameId,
          currentIndex: 0,
          prompt: firstPrompt,
          remainingSeconds: 30,
          isRunning: false,
          revealedClues: 1,
          revealedAnswer: false,
          votes: { optionA: 0, optionB: 0 },
          hangmanState: this.gameId === 'hangman' ? {
            guessedLetters: [],
            strikes: 0,
            maxStrikes: 6,
            status: 'PLAYING',
            showHint: false
          } : null
        };
      }

      this.render();

      try {
        this.channel.postMessage({ type: 'REQUEST_STATE', gameId: this.gameId });
      } catch (e) {}
    }

    ensureHeartPowerLoaded() {
      if (!document.querySelector('link[href*="heart-power.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/shared/heart-power.css';
        document.head.appendChild(link);
      }
      if (!window.HeartPowerSystem) {
        const script = document.createElement('script');
        script.src = '/shared/heart-power-system.js';
        script.onload = () => {
          if (window.HeartPowerSystem) window.HeartPowerSystem.attachLiveOverlay();
        };
        document.head.appendChild(script);
      } else {
        setTimeout(() => {
          window.HeartPowerSystem.attachLiveOverlay();
        }, 10);
      }
    }

    render() {
      const p = this.state.prompt || {};
      const categoryEl = document.getElementById('live-category');
      const contentEl = document.getElementById('live-content');
      const timerEl = document.getElementById('live-timer');
      const messageEl = document.getElementById('live-message');

      const isWaiting = Boolean(this.state.showWaitingScreen);

      if (categoryEl) {
        categoryEl.textContent = isWaiting ? 'STANDBY • WAITING FOR HOST' : (p.category || this.state.category || this.gameMeta.badge || 'STREAM GAME');
      }

      if (timerEl) {
        timerEl.textContent = isWaiting ? '—' : (typeof this.state.remainingSeconds === 'number' ? this.state.remainingSeconds : '—');
        if (!isWaiting && this.state.remainingSeconds <= 5 && this.state.remainingSeconds > 0) {
          timerEl.style.color = '#ef4444';
          timerEl.style.textShadow = '0 0 25px rgba(239, 68, 68, 0.7)';
        } else {
          timerEl.style.color = '#d4af37';
          timerEl.style.textShadow = '0 0 25px rgba(212, 175, 55, 0.4)';
        }
      }

      if (messageEl) {
        if (isWaiting) {
          messageEl.textContent = 'HOST IS CHOOSING NEXT QUESTION';
        } else if (this.state.isRunning) {
          messageEl.textContent = 'GUESS OR VOTE IN CHAT NOW!';
        } else if (this.state.remainingSeconds === 0) {
          messageEl.textContent = 'TIME IS UP!';
        } else {
          messageEl.textContent = 'HOST CONTROLS IN PROGRESS';
        }
      }

      if (!contentEl) return;

      if (isWaiting) {
        contentEl.innerHTML = `
          <div class="live-waiting-stage">
            <img src="/dionlyonee-pon-di-app.png" alt="Dionlyonee Pon Di App" class="live-waiting-hero-img" referrerPolicy="no-referrer" />
            <div class="live-waiting-badge">🇯🇲 DIONLYONEE PON DI APP • STANDBY LOBBY</div>
            <h2 class="live-waiting-title">GET READY!</h2>
            <p class="live-waiting-sub">Host is picking the category and next question. Stay locked in!</p>
          </div>
        `;
        return;
      }

      if (this.gameId === 'finish-the-sentence') {
        contentEl.innerHTML = `
          <div style="font-size: 38px; font-weight: 900; line-height: 1.35; color: #ffffff; max-width: 900px; margin: 0 auto; text-shadow: 0 4px 20px rgba(0,0,0,0.8);">
            "${p.setup || 'Waiting for host...'}"
          </div>
          ${this.state.chatWinner ? `
            <div style="margin-top: 30px; animation: fadeIn 0.4s ease-out; background: linear-gradient(135deg, rgba(212,175,55,0.25), rgba(16,185,129,0.2)); border: 2.5px solid #d4af37; border-radius: 18px; padding: 20px 28px; max-width: 780px; margin-left: auto; margin-right: auto; box-shadow: 0 0 35px rgba(212,175,55,0.6);">
              <div style="font-size: 13px; font-weight: 900; letter-spacing: 3px; color: #f7e07d; text-transform: uppercase;">
                👑 CHAT WINNER SPOTLIGHT
              </div>
              <div style="font-size: 28px; font-weight: 900; color: #ffffff; margin-top: 8px;">
                "${this.state.chatWinner}"
              </div>
            </div>
          ` : `
            <div style="margin-top: 30px; font-size: 17px; font-weight: 800; letter-spacing: 3px; color: #d4af37;">
              COMPLETE THE PUNCHLINE IN CHAT 💬
            </div>
          `}
        `;
      } else if (this.gameId === 'what-would-you-do') {
        const votes = this.state.scenarioVotes || { A: 0, B: 0, C: 0, D: 0 };
        const total = (votes.A + votes.B + votes.C + votes.D) || 1;
        const opts = (p.options || []).map((opt, i) => {
          const key = String.fromCharCode(65 + i);
          const count = votes[key] || 0;
          const pct = Math.round((count / total) * 100);
          return `
            <div style="position: relative; overflow: hidden; background: rgba(14, 28, 30, 0.85); border: 1.5px solid rgba(212, 175, 55, 0.35); padding: 18px 24px; border-radius: 14px; text-align: left; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
              <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${pct}%; background: rgba(56,189,248,0.12); z-index: 0; transition: width 0.3s ease;"></div>
              <div style="position: relative; z-index: 1; display: flex; align-items: center; gap: 16px;">
                <div style="width: 42px; height: 42px; border-radius: 10px; background: #d4af37; color: #000; font-size: 20px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${key}
                </div>
                <div style="font-size: 22px; font-weight: 800; color: #fff;">${opt}</div>
              </div>
              <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: flex-end;">
                <span style="font-size: 22px; font-weight: 900; color: #38bdf8;">${pct}%</span>
                <span style="font-size: 11px; font-weight: 800; color: #94a3b8;">${count} votes</span>
              </div>
            </div>
          `;
        }).join('');

        contentEl.innerHTML = `
          <div style="font-size: 30px; font-weight: 900; line-height: 1.35; color: #f7e07d; max-width: 920px; margin: 0 auto 35px; text-shadow: 0 4px 20px rgba(0,0,0,0.8);">
            "${p.scenario || ''}"
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px; max-width: 850px; width: 100%; margin: 0 auto;">
            ${opts}
          </div>
        `;
      } else if (this.gameId === 'who-would-you-pick') {
        const choices = (p.choices || []).map((c) => {
          const isSelected = this.state.selectedPick === c;
          return `
            <div style="background: ${isSelected ? 'linear-gradient(135deg, rgba(212,175,55,0.35), rgba(14,28,30,0.95))' : 'rgba(14, 28, 30, 0.9)'}; border: 2.5px solid ${isSelected ? '#d4af37' : 'rgba(212,175,55,0.4)'}; padding: 24px 28px; border-radius: 18px; font-size: 24px; font-weight: 900; color: #ffffff; box-shadow: ${isSelected ? '0 0 35px rgba(212,175,55,0.7)' : '0 8px 25px rgba(0,0,0,0.3)'}; text-align: center; transform: ${isSelected ? 'scale(1.04)' : 'scale(1)'}; transition: all 0.3s ease;">
              ${isSelected ? '<div style="font-size: 11px; font-weight: 900; letter-spacing: 2px; color: #f7e07d; margin-bottom: 6px;">👑 WINNING DRAFT PICK</div>' : ''}
              ${c}
            </div>
          `;
        }).join('');

        contentEl.innerHTML = `
          <div style="font-size: 34px; font-weight: 900; line-height: 1.35; color: #ffffff; max-width: 900px; margin: 0 auto 35px;">
            ${p.question || ''}
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; max-width: 950px; width: 100%; margin: 0 auto;">
            ${choices}
          </div>
        `;
      } else if (this.gameId === 'emoji-guess') {
        const rawAns = (p.answer || '').toUpperCase();
        const hintCount = this.state.emojiLetterHintCount || 0;
        const letterBoxes = rawAns.split('').map((ch, idx) => {
          if (ch === ' ') return '<span style="display:inline-block; width:14px;"></span>';
          const isFirstLetterOfWord = idx === 0 || rawAns[idx - 1] === ' ';
          const showThisLetter = this.state.revealedAnswer || (hintCount >= 1 && isFirstLetterOfWord) || (hintCount >= 2 && (idx % 2 === 0));
          return `
            <div style="width: 48px; height: 58px; background: rgba(14,28,30,0.85); border-bottom: 4px solid ${showThisLetter ? '#10b981' : '#d4af37'}; border-radius: 8px 8px 0 0; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 900; color: ${showThisLetter ? '#ffffff' : 'rgba(255,255,255,0.1)'}; margin: 0 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
              ${showThisLetter ? ch : ''}
            </div>
          `;
        }).join('');

        contentEl.innerHTML = `
          <div style="font-size: 84px; letter-spacing: 12px; margin: 15px 0; filter: drop-shadow(0 8px 25px rgba(0,0,0,0.6));">
            ${p.emojis || ''}
          </div>
          <div style="display: flex; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
            ${letterBoxes}
          </div>
          <div style="font-size: 20px; font-weight: 800; letter-spacing: 3px; color: #38bdf8; margin-top: 10px;">
            HINT: ${p.hint || ''}
          </div>
          ${this.state.revealedAnswer ? `
            <div style="margin-top: 25px; padding: 16px 36px; background: linear-gradient(135deg, #d4af37, #f7e07d); color: #020303; font-size: 30px; font-weight: 900; letter-spacing: 4px; border-radius: 14px; display: inline-block; box-shadow: 0 0 35px rgba(212,175,55,0.7);">
              ANSWER: ${p.answer} 🎉
            </div>
          ` : ''}
        `;
      } else if (this.gameId === 'unscramble-it') {
        const letters = (p.scrambled || '').split(' ').map((l) => `
          <div style="width: 58px; height: 70px; background: rgba(14,28,30,0.9); border: 2.5px solid #38bdf8; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 34px; font-weight: 900; color: #38bdf8; box-shadow: 0 0 20px rgba(56,189,248,0.4);">
            ${l}
          </div>
        `).join('');

        contentEl.innerHTML = `
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 25px;">
            ${letters}
          </div>
          <div style="font-size: 20px; font-weight: 800; letter-spacing: 3px; color: #d4af37;">
            HINT: ${p.hint || ''}
          </div>
          ${this.state.revealedAnswer ? `
            <div style="margin-top: 25px; padding: 16px 36px; background: #10b981; color: #ffffff; font-size: 30px; font-weight: 900; letter-spacing: 4px; border-radius: 14px; display: inline-block; box-shadow: 0 0 35px rgba(16,185,129,0.7);">
              UNSCRAMBLED: ${p.answer} 🎉
            </div>
          ` : ''}
        `;
      } else if (this.gameId === 'who-dis') {
        contentEl.innerHTML = `
          <div style="width: 100px; height: 100px; border-radius: 50%; background: radial-gradient(circle, #38bdf8, #0b1d1e); margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; font-size: 50px; border: 3px solid #d4af37; box-shadow: 0 0 30px rgba(212,175,55,0.4);">
            🕵🏾
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px; max-width: 800px; width: 100%; margin: 0 auto;">
            <div style="padding: 18px 24px; background: rgba(14,28,30,0.9); border: 1px solid ${this.state.revealedClues >= 1 ? '#d4af37' : 'rgba(255,255,255,0.1)'}; border-radius: 12px; font-size: 20px; font-weight: 800; color: ${this.state.revealedClues >= 1 ? '#fff' : '#667879'}; text-align: left;">
              <b>CLUE 1:</b> ${this.state.revealedClues >= 1 ? p.clue1 : '🔒 Locked'}
            </div>
            <div style="padding: 18px 24px; background: rgba(14,28,30,0.9); border: 1px solid ${this.state.revealedClues >= 2 ? '#d4af37' : 'rgba(255,255,255,0.1)'}; border-radius: 12px; font-size: 20px; font-weight: 800; color: ${this.state.revealedClues >= 2 ? '#fff' : '#667879'}; text-align: left;">
              <b>CLUE 2:</b> ${this.state.revealedClues >= 2 ? p.clue2 : '🔒 Locked'}
            </div>
            <div style="padding: 18px 24px; background: rgba(14,28,30,0.9); border: 1px solid ${this.state.revealedClues >= 3 ? '#d4af37' : 'rgba(255,255,255,0.1)'}; border-radius: 12px; font-size: 20px; font-weight: 800; color: ${this.state.revealedClues >= 3 ? '#fff' : '#667879'}; text-align: left;">
              <b>CLUE 3:</b> ${this.state.revealedClues >= 3 ? p.clue3 : '🔒 Locked'}
            </div>
          </div>
          ${this.state.revealedAnswer ? `
            <div style="margin-top: 25px; padding: 16px 36px; background: linear-gradient(135deg, #d4af37, #f7e07d); color: #020303; font-size: 32px; font-weight: 900; letter-spacing: 4px; border-radius: 14px; display: inline-block; box-shadow: 0 0 35px rgba(212,175,55,0.8);">
              IT'S ${p.name}! 🎉
            </div>
          ` : ''}
        `;
      } else if (this.gameId === 'charades') {
        if (this.state.revealedAnswer) {
          contentEl.innerHTML = `
            <div style="animation: fadeIn 0.4s ease-out; max-width: 860px; margin: 0 auto;">
              <div style="font-size: 20px; font-weight: 900; letter-spacing: 4px; color: #10b981; margin-bottom: 15px;">
                🎉 CHARADE SOLVED! WINNER IN CHAT!
              </div>
              <div style="font-size: 38px; font-weight: 900; line-height: 1.3; color: #ffffff; padding: 36px 28px; background: linear-gradient(135deg, rgba(212,175,55,0.25), rgba(14,28,30,0.95)); border: 3px solid #d4af37; border-radius: 20px; box-shadow: 0 0 50px rgba(212,175,55,0.5), 0 10px 40px rgba(0,0,0,0.8);">
                "${p.prompt}"
              </div>
              <div style="margin-top: 24px; display: inline-flex; gap: 12px; align-items: center; background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; border-radius: 30px; padding: 8px 24px; color: #6ee7b7; font-size: 16px; font-weight: 800; letter-spacing: 2px;">
                🏆 ROUND COMPLETE • HOST PICKING NEXT PROMPT
              </div>
            </div>
          `;
        } else {
          contentEl.innerHTML = `
            <div style="animation: fadeIn 0.3s ease-out; max-width: 860px; margin: 0 auto;">
              <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 900; letter-spacing: 3px; color: #ef4444; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 30px; padding: 8px 20px; margin-bottom: 20px;">
                🤫 SILENT CHARADES • NO TALKING!
              </div>

              <!-- Center Stage Instruction Card -->
              <div style="font-size: 36px; font-weight: 900; line-height: 1.35; color: #ffffff; padding: 34px 28px; background: rgba(14,28,30,0.85); border: 2px solid rgba(212,175,55,0.35); border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                👀 WATCH THE HOST ON CAM!
              </div>

              <!-- Live Clues Sent by Host -->
              ${(this.state.showWordCount || this.state.showChatClue) ? `
                <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 20px;">
                  ${this.state.showWordCount ? `
                    <div style="background: rgba(56, 189, 248, 0.2); border: 1px solid #38bdf8; color: #7dd3fc; padding: 10px 22px; border-radius: 24px; font-size: 18px; font-weight: 900; letter-spacing: 2px; box-shadow: 0 0 20px rgba(56,189,248,0.3);">
                      📝 ${p.words || (p.prompt ? p.prompt.split(' ').length : 3)} WORDS
                    </div>
                  ` : ''}
                  ${this.state.showChatClue ? `
                    <div style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #fde68a; padding: 10px 22px; border-radius: 24px; font-size: 18px; font-weight: 900; letter-spacing: 2px; box-shadow: 0 0 20px rgba(245,158,11,0.3);">
                      💡 TOPIC: ${p.chatClue || p.category}
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <!-- Live Reaction Banner from Host -->
              ${this.state.charadesReaction ? `
                <div style="margin-top: 24px; padding: 14px 28px; background: linear-gradient(135deg, #d4af37, #f7e07d); color: #020303; font-size: 24px; font-weight: 900; letter-spacing: 3px; border-radius: 16px; display: inline-block; box-shadow: 0 0 35px rgba(212,175,55,0.8);">
                  ${this.state.charadesReaction}
                </div>
              ` : ''}

              <div style="margin-top: 24px; font-size: 17px; font-weight: 800; letter-spacing: 3px; color: #d4af37;">
                💬 TYPE YOUR GUESS IN CHAT NOW!
              </div>
            </div>
          `;
        }
      } else if (this.gameId === 'hangman') {
        const hState = this.state.hangmanState || { guessedLetters: [], strikes: 0, maxStrikes: 6, status: 'PLAYING', showHint: false };
        const rawWord = (p.word || 'HANGMAN').toUpperCase();
        const strikes = Math.max(0, Math.min(6, hState.strikes || 0));
        const maxStrikes = 6;
        const status = hState.status || (this.state.revealedAnswer ? 'WON' : 'PLAYING');
        const guessedLetters = hState.guessedLetters || [];
        const isRevealed = this.state.revealedAnswer || status === 'WON' || status === 'LOST';

        // Filter correct (in word) vs wrong (miss/strike) letters
        const correctLetters = guessedLetters.filter(ch => rawWord.includes(ch));
        const wrongLetters = guessedLetters.filter(ch => !rawWord.includes(ch));

        // Word Blanks Display
        // Guessed letters glow in vivid Emerald Green (#10b981)
        // Letters missed on round loss appear in vivid Crimson Red (#ef4444)
        const words = rawWord.split(' ');
        const wordGroupsHtml = words.map(w => {
          const charBoxes = w.split('').map(ch => {
            if (/[A-Z]/.test(ch)) {
              const wasGuessed = guessedLetters.includes(ch);
              const isShown = wasGuessed || isRevealed;
              const isMissedAtLoss = !wasGuessed && status === 'LOST' && isRevealed;

              const letterColor = isMissedAtLoss ? '#ef4444' : (wasGuessed ? '#10b981' : (isRevealed ? '#10b981' : '#ffffff'));
              const letterBorder = isMissedAtLoss ? '#ef4444' : (wasGuessed ? '#10b981' : '#d4af37');
              const letterShadow = isMissedAtLoss ? '0 0 20px rgba(239,68,68,0.85)' : (wasGuessed ? '0 0 20px rgba(16,185,129,0.85)' : 'none');
              const bgBox = isMissedAtLoss ? 'rgba(239,68,68,0.14)' : (wasGuessed ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.5)');

              return `
                <div style="width: 54px; height: 68px; background: ${bgBox}; border-bottom: 5px solid ${letterBorder}; border-radius: 8px 8px 0 0; display: inline-flex; align-items: center; justify-content: center; font-size: 38px; font-weight: 900; color: ${letterColor}; text-shadow: ${letterShadow}; box-shadow: 0 6px 20px rgba(0,0,0,0.5); margin: 0 4px; transition: all 0.25s;">
                  ${isShown ? ch : ''}
                </div>
              `;
            } else {
              return `
                <div style="display: inline-flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 900; color: #d4af37; margin: 0 4px;">
                  ${ch}
                </div>
              `;
            }
          }).join('');
          return `<div style="display: inline-flex; margin: 8px 14px; flex-wrap: nowrap;">${charBoxes}</div>`;
        }).join('');

        // Classic Hangman Gallows & Stick Figure Visual
        const visualSvg = window.renderHangmanStageSvg ? window.renderHangmanStageSvg(strikes, status, 340, 270) : '';

        // Strike Dots with 6 body parts labeled
        const strikeParts = ['Head', 'Body', 'L-Arm', 'R-Arm', 'L-Leg', 'R-Leg'];
        const strikeDotsHtml = [];
        for (let i = 1; i <= maxStrikes; i++) {
          const struck = i <= strikes;
          strikeDotsHtml.push(`
            <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: ${struck ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255,255,255,0.06)'}; border: 2px solid ${struck ? '#f87171' : 'rgba(255,255,255,0.2)'}; color: ${struck ? '#ffffff' : '#64748b'}; font-size: 15px; font-weight: 900; box-shadow: ${struck ? '0 0 15px rgba(239,68,68,0.8)' : 'none'}; transition: all 0.25s;">
                ${struck ? '✕' : i}
              </span>
              <span style="font-size: 10px; font-weight: 800; color: ${struck ? '#f87171' : '#64748b'}; letter-spacing: 0.5px;">
                ${strikeParts[i - 1]}
              </span>
            </div>
          `);
        }

        // Audience Letter Board (A-Z) with vivid RED (wrong) and GREEN (correct)
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const alphabetHtml = alphabet.map(letter => {
          const isGuessed = guessedLetters.includes(letter);
          const inWord = rawWord.includes(letter);
          if (isGuessed) {
            if (inWord) {
              // CORRECT GUESS: EMERALD GREEN
              return `
                <div title="${letter} (Correct)" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 48px; border-radius: 8px; background: linear-gradient(135deg, #10b981, #047857); border: 2.5px solid #34d399; color: #ffffff; font-weight: 900; font-size: 20px; box-shadow: 0 0 16px rgba(16,185,129,0.7); transform: scale(1.03);">
                  ${letter}
                  <span style="position: absolute; bottom: 1px; right: 3px; font-size: 9px; font-weight: 900; color: #d1fae5;">✓</span>
                </div>
              `;
            } else {
              // WRONG GUESS / STRIKE: CRIMSON RED WITH STRIKE-THROUGH
              return `
                <div title="${letter} (Wrong / Strike)" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 48px; border-radius: 8px; background: linear-gradient(135deg, #ef4444, #b91c1c); border: 2.5px solid #f87171; color: #ffffff; font-weight: 900; font-size: 20px; box-shadow: 0 0 16px rgba(239,68,68,0.7); text-decoration: line-through;">
                  ${letter}
                  <span style="position: absolute; bottom: 1px; right: 3px; font-size: 9px; font-weight: 900; color: #fee2e2;">✕</span>
                </div>
              `;
            }
          } else {
            // UNGUESSED: AVAILABLE NEUTRAL WHITE/GOLD
            return `
              <div title="${letter} (Available)" style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 48px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(212,175,55,0.35); color: #f8fafc; font-weight: 800; font-size: 19px;">
                ${letter}
              </div>
            `;
          }
        }).join('');

        // Summary Badges
        const correctChipsHtml = correctLetters.length > 0 
          ? correctLetters.map(l => `<span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: #10b981; color: #ffffff; font-weight: 900; font-size: 16px; box-shadow: 0 0 10px rgba(16,185,129,0.5);">${l}</span>`).join('')
          : `<span style="font-size: 12px; color: #6ee7b7; font-style: italic;">None yet</span>`;

        const wrongChipsHtml = wrongLetters.length > 0
          ? wrongLetters.map(l => `<span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: #ef4444; color: #ffffff; font-weight: 900; font-size: 16px; text-decoration: line-through; box-shadow: 0 0 10px rgba(239,68,68,0.5);">${l}</span>`).join('')
          : `<span style="font-size: 12px; color: #fca5a5; font-style: italic;">0 strikes</span>`;

        contentEl.innerHTML = `
          <div style="animation: fadeIn 0.3s ease-out; max-width: 1040px; margin: 0 auto; width: 100%;">
            
            <!-- Visual Gallows Stage & Strike Meter Grid -->
            <div style="display: grid; grid-template-columns: 340px 1fr; gap: 24px; align-items: center; background: rgba(14,28,30,0.85); border: 2px solid rgba(212,175,55,0.35); border-radius: 20px; padding: 20px 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.7);">
              
              <!-- Hangman Gallows & Stick Figure Graphic -->
              <div style="display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.35); border: 1.5px solid rgba(212,175,55,0.25); border-radius: 16px; padding: 10px;">
                ${visualSvg}
              </div>

              <!-- Right Column: Strikes Counter, Legend & Summary -->
              <div style="display: flex; flex-direction: column; gap: 14px;">
                
                <!-- Strike Meter Bar with Body Parts -->
                <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 12px 18px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="font-size: 13px; font-weight: 900; letter-spacing: 2px; color: ${strikes >= 5 ? '#ef4444' : (strikes >= 3 ? '#f59e0b' : '#d4af37')};">
                      ⚠️ HANGMAN STRIKES: ${strikes} / ${maxStrikes}
                    </div>
                    <div style="font-size: 12px; font-weight: 800; color: ${strikes >= 5 ? '#f87171' : '#94a3b8'};">
                      ${6 - strikes} ${6 - strikes === 1 ? 'GUESS' : 'GUESSES'} REMAINING
                    </div>
                  </div>
                  <div style="display: flex; gap: 10px; justify-content: space-between;">
                    ${strikeDotsHtml.join('')}
                  </div>
                </div>

                <!-- Letter Color Legend (Green = In Word, Red = Strike) -->
                <div style="display: flex; gap: 12px; justify-content: space-between; flex-wrap: wrap;">
                  <!-- Green Correct Box -->
                  <div style="flex: 1; min-width: 170px; background: rgba(16,185,129,0.12); border: 1.5px solid #10b981; border-radius: 12px; padding: 8px 12px;">
                    <div style="font-size: 11px; font-weight: 900; color: #34d399; letter-spacing: 1.5px; margin-bottom: 6px;">
                      🟢 CORRECT (${correctLetters.length})
                    </div>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap; min-height: 32px; align-items: center;">
                      ${correctChipsHtml}
                    </div>
                  </div>

                  <!-- Red Wrong Box -->
                  <div style="flex: 1; min-width: 170px; background: rgba(239,68,68,0.12); border: 1.5px solid #ef4444; border-radius: 12px; padding: 8px 12px;">
                    <div style="font-size: 11px; font-weight: 900; color: #f87171; letter-spacing: 1.5px; margin-bottom: 6px;">
                      🔴 WRONG / STRIKES (${wrongLetters.length}/6)
                    </div>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap; min-height: 32px; align-items: center;">
                      ${wrongChipsHtml}
                    </div>
                  </div>
                </div>

                <!-- Optional Clue from Host -->
                ${(hState.showHint && p.hint) ? `
                  <div style="background: rgba(245, 158, 11, 0.2); border: 1.5px solid #f59e0b; border-radius: 12px; padding: 10px 16px; color: #fde68a; font-size: 14px; font-weight: 800; letter-spacing: 1.5px; box-shadow: 0 0 20px rgba(245,158,11,0.3); text-align: center;">
                    💡 HOST CLUE: ${p.hint}
                  </div>
                ` : ''}

              </div>
            </div>

            <!-- Big Word Puzzle Blanks Section -->
            <div style="margin-top: 22px; padding: 24px 20px; background: rgba(0,0,0,0.45); border: 2px solid ${status === 'WON' ? '#10b981' : (status === 'LOST' ? '#ef4444' : 'rgba(212,175,55,0.4)')}; border-radius: 20px; box-shadow: 0 10px 35px rgba(0,0,0,0.6);">
              
              <!-- Word Blanks (Letters in Green or Red) -->
              <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center;">
                ${wordGroupsHtml}
              </div>

              <!-- Round Status Banner -->
              ${status === 'WON' ? `
                <div style="margin-top: 20px; padding: 12px 28px; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: 3px; border-radius: 14px; display: inline-block; box-shadow: 0 0 35px rgba(16,185,129,0.7);">
                  🎉 WORD SOLVED! CHAT SAVED THE HANGMAN! 🎉
                </div>
              ` : (status === 'LOST' ? `
                <div style="margin-top: 20px; padding: 12px 28px; background: linear-gradient(135deg, #ef4444, #b91c1c); color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: 3px; border-radius: 14px; display: inline-block; box-shadow: 0 0 35px rgba(239,68,68,0.7);">
                  💀 6 STRIKES REACHED! HANGMAN COMPLETED! 💀
                </div>
              ` : `
                <div style="margin-top: 16px; font-size: 16px; font-weight: 800; letter-spacing: 3px; color: #d4af37;">
                  💬 TYPE ANY LETTER IN STREAM CHAT!
                </div>
              `)}
            </div>

            <!-- Audience Live Keyboard Letter Board (A-Z in Red or Green) -->
            <div style="margin-top: 20px; background: rgba(14,28,30,0.85); border: 2px solid rgba(212,175,55,0.35); border-radius: 20px; padding: 18px 22px; box-shadow: 0 8px 30px rgba(0,0,0,0.6);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
                <div style="font-size: 13px; font-weight: 900; letter-spacing: 2px; color: #f7e07d;">
                  🔤 AUDIENCE LETTER BOARD
                </div>
                <div style="display: flex; gap: 14px; align-items: center; font-size: 12px; font-weight: 800;">
                  <span style="color: #34d399;">🟢 GREEN = IN WORD</span>
                  <span style="color: #f87171;">🔴 RED = STRIKE</span>
                  <span style="color: #94a3b8;">⚪ WHITE = UNGUESSED</span>
                </div>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 7px; justify-content: center;">
                ${alphabetHtml}
              </div>
            </div>

          </div>
        `;
      } else if (this.gameId === 'would-you-rather') {
        const totalVotes = (this.state.votes.optionA || 0) + (this.state.votes.optionB || 0);
        const pctA = totalVotes > 0 ? Math.round((this.state.votes.optionA / totalVotes) * 100) : 50;
        const pctB = totalVotes > 0 ? 100 - pctA : 50;

        contentEl.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 960px; width: 100%; margin: 0 auto;">
            <!-- OPTION A -->
            <div style="background: rgba(56,189,248,0.12); border: 2px solid #38bdf8; border-radius: 18px; padding: 30px 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 0 25px rgba(56,189,248,0.25);">
              <div>
                <div style="font-size: 13px; font-weight: 900; letter-spacing: 3px; color: #38bdf8;">OPTION A</div>
                <div style="font-size: 26px; font-weight: 900; line-height: 1.3; color: #ffffff; margin-top: 14px;">
                  ${p.optionA || ''}
                </div>
              </div>
              <div style="margin-top: 30px;">
                <div style="font-size: 48px; font-weight: 900; color: #38bdf8;">${pctA}%</div>
                <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #94a3b8;">${this.state.votes.optionA || 0} VOTES</div>
              </div>
            </div>

            <!-- OPTION B -->
            <div style="background: rgba(244,63,94,0.12); border: 2px solid #f43f5e; border-radius: 18px; padding: 30px 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 0 25px rgba(244,63,94,0.25);">
              <div>
                <div style="font-size: 13px; font-weight: 900; letter-spacing: 3px; color: #f43f5e;">OPTION B</div>
                <div style="font-size: 26px; font-weight: 900; line-height: 1.3; color: #ffffff; margin-top: 14px;">
                  ${p.optionB || ''}
                </div>
              </div>
              <div style="margin-top: 30px;">
                <div style="font-size: 48px; font-weight: 900; color: #f43f5e;">${pctB}%</div>
                <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #94a3b8;">${this.state.votes.optionB || 0} VOTES</div>
              </div>
            </div>
          </div>
        `;
      } else if (this.gameId === 'guess-the-lyrics') {
        const rawAns = (p.missingLyrics || '').toUpperCase();
        const isRevealed = this.state.revealedAnswer;
        const showMeta = this.state.showLyricsSongArtist || isRevealed;
        const showEra = this.state.showLyricsEra;
        const showFirstLetter = this.state.showLyricsFirstLetter;

        let blanksHtml = '';
        if (isRevealed) {
          blanksHtml = `
            <div style="margin-top: 30px; padding: 22px 36px; background: linear-gradient(135deg, rgba(16,185,129,0.3), rgba(212,175,55,0.35)); border: 3px solid #10b981; border-radius: 20px; color: #ffffff; font-size: 36px; font-weight: 900; letter-spacing: 3px; text-shadow: 0 0 30px rgba(16,185,129,0.9); display: inline-block; box-shadow: 0 0 50px rgba(16,185,129,0.6);">
              🎶 "${p.missingLyrics}" 🎶
            </div>
            <div style="margin-top: 14px; font-size: 22px; font-weight: 800; color: #f7e07d; letter-spacing: 2px;">
              From <span style="color:#fff;">"${p.song}"</span> by <span style="color:#38bdf8;">${p.artist}</span> ${p.year ? `(${p.year})` : ''}
            </div>
          `;
        } else if (showFirstLetter) {
          const letterHints = rawAns.split(' ').map(w => {
            if (!w) return '';
            const first = w[0];
            const rest = '_'.repeat(Math.max(1, w.length - 1));
            return `<span style="display:inline-block; margin:0 8px; font-family:monospace; letter-spacing:4px; font-size:32px; color:#38bdf8; font-weight:900; text-shadow:0 0 15px rgba(56,189,248,0.7);">${first}${rest}</span>`;
          }).join(' ');
          blanksHtml = `
            <div style="margin-top: 26px; padding: 18px 28px; background: rgba(0,0,0,0.55); border: 2.5px dashed #38bdf8; border-radius: 18px; display: inline-block; box-shadow: 0 0 30px rgba(56,189,248,0.3);">
              <div style="font-size: 13px; font-weight: 900; color: #38bdf8; letter-spacing: 3px; margin-bottom: 8px;">🔤 FIRST LETTER HINTS:</div>
              <div>${letterHints}</div>
            </div>
            <div style="margin-top: 16px; font-size: 16px; font-weight: 800; letter-spacing: 3px; color: #d4af37;">
              💬 GUESS THE MISSING LYRIC IN STREAM CHAT!
            </div>
          `;
        } else {
          blanksHtml = `
            <div style="margin-top: 28px; padding: 20px 36px; background: rgba(0,0,0,0.5); border: 2.5px dashed rgba(212,175,55,0.6); border-radius: 20px; color: #f7e07d; font-size: 28px; font-weight: 900; letter-spacing: 4px; display: inline-block; box-shadow: 0 0 35px rgba(212,175,55,0.25);">
              [ 🎵 ___________________________________ ? ]
            </div>
            <div style="margin-top: 18px; font-size: 18px; font-weight: 800; letter-spacing: 3px; color: #38bdf8; text-shadow: 0 0 15px rgba(56,189,248,0.5);">
              💬 FINISH THE LYRIC IN STREAM CHAT!
            </div>
          `;
        }

        contentEl.innerHTML = `
          <div style="max-width: 950px; width: 100%; margin: 0 auto; text-align: center;">
            <!-- Category & Genre Badges -->
            <div style="display: flex; justify-content: center; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
              <span style="background: linear-gradient(135deg, rgba(212,175,55,0.3), rgba(247,224,125,0.15)); border: 1.5px solid #d4af37; color: #f7e07d; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 900; letter-spacing: 2.5px;">
                🎵 ${p.category || 'R&B TO GOSPEL'}
              </span>
              <span style="background: rgba(56,189,248,0.18); border: 1.5px solid #38bdf8; color: #7dd3fc; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: 800; letter-spacing: 2px;">
                ${p.genre || 'Soul'}
              </span>
              ${(showEra && !showMeta) ? `
                <span style="background: rgba(167,243,208,0.18); border: 1.5px solid #10b981; color: #a7f3d0; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: 800; letter-spacing: 2px;">
                  📅 ${p.year || 'Classic Era'}
                </span>
              ` : ''}
            </div>

            <!-- Song & Artist Revealed Header (if unlocked by host) -->
            ${showMeta ? `
              <div style="margin-bottom: 22px; padding: 14px 24px; background: rgba(14,28,30,0.9); border: 2px solid #d4af37; border-radius: 16px; display: inline-flex; align-items: center; gap: 14px; box-shadow: 0 0 30px rgba(212,175,55,0.35);">
                <span style="font-size: 28px;">🎤</span>
                <span style="font-size: 24px; font-weight: 900; color: #f7e07d; letter-spacing: 1px;">"${p.song}"</span>
                <span style="font-size: 20px; font-weight: 800; color: #ffffff;">by ${p.artist}</span>
                ${p.year ? `<span style="font-size: 14px; color: #94a3b8; background: rgba(0,0,0,0.4); padding: 4px 10px; border-radius: 8px;">${p.year}</span>` : ''}
              </div>
            ` : ''}

            <!-- Main Lyrics Snippet Box -->
            <div style="background: radial-gradient(circle at center, rgba(18,36,40,0.95), rgba(7,16,18,0.98)); border: 2.5px solid rgba(212,175,55,0.45); border-radius: 24px; padding: 40px 36px; box-shadow: 0 15px 50px rgba(0,0,0,0.7), inset 0 0 60px rgba(212,175,55,0.06);">
              <div style="font-size: 13px; font-weight: 900; letter-spacing: 4px; color: #d4af37; margin-bottom: 16px; text-transform: uppercase;">
                SING THE NEXT LINE:
              </div>
              <div style="font-size: 34px; font-weight: 900; line-height: 1.45; color: #ffffff; font-style: italic; text-shadow: 0 2px 10px rgba(0,0,0,0.8); max-width: 820px; margin: 0 auto;">
                "${p.lyricsSnippet}"
              </div>
              ${blanksHtml}
            </div>

            <!-- Hint if available -->
            ${(p.hint && this.state.showChatClue) ? `
              <div style="margin-top: 20px; font-size: 18px; font-weight: 800; color: #facc15; letter-spacing: 2px;">
                💡 CLUE: ${p.hint}
              </div>
            ` : ''}
          </div>
        `;
      }

      // Contestant Scoreboard Podium Dock (shown across all stream games when toggled by host)
      if (this.state.showScoreboard && this.state.contestants && this.state.contestants.length) {
        const sorted = [...this.state.contestants].sort((a, b) => b.score - a.score);
        const topScore = sorted[0]?.score || 0;
        const scorePodiumsHtml = this.state.contestants.map((c) => {
          const isLeader = topScore > 0 && c.score === topScore;
          return `
            <div style="background: rgba(14,28,30,0.92); border: 2px solid ${isLeader ? '#d4af37' : 'rgba(212,175,55,0.3)'}; border-radius: 14px; padding: 10px 20px; min-width: 150px; text-align: center; box-shadow: ${isLeader ? '0 0 25px rgba(212,175,55,0.45)' : '0 4px 15px rgba(0,0,0,0.5)'};">
              <div style="font-size: 11px; font-weight: 900; color: ${isLeader ? '#f7e07d' : '#94a3b8'}; letter-spacing: 1.5px;">
                ${isLeader ? '👑 ' : ''}${c.name.toUpperCase()}
              </div>
              <div style="font-size: 28px; font-weight: 900; color: #ffffff; line-height: 1.1; margin-top: 4px;">
                ${c.score} <span style="font-size: 11px; color: #d4af37; font-weight: 800;">PTS</span>
              </div>
            </div>
          `;
        }).join('');

        contentEl.innerHTML += `
          <div style="margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%;">
            <div style="font-size: 11px; font-weight: 900; letter-spacing: 3px; color: #d4af37; text-transform: uppercase;">
              🏆 AUDIENCE PODIUM SCOREBOARD
            </div>
            <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
              ${scorePodiumsHtml}
            </div>
          </div>
        `;
      }
    }
  }

  window.StreamGameLive = StreamGameLive;
})();
