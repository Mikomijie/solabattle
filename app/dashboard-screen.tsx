export default function Dashboard({ setPage }: { setPage: (page: string) => void }) {
  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-container-margin py-md bg-surface-container border-b border-outline">
        <h1 className="font-headline-xl text-primary font-bold">SolaBattle</h1>
        <nav className="flex gap-lg">
          <button className="text-on-surface-variant hover:text-secondary transition">Leaderboard</button>
          <button className="text-on-surface-variant hover:text-secondary transition">Settings</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen gap-8 px-container-margin">
        <h2 className="text-4xl font-bold text-primary">Welcome back, Warrior</h2>

        {/* Stats Cards */}
        <div className="flex gap-8 flex-wrap justify-center">
          {/* Win/Loss Card */}
          <div className="bg-surface-container border border-outline rounded-lg p-lg shadow-[0_4px_20px_rgba(124,58,237,0.1)]">
            <p className="text-label-sm text-on-surface-variant mb-sm">Record</p>
            <p className="text-4xl font-bold text-tertiary">12W - 5L</p>
            <p className="text-label-sm text-on-surface-variant mt-sm">70.6% Win Rate</p>
          </div>

          {/* Rank Card */}
          <div className="bg-surface-container border-2 border-primary rounded-lg p-lg shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <p className="text-label-sm text-on-surface-variant mb-sm">Rank</p>
            <p className="text-4xl font-bold text-primary">#8</p>
            <p className="text-label-sm text-on-surface-variant mt-sm">2,450 XP</p>
          </div>

          {/* Tokens Card */}
          <div className="bg-surface-container border border-tertiary rounded-lg p-lg shadow-[0_4px_20px_rgba(78,222,163,0.1)]">
            <p className="text-label-sm text-on-surface-variant mb-sm">Tokens</p>
            <p className="text-4xl font-bold text-tertiary">485</p>
            <p className="text-label-sm text-on-surface-variant mt-sm">Lifetime earnings</p>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="w-full max-w-2xl mt-8">
          <h3 className="text-2xl font-bold text-on-surface mb-4">Recent Matches</h3>
          <div className="bg-surface-container rounded-lg overflow-hidden border border-outline">
            {[
              { opponent: 'Player_Alpha', result: 'Won', tokens: '+10' },
              { opponent: 'Shadow_0x', result: 'Lost', tokens: '0' },
              { opponent: 'CryptoKnight', result: 'Won', tokens: '+10' },
            ].map((match, i) => (
              <div key={i} className={`px-6 py-4 border-b border-outline last:border-b-0 flex justify-between items-center ${match.result === 'Won' ? 'border-l-2 border-l-tertiary' : 'border-l-2 border-l-error'}`}>
                <span className="text-on-surface">{match.opponent}</span>
                <span className={match.result === 'Won' ? 'text-tertiary font-bold' : 'text-error font-bold'}>{match.result}</span>
                <span className={match.result === 'Won' ? 'text-tertiary' : 'text-on-surface-variant'}>{match.tokens}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Action Button */}
        <button
          onClick={() => setPage('battle')}
          className="px-8 py-4 bg-primary-container text-on-primary-container text-xl font-label-md rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 mt-8"
        >
          Find Opponent
        </button>
      </main>
    </div>
  );
}