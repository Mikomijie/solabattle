import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export default function Home() {
  const { connected, connect, disconnect } = useWallet();
  const [gameState, setGameState] = useState('home');

  return (
    <div className="bg-background text-on-background min-h-screen">
      {!connected ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <>
          <button onClick={() => setGameState('battle')}>Find Opponent</button>
          <button onClick={disconnect}>Disconnect</button>
        </>
      )}
    </div>
  );
}