export default function LeaderboardScreen() {
  const players = [
    { rank: 1, name: 'Player_Alpha', wins: 48, losses: 12, winRate: '80%', tokens: 5240 },
    { rank: 2, name: 'Player_Beta', wins: 42, losses: 18, winRate: '70%', tokens: 4890 },
    { rank: 3, name: 'Player_Gamma', wins: 35, losses: 25, winRate: '58%', tokens: 4120 },
    { rank: 4, name: 'CryptoKnight', wins: 28, losses: 22, winRate: '56%', tokens: 3540 },
    { rank: 5, name: 'ShadowRogue', wins: 25, losses: 20, winRate: '56%', tokens: 3200 },
    { rank: 6, name: 'IceWizard', wins: 22, losses: 18, winRate: '55%', tokens: 2890 },
    { rank: 7, name: 'ThunderStrike', wins: 18, losses: 15, winRate: '55%', tokens: 2450 },
    { rank: 8, name: 'You', wins: 12, losses: 5, winRate: '71%', tokens: 1850 },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-container-margin py-md bg-surface-container border-b border-outline">
        <h1 className="font-headline-xl text-primary font-bold">SolaBattle</h1>
        <h2 className="text-2xl font-bold text-on-surface">Leaderboard</h2>
        <div></div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center px-container-margin py-xl">
        <h1 className="text-4xl font-bold text-primary mb-4">Leaderboard</h1>
        <p className="text-label-md text-on-surface-variant mb-8">Top 50 Players</p>

        {/* Table */}
        <div className="w-full max-w-4xl bg-surface-container rounded-lg border border-outline overflow-hidden">
          {/* Header Row */}
          <div className="bg-surface-container-high border-b border-outline grid grid-cols-6 px-6 py-4 font-label-md font-bold text-on-surface-variant">
            <div>Rank</div>
            <div>Player</div>
            <div>Wins</div>
            <div>Losses</div>
            <div>Win%</div>
            <div>Tokens</div>
          </div>

          {/* Player Rows */}
          {players.map((player) => (
            <div
              key={player.rank}
              className={`grid grid-cols-6 px-6 py-4 border-b border-outline hover:bg-surface-container-high transition-all ${
                player.rank === 8 ? 'bg-primary/10 border-l-4 border-l-primary' : ''
              }`}
            >
              <div className={`font-bold ${player.rank === 8 ? 'text-primary' : 'text-primary'}`}>
                #{player.rank}
              </div>
              <div className="text-on-surface">{player.name}</div>
              <div className="text-on-surface">{player.wins}</div>
              <div className="text-on-surface">{player.losses}</div>
              <div className={`font-bold ${player.winRate > '65%' ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                {player.winRate}
              </div>
              <div className="font-bold text-tertiary">{player.tokens}</div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <button className="mt-8 px-8 py-3 border border-secondary text-secondary rounded-lg hover:bg-secondary/10 transition-all">
          Load More Players
        </button>
      </main>
    </div>
  );
}