# SolaBattle - 1v1 Solana Battle Arena

A competitive 1v1 blockchain game built on Solana where players battle each other, earn tokens, and climb the leaderboard.

## Features
- 1v1 turn-based battles (Attack, Defend, Special)
- Solana blockchain integration
- Player leaderboard
- Token rewards for winners
- Real-time battle logging

## Tech Stack
- **Frontend:** React + Next.js + Tailwind CSS
- **Smart Contract:** Anchor (Rust)
- **Blockchain:** Solana (Devnet)
- **UI Design:** Google Stitch

## Project Structure
battle-game/

├── programs/battle-game/    # Smart contract

│   └── src/lib.rs

├── app/                     # Frontend React app

│   ├── game.tsx

│   ├── leaderboard.tsx

│   ├── home.tsx

│   └── solana-utils.ts

├── tests/                   # Smart contract tests

└── Cargo.toml
## How to Run
1. Install Rust
2. Install npm dependencies: `npm install`
3. Build smart contract: `cargo build`
4. Deploy to devnet
5. Run frontend: `npm run dev`

## Game Rules
- 2 players, 100 HP each
- Each turn: Attack (15 dmg), Defend (5 dmg), Special (25 dmg)
- First to 0 HP loses
- Winner gets +10 tokens

## Winning Entry for Super Hackathon @ University of Benin