/**
 * Dionlyonee Hangman Show - Visual Stage Engine
 * Generates dynamic, responsive SVG graphics for:
 * 1. PG-13 Slime Dunk Tank (Dionlyonee signature)
 * 2. Classic Gold-Timber Gallows
 * 3. Pirate Plank & Shark Lagoon
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HangmanVisual = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const HangmanVisual = {
    render: function (theme = 'slime', strikes = 0, status = 'PLAYING', width = 360, height = 300) {
      if (theme === 'classic') {
        return this.renderClassicGallows(strikes, status, width, height);
      } else if (theme === 'pirate') {
        return this.renderPiratePlank(strikes, status, width, height);
      } else {
        return this.renderSlimeDunk(strikes, status, width, height);
      }
    },

    // ========================================================
    // 1. DIONLYONEE SLIME DUNK TANK (Crowd Favorite PG-13)
    // ========================================================
    renderSlimeDunk: function (strikes = 0, status = 'PLAYING', width = 360, height = 300) {
      const s = Math.max(0, Math.min(6, strikes));
      const isWon = status === 'WON';
      const isLost = status === 'LOST' || s >= 6;

      // Platform tilt angle increases with strikes
      const tiltAngles = [0, 3, -4, 8, -10, 16, 65];
      const currentTilt = isLost ? 70 : (isWon ? 0 : tiltAngles[s]);

      // Face expressions based on strikes
      let faceEyes = `<circle cx="173" cy="85" r="3" fill="#ffffff"/><circle cx="187" cy="85" r="3" fill="#ffffff"/>`;
      let faceMouth = `<path d="M 174 95 Q 180 100 186 95" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
      let sweatDrops = '';

      if (s === 1) {
        faceMouth = `<line x1="174" y1="96" x2="186" y2="96" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>`;
      } else if (s === 2) {
        sweatDrops = `<path d="M 194 82 Q 197 78 195 75 Q 192 78 194 82" fill="#38bdf8"/>`;
        faceMouth = `<path d="M 174 96 Q 180 94 186 96" stroke="#ffffff" stroke-width="2.5" fill="none"/>`;
      } else if (s === 3) {
        sweatDrops = `<path d="M 194 82 Q 197 78 195 75 Q 192 78 194 82" fill="#38bdf8"/><path d="M 166 84 Q 163 80 165 77 Q 168 80 166 84" fill="#38bdf8"/>`;
        faceEyes = `<circle cx="173" cy="85" r="4.5" fill="#f87171"/><circle cx="187" cy="85" r="4.5" fill="#f87171"/>`;
        faceMouth = `<path d="M 173 98 Q 180 92 187 98" stroke="#f87171" stroke-width="2.5" fill="none"/>`;
      } else if (s === 4) {
        faceEyes = `<line x1="170" y1="83" x2="176" y2="87" stroke="#ffffff" stroke-width="2.5"/><line x1="170" y1="87" x2="176" y2="83" stroke="#ffffff" stroke-width="2.5"/><line x1="184" y1="83" x2="190" y2="87" stroke="#ffffff" stroke-width="2.5"/><line x1="184" y1="87" x2="190" y2="83" stroke="#ffffff" stroke-width="2.5"/>`;
        faceMouth = `<ellipse cx="180" cy="98" rx="5" ry="6" fill="#ef4444"/>`;
      } else if (s === 5) {
        faceEyes = `<ellipse cx="173" cy="85" rx="5" ry="6" fill="#ef4444"/><ellipse cx="187" cy="85" rx="5" ry="6" fill="#ef4444"/>`;
        faceMouth = `<ellipse cx="180" cy="100" rx="8" ry="7" fill="#dc2626"/>`;
        sweatDrops = `<g transform="translate(0,2)"><path d="M 195 82 Q 199 76 195 72 Q 191 76 195 82" fill="#38bdf8"/><path d="M 165 84 Q 161 78 165 74 Q 169 78 165 84" fill="#38bdf8"/></g>`;
      }

      // Character body pose
      let charGroup = `
        <g id="dunk-character" transform="translate(0, 0)">
          <!-- Head -->
          <circle cx="180" cy="90" r="18" fill="#1e293b" stroke="#d4af37" stroke-width="3" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.6))"/>
          <!-- Mascot Cap/Bandana -->
          <path d="M 162 82 Q 180 72 198 82 Q 180 76 162 82" fill="#ef4444"/>
          ${faceEyes}
          ${faceMouth}
          ${sweatDrops}
          <!-- Torso -->
          <line x1="180" y1="108" x2="180" y2="150" stroke="#d4af37" stroke-width="4.5" stroke-linecap="round"/>
          <!-- Arms holding chair rails -->
          <path d="M 180 118 L 160 135 L 152 152" stroke="#d4af37" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M 180 118 L 200 135 L 208 152" stroke="#d4af37" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- Legs dangling toward slime -->
          <path d="M 180 150 L 170 185 L 164 210" stroke="#d4af37" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M 180 150 L 190 185 L 196 210" stroke="#d4af37" stroke-width="4" stroke-linecap="round" fill="none"/>
        </g>
      `;

      if (isWon) {
        // Victory Pose!
        charGroup = `
          <g id="victory-character" transform="translate(0, -20)">
            <!-- Golden Victory Crown -->
            <path d="M 166 65 L 172 75 L 180 63 L 188 75 L 194 65 L 194 77 L 166 77 Z" fill="#fbbf24" stroke="#d4af37" stroke-width="1.5"/>
            <!-- Head with big happy smile -->
            <circle cx="180" cy="90" r="18" fill="#10b981" stroke="#fbbf24" stroke-width="3.5"/>
            <circle cx="174" cy="86" r="3.5" fill="#ffffff"/>
            <circle cx="186" cy="86" r="3.5" fill="#ffffff"/>
            <path d="M 172 95 Q 180 106 188 95" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
            <!-- Torso -->
            <line x1="180" y1="108" x2="180" y2="148" stroke="#10b981" stroke-width="5" stroke-linecap="round"/>
            <!-- Raised triumphant arms -->
            <path d="M 180 118 L 155 95 L 140 75" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <path d="M 180 118 L 205 95 L 220 75" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <!-- Confetti / Sparkles -->
            <circle cx="135" cy="70" r="4" fill="#fbbf24"/>
            <circle cx="225" cy="70" r="4" fill="#fbbf24"/>
            <circle cx="140" cy="110" r="3" fill="#ec4899"/>
            <circle cx="220" cy="110" r="3" fill="#38bdf8"/>
            <!-- Legs jumping -->
            <path d="M 180 148 L 162 178 L 152 172" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <path d="M 180 148 L 198 178 L 208 172" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          </g>
        `;
      } else if (isLost) {
        // DUNKED! Character plunged into green slime!
        charGroup = `
          <g id="dunked-character" transform="translate(0, 60)">
            <!-- Eyes sticking out of slime with spirals / shock -->
            <circle cx="180" cy="185" r="16" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>
            <!-- Swirly spiral eyes -->
            <circle cx="174" cy="183" r="3.5" fill="#ef4444"/>
            <circle cx="186" cy="183" r="3.5" fill="#ef4444"/>
            <ellipse cx="180" cy="193" rx="5" ry="4" fill="#000000"/>
            <!-- Hands flailing up out of slime -->
            <path d="M 152 185 L 145 160 L 140 152" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path d="M 208 185 L 215 160 L 220 152" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <!-- Big Splashing Slime droplets -->
            <path d="M 140 180 Q 120 145 130 130 Q 142 150 148 175" fill="#22c55e"/>
            <path d="M 220 180 Q 240 145 230 130 Q 218 150 212 175" fill="#22c55e"/>
            <circle cx="120" cy="140" r="6" fill="#4ade80"/>
            <circle cx="240" cy="140" r="7" fill="#4ade80"/>
            <circle cx="180" cy="130" r="8" fill="#86efac"/>
          </g>
        `;
      }

      // Chains status (break as strikes increase)
      const leftChainBroken = s >= 2;
      const rightChainBroken = s >= 4;
      const pinPulled = s >= 6;

      return `
        <svg viewBox="0 0 360 300" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.8));">
          <defs>
            <linearGradient id="slimeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#4ade80" stop-opacity="0.95"/>
              <stop offset="50%" stop-color="#22c55e" stop-opacity="0.98"/>
              <stop offset="100%" stop-color="#15803d" stop-opacity="1"/>
            </linearGradient>
            <linearGradient id="tankGlass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(34,197,94,0.3)"/>
              <stop offset="50%" stop-color="rgba(255,255,255,0.15)"/>
              <stop offset="100%" stop-color="rgba(34,197,94,0.3)"/>
            </linearGradient>
            <linearGradient id="gallowsWood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#78350f"/>
              <stop offset="50%" stop-color="#b45309"/>
              <stop offset="100%" stop-color="#451a03"/>
            </linearGradient>
          </defs>

          <!-- Background Scaffold Truss & Industrial Frame -->
          <rect x="20" y="20" width="14" height="260" rx="3" fill="url(#gallowsWood)" stroke="#d4af37" stroke-width="1"/>
          <rect x="326" y="20" width="14" height="260" rx="3" fill="url(#gallowsWood)" stroke="#d4af37" stroke-width="1"/>
          <rect x="14" y="16" width="332" height="18" rx="4" fill="url(#gallowsWood)" stroke="#d4af37" stroke-width="1.5"/>
          
          <!-- Warning Danger Banner on Top Beam -->
          <rect x="70" y="20" width="220" height="10" fill="#f59e0b"/>
          <text x="180" y="28" font-size="8" font-weight="900" fill="#000000" text-anchor="middle" letter-spacing="2">DIONLYONEE SLIME DUNK</text>

          <!-- Suspension Cables -->
          <!-- Left Cable -->
          ${leftChainBroken ? `
            <line x1="80" y1="34" x2="100" y2="75" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3"/>
            <text x="105" y="75" font-size="9" font-weight="900" fill="#ef4444">SNAPPED!</text>
          ` : `
            <line x1="80" y1="34" x2="120" y2="155" stroke="#94a3b8" stroke-width="2.5"/>
            <circle cx="80" cy="34" r="3.5" fill="#f59e0b"/>
          `}

          <!-- Right Cable -->
          ${rightChainBroken ? `
            <line x1="280" y1="34" x2="260" y2="80" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3"/>
            <text x="220" y="80" font-size="9" font-weight="900" fill="#ef4444">SNAPPED!</text>
          ` : `
            <line x1="280" y1="34" x2="240" y2="155" stroke="#94a3b8" stroke-width="2.5"/>
            <circle cx="280" cy="34" r="3.5" fill="#f59e0b"/>
          `}

          <!-- The Dunk Platform Seat (Tilts as strikes accumulate) -->
          <g transform="rotate(${currentTilt}, 180, 160)">
            <!-- Platform Base -->
            <rect x="135" y="152" width="90" height="10" rx="3" fill="#334155" stroke="#d4af37" stroke-width="1.5"/>
            <!-- Seat Backrest -->
            <rect x="140" y="125" width="8" height="30" rx="2" fill="#475569"/>
            <!-- Target Bullseye Sensor Button on Left -->
            <circle cx="100" cy="157" r="16" fill="#ef4444" stroke="#ffffff" stroke-width="3"/>
            <circle cx="100" cy="157" r="9" fill="#ffffff"/>
            <circle cx="100" cy="157" r="4" fill="#ef4444"/>
            <line x1="116" y1="157" x2="135" y2="157" stroke="#64748b" stroke-width="4"/>
          </g>

          <!-- Character -->
          ${charGroup}

          <!-- Giant Glass Tank Container for Neon Slime -->
          <rect x="45" y="195" width="270" height="85" rx="8" fill="url(#tankGlass)" stroke="rgba(34,197,94,0.6)" stroke-width="2.5"/>
          <line x1="45" y1="210" x2="315" y2="210" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

          <!-- Bubbling Glowing Neon Slime Pool -->
          <path d="M 46 220 Q 80 215 120 220 Q 160 225 200 218 Q 240 214 280 220 Q 300 222 314 220 L 314 278 A 6 6 0 0 1 308 284 L 52 284 A 6 6 0 0 1 46 278 Z" fill="url(#slimeGrad)"/>

          <!-- Boiling Slime Bubbles -->
          <circle cx="85" cy="235" r="5" fill="#86efac" opacity="0.8"/>
          <circle cx="140" cy="242" r="7" fill="#bbf7d0" opacity="0.9"/>
          <circle cx="210" cy="230" r="4" fill="#86efac" opacity="0.75"/>
          <circle cx="265" cy="238" r="6" fill="#86efac" opacity="0.85"/>
          <circle cx="175" cy="225" r="5.5" fill="#4ade80" opacity="0.9"/>

          <!-- Slime Tank Warning Meter Label -->
          <text x="180" y="265" font-size="11" font-weight="900" fill="#052e16" text-anchor="middle" letter-spacing="1">
            ${isWon ? 'SAFE! CHAT SAVED THE CONTESTANT!' : (isLost ? 'DUNKED! MAXIMUM 6 STRIKES!' : `SLIME LEVEL CRITICAL: ${s}/6 STRIKES`)}
          </text>
        </svg>
      `;
    },

    // ========================================================
    // 2. CLASSIC GOLD-TIMBER GALLOWS
    // ========================================================
    renderClassicGallows: function (strikes = 0, status = 'PLAYING', width = 360, height = 300) {
      const s = Math.max(0, Math.min(6, strikes));
      const isWon = status === 'WON';
      const isLost = status === 'LOST' || s >= 6;

      // Stick figure parts revealed per strike
      const showHead = s >= 1;
      const showBody = s >= 2;
      const showLeftArm = s >= 3;
      const showRightArm = s >= 4;
      const showLeftLeg = s >= 5;
      const showRightLeg = s >= 6;

      return `
        <svg viewBox="0 0 360 300" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.8));">
          <defs>
            <linearGradient id="goldBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#b45309"/>
              <stop offset="50%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#78350f"/>
            </linearGradient>
          </defs>

          <!-- Gallows Base Platform -->
          <rect x="30" y="260" width="180" height="16" rx="3" fill="url(#goldBeam)" stroke="#d4af37" stroke-width="1.5"/>
          <line x1="20" y1="276" x2="340" y2="276" stroke="#475569" stroke-width="2"/>

          <!-- Vertical Timber Pole -->
          <rect x="75" y="35" width="16" height="225" rx="2" fill="url(#goldBeam)" stroke="#d4af37" stroke-width="1.5"/>

          <!-- Top Crossbeam -->
          <rect x="65" y="28" width="185" height="16" rx="2" fill="url(#goldBeam)" stroke="#d4af37" stroke-width="1.5"/>

          <!-- Diagonal Support Brace -->
          <line x1="91" y1="75" x2="135" y2="44" stroke="#d4af37" stroke-width="8" stroke-linecap="round"/>

          <!-- Hanging Lantern -->
          <line x1="95" y1="44" x2="95" y2="65" stroke="#94a3b8" stroke-width="2"/>
          <polygon points="90,65 100,65 103,80 87,80" fill="#f59e0b" stroke="#d4af37" stroke-width="1.5"/>
          <circle cx="95" cy="72" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #fbbf24)"/>

          <!-- Hanging Rope Noose -->
          <line x1="210" y1="44" x2="210" y2="85" stroke="#e2e8f0" stroke-width="3.5" stroke-dasharray="3,1.5"/>
          <ellipse cx="210" cy="94" rx="8" ry="10" fill="none" stroke="#e2e8f0" stroke-width="3"/>

          ${isWon ? `
            <!-- Stick Figure Jumps Off Scaffolding Rejoicing -->
            <g transform="translate(45, 30)">
              <circle cx="210" cy="115" r="16" fill="#10b981" stroke="#fbbf24" stroke-width="3"/>
              <circle cx="205" cy="112" r="3" fill="#ffffff"/>
              <circle cx="215" cy="112" r="3" fill="#ffffff"/>
              <path d="M 205 120 Q 210 128 215 120" stroke="#ffffff" stroke-width="2.5" fill="none"/>
              <line x1="210" y1="131" x2="210" y2="175" stroke="#10b981" stroke-width="4.5" stroke-linecap="round"/>
              <line x1="210" y1="140" x2="185" y2="115" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
              <line x1="210" y1="140" x2="235" y2="115" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
              <line x1="210" y1="175" x2="190" y2="210" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
              <line x1="210" y1="175" x2="230" y2="210" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
              <text x="210" y="90" font-size="16" font-weight="900" fill="#fbbf24" text-anchor="middle">SAVED! 🎉</text>
            </g>
          ` : `
            <!-- Classic Stickman Drawing -->
            <!-- 1. Head -->
            ${showHead ? `
              <circle cx="210" cy="112" r="16" fill="${isLost ? '#ef4444' : '#1e293b'}" stroke="${isLost ? '#f87171' : '#d4af37'}" stroke-width="3"/>
              ${isLost ? `
                <text x="205" y="112" font-size="10" fill="#ffffff" font-weight="900">✕</text>
                <text x="215" y="112" font-size="10" fill="#ffffff" font-weight="900">✕</text>
                <line x1="205" y1="120" x2="215" y2="120" stroke="#ffffff" stroke-width="2"/>
              ` : `
                <circle cx="205" cy="109" r="2.5" fill="#ffffff"/>
                <circle cx="215" cy="109" r="2.5" fill="#ffffff"/>
                <path d="M 206 118 Q 210 ${s >= 4 ? '114' : '122'} 214 118" stroke="#ffffff" stroke-width="2" fill="none"/>
              `}
            ` : ''}

            <!-- 2. Torso -->
            ${showBody ? `
              <line x1="210" y1="128" x2="210" y2="185" stroke="${isLost ? '#ef4444' : '#d4af37'}" stroke-width="4.5" stroke-linecap="round"/>
            ` : ''}

            <!-- 3. Left Arm -->
            ${showLeftArm ? `
              <line x1="210" y1="145" x2="182" y2="170" stroke="${isLost ? '#ef4444' : '#d4af37'}" stroke-width="4" stroke-linecap="round"/>
            ` : ''}

            <!-- 4. Right Arm -->
            ${showRightArm ? `
              <line x1="210" y1="145" x2="238" y2="170" stroke="${isLost ? '#ef4444' : '#d4af37'}" stroke-width="4" stroke-linecap="round"/>
            ` : ''}

            <!-- 5. Left Leg -->
            ${showLeftLeg ? `
              <line x1="210" y1="185" x2="185" y2="230" stroke="${isLost ? '#ef4444' : '#d4af37'}" stroke-width="4" stroke-linecap="round"/>
            ` : ''}

            <!-- 6. Right Leg -->
            ${showRightLeg ? `
              <line x1="210" y1="185" x2="235" y2="230" stroke="${isLost ? '#ef4444' : '#d4af37'}" stroke-width="4" stroke-linecap="round"/>
            ` : ''}
          `}
        </svg>
      `;
    },

    // ========================================================
    // 3. PIRATE PLANK & SHARK LAGOON
    // ========================================================
    renderPiratePlank: function (strikes = 0, status = 'PLAYING', width = 360, height = 300) {
      const s = Math.max(0, Math.min(6, strikes));
      const charX = 100 + (s * 22); // walks further out along plank
      const isLost = status === 'LOST' || s >= 6;

      return `
        <svg viewBox="0 0 360 300" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.8));">
          <!-- Sky & Palm Island -->
          <path d="M 0 200 Q 50 180 90 240 L 0 260 Z" fill="#065f46"/>
          
          <!-- Turquoise Ocean Water -->
          <rect x="0" y="215" width="360" height="85" fill="#0284c7" opacity="0.9"/>
          <path d="M 0 220 Q 45 210 90 220 Q 135 230 180 220 Q 225 210 270 220 Q 315 230 360 220 L 360 300 L 0 300 Z" fill="#0369a1"/>

          <!-- Friendly Shark Fin Circling Below -->
          <polygon points="260,215 285,190 280,218" fill="#475569" stroke="#334155" stroke-width="1.5"/>
          <circle cx="270" cy="205" r="2" fill="#ffffff"/>

          <!-- Pirate Ship Deck Hull on Left -->
          <rect x="0" y="60" width="90" height="180" fill="#78350f" stroke="#d4af37" stroke-width="2"/>
          <line x1="0" y1="100" x2="90" y2="100" stroke="#451a03" stroke-width="2"/>
          <line x1="0" y1="140" x2="90" y2="140" stroke="#451a03" stroke-width="2"/>
          <line x1="0" y1="180" x2="90" y2="180" stroke="#451a03" stroke-width="2"/>

          <!-- Wooden Plank Extending into Sea -->
          <rect x="70" y="145" width="180" height="12" rx="2" fill="#b45309" stroke="#d4af37" stroke-width="1.5"/>

          <!-- Pirate / Stick Character walking the plank -->
          ${isLost ? `
            <!-- Splash into Ocean -->
            <g transform="translate(250, 190)">
              <circle cx="0" cy="10" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>
              <path d="M -15 0 Q 0 -25 15 0" stroke="#ffffff" stroke-width="3" fill="none"/>
              <text x="0" y="-15" font-size="12" font-weight="900" fill="#f87171" text-anchor="middle">SPLASH!</text>
            </g>
          ` : `
            <g transform="translate(${charX}, 80)">
              <!-- Pirate Hat -->
              <path d="M -16 -10 L 0 -22 L 16 -10 Z" fill="#0f172a" stroke="#d4af37" stroke-width="1.5"/>
              <circle cx="0" cy="-14" r="2" fill="#ffffff"/>
              <!-- Head -->
              <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#d4af37" stroke-width="2.5"/>
              <circle cx="-4" cy="-2" r="2" fill="#ffffff"/>
              <circle cx="4" cy="-2" r="2" fill="#ffffff"/>
              <!-- Eyepatch on right eye -->
              <line x1="1" y1="-5" x2="7" y2="1" stroke="#000000" stroke-width="2"/>
              <!-- Body -->
              <line x1="0" y1="14" x2="0" y2="45" stroke="#d4af37" stroke-width="4" stroke-linecap="round"/>
              <line x1="0" y1="24" x2="-14" y2="40" stroke="#d4af37" stroke-width="3.5" stroke-linecap="round"/>
              <line x1="0" y1="24" x2="14" y2="40" stroke="#d4af37" stroke-width="3.5" stroke-linecap="round"/>
              <!-- Legs on plank -->
              <line x1="0" y1="45" x2="-8" y2="65" stroke="#d4af37" stroke-width="3.5" stroke-linecap="round"/>
              <line x1="0" y1="45" x2="8" y2="65" stroke="#d4af37" stroke-width="3.5" stroke-linecap="round"/>
            </g>
          `}
        </svg>
      `;
    }
  };

  // Attach backward compatibility for existing renderHangmanStageSvg callers
  window.renderHangmanStageSvg = function (strikes = 0, status = 'PLAYING', width = 340, height = 280) {
    return HangmanVisual.render('slime', strikes, status, width, height);
  };

  return HangmanVisual;
});
