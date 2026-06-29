export default function HomeScreen({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-container-margin py-md sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-[0_0_15px_rgba(124,58,237,0.3)]">
        <div className="font-headline-xl text-primary font-bold tracking-tighter">
          SolaBattle
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-grow flex flex-col items-center justify-center px-container-margin py-xl relative">
        <div className="text-center z-10 mb-xl">
          <h1 className="text-6xl font-extrabold text-primary mb-4 uppercase tracking-tighter">
            SolaBattle
          </h1>
          <p className="text-2xl text-on-surface-variant opacity-80 tracking-widest">
            1v1 SOLANA BATTLE ARENA
          </p>
        </div>

        {/* Animated Hero Circle */}
        <div className="relative flex items-center justify-center mb-xl">
          <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(124,58,237,0.5)]">
            <span className="text-8xl">⚔️</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-md w-full max-w-[280px] z-10">
          <button
            onClick={onConnect}
            className="w-full h-14 bg-primary-container text-on-primary-container font-label-md rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Connect Wallet
          </button>
          <button className="w-full h-14 border border-secondary text-secondary font-label-md rounded-xl hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(76,215,246,0.3)] active:scale-95 transition-all">
            View Leaderboard
          </button>
          <button className="w-full h-14 border border-outline-variant text-on-surface-variant font-label-md rounded-xl hover:bg-surface-variant/20 active:scale-95 transition-all">
            How to Play
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex justify-center items-center px-container-margin py-md bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="flex items-center gap-sm text-tertiary animate-pulse">
          <div className="w-2 h-2 rounded-full bg-tertiary"></div>
          <span className="text-label-sm">Loading network: Solana Devnet</span>
        </div>
      </footer>
    </div>
  );
}