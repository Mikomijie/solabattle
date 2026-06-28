import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export const DEVNET = clusterApiUrl('devnet');
export const connection = new Connection(DEVNET, 'processed');

export async function getPlayerStats(walletPublicKey: PublicKey) {
  // This will call your smart contract later
  return {
    wins: 0,
    losses: 0,
    rank: 0
  };
}

export async function startBattle(walletPublicKey: PublicKey) {
  // This will call your smart contract to start a battle
  console.log('Starting battle for:', walletPublicKey.toString());
}