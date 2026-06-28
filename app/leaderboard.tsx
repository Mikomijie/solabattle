import { useState } from 'react';

export default function Leaderboard() {
  const [players] = useState([
    { rank: 1, name: 'Player_Alpha', wins: 48, losses: 12, winRate: '80%', tokens: 5240 },
    { rank: 2, name: 'Player_Beta', wins: 42, losses: 18, winRate: '70%', tokens: 4890 },
    { rank: 3, name: 'Player_Gamma', wins: 35, losses: 25, winRate: '58%', tokens: 4120 },
    { rank: 4, name: 'You', wins: 12, losses: 5, winRate: '71%', tokens: 1850 },
  ]);

  return (
    <div className="min-h-screen bg-background text-on-background p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Leaderboard</h1>
      
      <div className="bg-surface-container rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-container-high border-b border-outline">
            <tr>
              <th className="px-6 py-4 text-left">Rank</th>
              <th className="px-6 py-4 text-left">Player</th>
              <th className="px-6 py-4 text-left">Wins</th>
              <th className="px-6 py-4 text-left">Losses</th>
              <th className="px-6 py-4 text-left">Win%</th>
              <th className="px-6 py-4 text-left">Tokens</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.rank} className="border-b border-outline hover:bg-surface-container-high transition-colors">
                <td className="px-6 py-4 text-primary font-bold">#{player.rank}</td>
                <td className="px-6 py-4">{player.name}</td>
                <td className="px-6 py-4">{player.wins}</td>
                <td className="px-6 py-4">{player.losses}</td>
                <td className="px-6 py-4 text-secondary">{player.winRate}</td>
                <td className="px-6 py-4 text-tertiary font-bold">{player.tokens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}