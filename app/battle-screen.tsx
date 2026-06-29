import { useState } from 'react';

export default function BattleScreen({ setPage }: { setPage: (page: string) => void }) {
  const [playerHP, setPlayerHP] = useState(100);
  const [oppHP, setOppHP] = useState(100);
  const [battleLog, setBattleLog] = useState<string[]>(['Battle started!']);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const addLog = (msg: string) => {
    setBattleLog([...battleLog, msg]);
  };

  const handleAttack = () => {
    if (gameOver) return;
    const damage = Math.floor(Math.random() * 10) + 10;
    const newOppHP = Math.max(0, oppHP - damage);
    setOppHP(newOppHP);
    addLog(`You attacked! ${damage} damage dealt`);

    if (newOppHP === 0) {
      setGameOver(true);
      setWinner('You');
      return;
    }

    // Enemy turn
    setTimeout(() => {
      const enemyDamage = Math.floor(Math.random() * 10) + 8;
      const newPlayerHP = Math.max(0, playerHP - enemyDamage);
      setPlayerHP(newPlayerHP);
      addLog(`Enemy attacked! ${enemyDamage} damage taken`);

      if (newPlayerHP === 0) {
        setGameOver(true);
        setWinner('Opponent');
      } else {
        setRound(round + 1);
      }
    }, 800);
  };

  const handleDefend = () => {
    if (gameOver) return;
    addLog('You defended! Reduced incoming damage');
    setTimeout(() => {
      const enemyDamage = Math.floor(Math.random() * 5) + 2;
      const newPlayerHP = Math.max(0, playerHP - enemyDamage);
      setPlayerHP(newPlayerHP);
      addLog(`Enemy attacked! ${enemyDamage} damage taken`);

      if (newPlayerHP === 0) {
        setGameOver(true);
        setWinner('Opponent');
      } else {
        setRound(round + 1);
      }
    }, 800);
  };

  const handleSpecial = () => {
    if (gameOver) return;
    const damage = 25;
    const newOppHP = Math.max(0, oppHP - damage);
    setOppHP(newOppHP);
    addLog(`Special attack! ${damage} damage dealt`);

    if (newOppHP === 0) {
      setGameOver(true);
      setWinner('You');
      return;
    }

    setTimeout(() => {
      const enemyDamage = Math.floor(Math.random() * 10) + 8;
      const newPlayerHP = Math.max(0, playerHP - enemyDamage);
      setPlayerHP(newPlayerHP);
      addLog(`Enemy attacked! ${enemyDamage} damage taken`);

      if (newPlayerHP === 0) {
        setGameOver(true);
        setWinner('Opponent');
      } else {
        setRound(round + 1);
      }
    }, 800);
  };

  if (gameOver) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center gap-8">
        <div className={`text-6xl font-extrabold text-center ${winner === 'You' ? 'text-tertiary' : 'text-error'}`}>
          {winner === 'You' ? '🎉 YOU WON!' : '💀 YOU LOST'}
        </div>
        <div className="text-2xl text-on-surface-variant">
          {winner === 'You' ? '+10 Tokens Earned!' : '0 Tokens'}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setPlayerHP(100);
              setOppHP(100);
              setBattleLog(['Battle started!']);
              setRound(1);
              setGameOver(false);
              setWinner(null);
            }}
            className="px-8 py-4 bg-primary-container text-white rounded-xl hover:scale-105"
          >
            Play Again
          </button>
          <button
            onClick={() => setPage('home')}
            className="px-8 py-4 border border-secondary text-secondary rounded-xl hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-container-margin py-md bg-surface-container border-b border-outline">
        <span className="text-label-md text-on-surface">Round {round} of 5</span>
        <h1 className="font-headline-xl text-primary font-bold">SolaBattle</h1>
        <span className="text-label-md text-on-surface-variant">Battle ID: #A4F2</span>
      </header>

      {/* Battle Arena */}
      <main className="flex-grow flex flex-col items-center justify-center px-container-margin py-xl gap-8">
        {/* Player Stats */}
        <div className="flex gap-32 w-full max-w-4xl justify-center">
          {/* You */}
          <div className="text-center">
            <p className="text-xl font-bold text-primary mb-4">You</p>
            <div className="w-48 bg-surface-container border border-outline rounded-lg p-4">
              <div className="w-full bg-surface-container-high rounded h-8 mb-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-container to-secondary h-8 rounded transition-all"
                  style={{ width: `${(playerHP / 100) * 100}%` }}
                ></div>
              </div>
              <p className="font-bold text-on-surface">{playerHP}/100 HP</p>
              <div className="mt-4 space-y-1 text-label-sm text-on-surface-variant">
                <p>Attack: 20</p>
                <p>Defense: 10</p>
                <p>Speed: 18</p>
              </div>
            </div>
          </div>

          {/* Opponent */}
          <div className="text-center">
            <p className="text-xl font-bold text-secondary mb-4">Opponent</p>
            <div className="w-48 bg-surface-container border border-outline rounded-lg p-4">
              <div className="w-full bg-surface-container-high rounded h-8 mb-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-secondary to-tertiary h-8 rounded transition-all"
                  style={{ width: `${(oppHP / 100) * 100}%` }}
                ></div>
              </div>
              <p className="font-bold text-on-surface">{oppHP}/100 HP</p>
              <div className="mt-4 space-y-1 text-label-sm text-on-surface-variant">
                <p>Attack: 19</p>
                <p>Defense: 11</p>
                <p>Speed: 17</p>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Log */}
        <div className="w-full max-w-2xl bg-surface-container border border-outline rounded-lg p-4 h-48 overflow-y-auto">
          {battleLog.map((log, i) => (
            <p key={i} className="text-label-sm text-on-surface-variant mb-2">
              {log}
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleAttack}
            disabled={gameOver}
            className="px-6 py-3 bg-error text-white font-label-md rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            Attack
          </button>
          <button
            onClick={handleDefend}
            disabled={gameOver}
            className="px-6 py-3 bg-secondary text-white font-label-md rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            Defend
          </button>
          <button
            onClick={handleSpecial}
            disabled={gameOver}
            className="px-6 py-3 bg-primary-container text-white font-label-md rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            Special
          </button>
        </div>
      </main>
    </div>
  );
}