# BotBattle

A 1v1 turn-based combat game on BOT Chain where players battle an undefeated AI opponent. Every victory is recorded permanently on-chain.

**Play Now:** [botbattle.xyz](https://botbattle.xyz) (domain coming soon)

---

## Game Overview

**The Arena:** In 2031, all disputes on BOT Chain are settled in the arena.

Enter a 10-round battle against **CIPHER-X**, an adaptive AI guardian. 200 HP each. Rock-paper-scissors mechanics. Highest HP after Round 10 wins — or get knocked to 0 HP first.

**The Catch:** CIPHER-X reads your moves. It counters your last move 45% of the time. Strategy wins.

---

## Gameplay Mechanics

| Your Move | Beats | Damage |
|-----------|-------|--------|
| Attack ⚔️ | Special | 24 HP |
| Special ⚡ | Defend | 36 HP |
| Defend 🛡️ | Attack | 15 HP |
| Clash | Same move | 18–28 HP each |

**10 Rounds.** **200 HP each.** **Immutable on-chain results.**

---

## Features

- ✅ **Sound Effects** — Web Audio API, no external files
- ✅ **Animated Warriors** — SVG fighters with hit/attack/victory states
- ✅ **Floating Damage Numbers** — Real-time combat feedback
- ✅ **Round Intro Flash** — ROUND X / FIGHT overlay
- ✅ **Haptic Feedback** — Android vibration on hit
- ✅ **HP Bar Danger Pulse** — Below 25% HP pulse animation
- ✅ **Screen Shake** — Special move impact feedback
- ✅ **Arena Floor Grid** — Detailed battle environment
- ✅ **CIPHER-X Taunts** — 10 rotating AI personality lines
- ✅ **Win Streak Tracker** — localStorage persistence
- ✅ **Fighter Stats Display** — W/L record on home screen
- ✅ **World Lore** — "In 2031, all disputes on BOT Chain are settled in the arena"
- ✅ **Responsive Design** — Desktop, tablet, mobile portrait & landscape
- ✅ **Keyboard Controls** — A = Attack, D = Defend, S = Special
- ✅ **Swipe Controls** — Mobile: right = Attack, left = Defend, up = Special

---

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Inline CSS (no external libraries)
- **Audio:** Web Audio API
- **Blockchain:** ethers.js v6, MetaMask integration
- **Network:** BOT Chain (EVM-compatible)
- **Deployment:** Vercel

---

## How to Play

### Desktop
- Click **Attack**, **Defend**, or **Special** buttons
- OR press **A**, **D**, **S** keys

### Mobile Portrait
- Swipe **right** → Attack
- Swipe **left** → Defend
- Swipe **up** → Special
- OR tap buttons below

### Mobile Landscape
- Swipe arena left panel OR use compact buttons on right

---

## Combat Strategy

1. **CIPHER-X counters your last move 45% of the time** — never repeat the same move twice
2. **After landing Special** → switch to Attack next round
3. **If ahead on HP after Round 7** → play Defend more to protect your lead
4. **Win condition:** Either knock CIPHER-X to 0 HP OR have more HP after Round 10

---

## Installation & Development

```bash
# Clone repo
git clone https://github.com/Mikomijie/solabattle.git
cd solabattle

# Install dependencies
npm install

# Run dev server
npm run dev

# Open browser
# http://localhost:3000
```

---

## Deployment

### Testnet (BOT Chain Testnet - Chain ID 968)
- **Contract Address:** `0xf4cd5F16A2558b1C6E3EC3beBC17aA6D00561250`
- **Explorer:** https://scan.bohr.life
- **RPC:** https://rpc.bohr.life
- **Status:** ✅ Deployed & Tested

### Mainnet (BOT Chain Mainnet - Chain ID 677)
- **Contract Address:** (pending mainnet deployment)
- **Explorer:** https://scan.botchain.ai
- **RPC:** https://rpc.botchain.ai
- **Status:** Awaiting BOT token allocation

---

## Smart Contract

**BotBattle.sol** — Records match results on-chain

Functions:
- `recordMatch(bool won, uint8 rounds, uint8 finalHP)` — Save battle result
- `getStats(address player)` → returns (wins, losses, totalMatches)
- `getMatchCount(address player)` → total battles played
- `getMatch(address player, uint256 index)` → individual match details

---

## Project Info

**Developer:** Michael Omijie (@Mikomijie)  
**GitHub:** https://github.com/Mikomijie/solabattle  
**Built for:** Girl Meets Tech Build Week Hackathon Vol.2  
**Hackathon Dates:** Sept 18–25, 2026  
**Submission Deadline:** Sept 25, 2026 11:59 PM GMT+7

---

## License

MIT