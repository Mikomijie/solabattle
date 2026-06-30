'use client';

import { useState } from 'react';

export default function Pages() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'home') {
    return (
      <div style={{
        background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0b1326 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        color: '#dae2fd',
        gap: '32px',
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#d2bbff', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>SolaBattle</h1>
        <p style={{ color: '#ccc3d8', letterSpacing: '0.2em', fontSize: '14px' }}>1v1 SOLANA BATTLE ARENA</p>
        <div style={{
          width: 200, height: 200, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #4cd7f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 80, boxShadow: '0 0 50px rgba(124,58,237,0.7)',
        }}>⚔️</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
          <button
            onClick={() => setCurrentPage('dashboard')}
            style={{
              height: 56, background: '#7c3aed', color: '#ede0ff',
              border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            }}>
            🔗 Connect Wallet
          </button>
          <button
            onClick={() => setCurrentPage('leaderboard')}
            style={{
              height: 56, background: 'transparent', color: '#4cd7f6',
              border: '1px solid #4cd7f6', borderRadius: 12, fontSize: 16,
              fontWeight: 600, cursor: 'pointer',
            }}>
            🏆 View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <div style={{ background: '#0b1326', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#dae2fd' }}>
        <header style={{ padding: '16px 24px', background: '#171f33', borderBottom: '1px solid #4a4455', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#d2bbff' }}>SolaBattle</span>
          <span style={{ color: '#4cd7f6', fontSize: 14 }}>● Connected</span>
        </header>
        <main style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#d2bbff' }}>Welcome back, Warrior</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Wins', value: '12', color: '#4edea3' },
              { label: 'Losses', value: '5', color: '#ffb4ab' },
              { label: 'Rank', value: '#8', color: '#d2bbff' },
              { label: 'Tokens', value: '1850', color: '#4cd7f6' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#171f33', border: '1px solid #4a4455', borderRadius: 12, padding: '20px 28px', textAlign: 'center', minWidth: 100 }}>
                <p style={{ color: '#ccc3d8', fontSize: 12, marginBottom: 8 }}>{stat.label}</p>
                <p style={{ color: stat.color, fontSize: 28, fontWeight: 700 }}>{stat.value}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage('battle')}
            style={{
              marginTop: 16, padding: '16px 48px', background: '#7c3aed',
              color: '#ede0ff', border: 'none', borderRadius: 12, fontSize: 18,
              fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            }}>
            ⚔️ Find Opponent
          </button>
        </main>
      </div>
    );
  }

  if (currentPage === 'battle') {
    return <BattleScreen setPage={setCurrentPage} />;
  }

  if (currentPage === 'leaderboard') {
    return <LeaderboardScreen setPage={setCurrentPage} />;
  }

  return null;
}

function BattleScreen({ setPage }: { setPage: (p: string) => void }) {
  const [playerHP, setPlayerHP] = useState(100);
  const [oppHP, setOppHP] = useState(100);
  const [log, setLog] = useState(['⚔️ Battle started!']);
  const [over, setOver] = useState(false);
  const [winner, setWinner] = useState('');

  const attack = (type: string) => {
    if (over) return;
    const dmg = type === 'special' ? 25 : type === 'attack' ? Math.floor(Math.random()*10)+10 : 0;
    const newOpp = Math.max(0, oppHP - dmg);
    setOppHP(newOpp);
    const newLog = [...log, `You used ${type}! ${dmg} damage dealt`];
    if (newOpp === 0) { setOver(true); setWinner('You'); setLog([...newLog, '🎉 You won!']); return; }
    setTimeout(() => {
      const eDmg = type === 'defend' ? Math.floor(Math.random()*5)+2 : Math.floor(Math.random()*10)+8;
      const newP = Math.max(0, playerHP - eDmg);
      setPlayerHP(newP);
      setLog([...newLog, `Enemy attacks! ${eDmg} damage taken`]);
      if (newP === 0) { setOver(true); setWinner('Enemy'); }
    }, 800);
  };

  return (
    <div style={{ background: '#0b1326', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#dae2fd', padding: 24 }}>
      <h1 style={{ textAlign: 'center', color: '#d2bbff', fontSize: 28, fontWeight: 800, marginBottom: 32 }}>⚔️ BATTLE</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 32, flexWrap: 'wrap' }}>
        {[
          { name: 'You', hp: playerHP, color: '#7c3aed' },
          { name: 'Opponent', hp: oppHP, color: '#4cd7f6' },
        ].map(p => (
          <div key={p.name} style={{ textAlign: 'center' }}>
            <p style={{ color: p.color, fontWeight: 700, marginBottom: 8 }}>{p.name}</p>
            <div style={{ width: 180, background: '#171f33', borderRadius: 8, height: 20, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ width: `${p.hp}%`, height: '100%', background: p.color, transition: 'width 0.3s' }} />
            </div>
            <p style={{ fontSize: 14 }}>{p.hp}/100 HP</p>
          </div>
        ))}
      </div>
      <div style={{ background: '#171f33', borderRadius: 12, padding: 16, maxWidth: 500, margin: '0 auto 24px', height: 150, overflowY: 'auto' }}>
        {log.map((l, i) => <p key={i} style={{ fontSize: 13, color: '#ccc3d8', marginBottom: 4 }}>{l}</p>)}
      </div>
      {!over ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          {[
            { label: '⚔️ Attack', type: 'attack', bg: '#93000a' },
            { label: '🛡️ Defend', type: 'defend', bg: '#003640' },
            { label: '✨ Special', type: 'special', bg: '#7c3aed' },
          ].map(btn => (
            <button key={btn.type} onClick={() => attack(btn.type)} style={{
              padding: '12px 24px', background: btn.bg, color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>{btn.label}</button>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 32, fontWeight: 800, color: winner === 'You' ? '#4edea3' : '#ffb4ab', marginBottom: 24 }}>
            {winner === 'You' ? '🎉 YOU WON!' : '💀 YOU LOST'}
          </p>
          <button onClick={() => setPage('dashboard')} style={{ padding: '14px 32px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

function LeaderboardScreen({ setPage }: { setPage: (p: string) => void }) {
  const players = [
    { rank: 1, name: 'Player_Alpha', wins: 48, tokens: 5240 },
    { rank: 2, name: 'Player_Beta', wins: 42, tokens: 4890 },
    { rank: 3, name: 'Player_Gamma', wins: 35, tokens: 4120 },
    { rank: 4, name: 'CryptoKnight', wins: 28, tokens: 3540 },
    { rank: 5, name: 'ShadowRogue', wins: 25, tokens: 3200 },
    { rank: 8, name: 'You', wins: 12, tokens: 1850 },
  ];
  return (
    <div style={{ background: '#0b1326', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#dae2fd', padding: 24 }}>
      <button onClick={() => setPage('home')} style={{ background: 'transparent', color: '#4cd7f6', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 14 }}>← Back</button>
      <h1 style={{ textAlign: 'center', color: '#d2bbff', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>🏆 Leaderboard</h1>
      <p style={{ textAlign: 'center', color: '#ccc3d8', fontSize: 14, marginBottom: 24 }}>Top Players</p>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#171f33', borderRadius: 12, overflow: 'hidden', border: '1px solid #4a4455' }}>
        {players.map(p => (
          <div key={p.rank} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #4a4455', background: p.name === 'You' ? '#7c3aed22' : 'transparent' }}>
            <span style={{ color: '#d2bbff', fontWeight: 700 }}>#{p.rank}</span>
            <span style={{ color: p.name === 'You' ? '#d2bbff' : '#dae2fd' }}>{p.name}</span>
            <span style={{ color: '#4edea3', fontWeight: 600 }}>{p.wins}W</span>
            <span style={{ color: '#4cd7f6', fontWeight: 600 }}>{p.tokens} tokens</span>
          </div>
        ))}
      </div>
    </div>
  );
}