'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export default function Pages() {
  const { connected, connect } = useWallet();
  const [currentPage, setCurrentPage] = useState('home');

  // Home Page (from Stitch)
  if (currentPage === 'home' && !connected) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-6xl font-bold text-primary">SolaBattle</h1>
        <p className="text-2xl text-secondary">1v1 Solana Battle Arena</p>
        <button
          onClick={connect}
          className="px-8 py-4 bg-primary-container text-on-primary-container text-xl rounded-xl shadow-lg hover:scale-105"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  // After Wallet Connected
  if (currentPage === 'home' && connected) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <div className="flex gap-8">
          <div className="bg-surface-container p-6 rounded-lg">
            <p className="text-secondary">Record</p>
            <p className="text-3xl font-bold text-tertiary">12W - 5L</p>
          </div>
          <div className="bg-surface-container p-6 rounded-lg">
            <p className="text-secondary">Rank</p>
            <p className="text-3xl font-bold text-primary">#8</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentPage('battle')}
          className="px-8 py-4 bg-primary-container text-white text-xl rounded-xl hover:scale-105"
        >
          Find Opponent
        </button>
      </div>
    );
  }

  // Battle Page
  if (currentPage === 'battle') {
    return (
      <div className="bg-background text-on-background min-h-screen p-8">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">Battle</h1>
        <div className="flex justify-between gap-16 max-w-4xl mx-auto">
          {/* Your HP */}
          <div className="text-center">
            <p className="text-xl font-bold text-primary mb-4">You</p>
            <div className="w-48 bg-surface-container p-4 rounded-lg">
              <div className="w-full bg-error/30 rounded h-8 mb-2">
                <div className="bg-tertiary h-8 rounded w-3/4"></div>
              </div>
              <p>75/100 HP</p>
            </div>
          </div>

          {/* Opponent HP */}
          <div className="text-center">
            <p className="text-xl font-bold text-secondary mb-4">Opponent</p>
            <div className="w-48 bg-surface-container p-4 rounded-lg">
              <div className="w-full bg-error/30 rounded h-8 mb-2">
                <div className="bg-tertiary h-8 rounded w-2/3"></div>
              </div>
              <p>60/100 HP</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <button className="px-6 py-3 bg-error text-white rounded-lg hover:scale-105">Attack</button>
          <button className="px-6 py-3 bg-secondary text-white rounded-lg hover:scale-105">Defend</button>
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:scale-105">Special</button>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}