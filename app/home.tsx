import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export default function Home() {
  const { connect, connected } = useWallet();
  const [page, setPage] = useState('home');

  if (page === 'battle') {
    return <div>Battle Game Here</div>;
  }

  if (page === 'leaderboard') {
    return <div>Leaderboard Here</div>;
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-6xl font-bold text-primary">SolaBattle</h1>
      <p className="text-2xl text-secondary">1v1 Solana Battle Arena</p>
      
      {!connected ? (
        <button
          onClick={connect}
          className="px-8 py-4 bg-primary text-white text-xl rounded-lg hover:bg-primary/80"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => setPage('battle')}
            className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            Find Opponent
          </button>
          <button
            onClick={() => setPage('leaderboard')}
            className="px-8 py-4 bg-secondary text-white rounded-lg hover:bg-secondary/80"
          >
            View Leaderboard
          </button>
        </div>
      )}
    </div>
  );
}