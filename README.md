markdown
# ⚔️ BotBattle

A 1v1 turn-based battle game deployed on BOT Chain. Fight the Combat AI across 10 rounds, and have your victory recorded permanently on-chain.

## What It Does

BotBattle is a decentralized fighting game where players battle an AI opponent in 10-round combat. Every win is recorded on the BOT Chain blockchain as permanent proof of victory.

- Connect your MetaMask wallet
- Battle the Combat AI across 10 rounds with 200 HP each
- Choose Attack, Defend, or Special each round
- Win by reducing the bot to 0 HP or having more HP after 10 rounds
- Your victory is recorded on-chain automatically

## How to Play

**Desktop**
- Click Attack, Defend, or Special buttons
- Or use keyboard shortcuts: `A` = Attack · `D` = Defend · `S` = Special

**Mobile**
- Swipe right to Attack
- Swipe left to Defend
- Swipe up for Special
- Or tap the buttons at the bottom

## Combat System

| Move | Beats | Damage |
|------|-------|--------|
| Attack | Special | 24 HP |
| Defend | Attack | 15 HP |
| Special | Defend | 36 HP |
| Clash (same move) | — | 18–28 HP each |

The AI reads your last move and counters 45% of the time. Adapt your strategy every round.

## Tech Stack

- **Frontend:** Next.js + React + TypeScript
- **Blockchain:** BOT Chain (EVM compatible)
- **Wallet:** MetaMask
- **Smart Contract:** Solidity

## Deployment

**Testnet (BOT Chain Testnet — Chain ID 968)**

Contract Address: [TO BE ADDED AFTER TESTNET DEPLOY]
Explorer: https://scan.bohr.life


**Mainnet (BOT Chain Mainnet — Chain ID 677)**

Contract Address: [TO BE ADDED AFTER MAINNET DEPLOY]
Explorer: https://scan.botchain.ai


## Live App

[botbattle.xyz](https://botbattle.xyz) — replace with your actual domain

## Smart Contract

The contract is located at `/BotBattle.sol` in this repository.

It records:
- Win/loss result
- Number of rounds played
- Remaining HP at end of match
- Wallet address of the player
- Block timestamp

## Local Development

```bash
git clone https://github.com/Mikomijie/solabattle.git
cd solabattle
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Built For

Build Week Hackathon Vol.2 — Girl Meets Tech x BOT Chain