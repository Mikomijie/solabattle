import type { AppProps } from 'next/app';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import HomeScreen from './home-screen';
import Dashboard from './dashboard-screen';
import BattleScreen from './battle-screen';
import LeaderboardScreen from './leaderboard-screen';

export default function App({ Component, pageProps }: AppProps) {
  const { connected, connect } = useWallet();
  const [page, setPage] = useState('home');

  if (!connected) {
    return <HomeScreen onConnect={connect} />;
  }

  if (page === 'home') return <Dashboard setPage={setPage} />;
  if (page === 'battle') return <BattleScreen setPage={setPage} />;
  if (page === 'leaderboard') return <LeaderboardScreen />;

  return <Component {...pageProps} />;
}