# SolaBattle - 1v1 Solana Battle Arena

A 1v1 turn-based combat game with real Solana wallet integration. Connect your Phantom wallet, check your live devnet balance, and battle an AI opponent using a rock-paper-scissors-style Attack/Defend/Special combat system.

**Live demo:** https://solabattle.vercel.app

## Features
- Real Phantom wallet connection (Solana Devnet)
- Live on-chain SOL balance display
- Devnet SOL airdrop button (real devnet transaction)
- 1v1 turn-based combat vs an AI opponent, using a rock-paper-scissors move system (Attack beats Special, Defend beats Attack, Special beats Defend)
- Animated move reveal with damage pop-ups
- Dashboard with player stats and match history
- Leaderboard screen
- How to Play guide

## Tech Stack
- **Frontend:** Next.js + React + TypeScript
- **Wallet Integration:** @solana/wallet-adapter-react, @solana/web3.js
- **Blockchain:** Solana Devnet
- **Styling:** Inline styles + Material Symbols icons
- **UI Design Reference:** Google Stitch
## Project Structure

\`\`\`
battle-game/
├── app/
│   ├── page.tsx          # All screens: Home, Dashboard, Battle, Leaderboard, How to Play
│   ├── layout.tsx        # Wallet provider setup + font loading
│   ├── globals.css
│   └── solana-utils.ts
├── programs/battle-game/ # Anchor smart contract (source code, not yet deployed to devnet)
│   └── src/lib.rs
└── package.json
\`\`\`
## How to Run Locally
1. `npm install`
2. `npm run dev`
3. Open `localhost:3000`
4. Install the [Phantom wallet](https://phantom.app) browser extension, set it to Devnet in Settings → Developer Settings
5. Connect your wallet and play

## Game Rules
- Both fighters start at 100 HP, battle lasts up to 5 rounds
- Each round, pick Attack, Defend, or Special — the AI picks a move too
- Moves counter each other rock-paper-scissors style:
  - Attack beats Special
  - Defend beats Attack
  - Special beats Defend
  - Matching moves trade damage evenly
- Winner is whoever has more HP when the battle ends (or whoever reduces the opponent to 0 first)

## Solana Integration Notes
This project connects to Solana Devnet for wallet authentication and balance/airdrop functionality via `@solana/web3.js`. A custom Anchor smart contract is included in `/programs` as source code but is not yet deployed to devnet — game logic currently runs client-side.

## Built For
Superhack University of Benin (Faculty of Computing), Solana hackathon by Superteam Nigeria.
