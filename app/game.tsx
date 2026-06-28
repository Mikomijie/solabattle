import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function GameScreen() {
  const { publicKey } = useWallet();
  const [gameState, setGameState] = useState('searching'); // searching, battle, result
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [battleLog, setBattleLog] = useState<string[]>(['Battle started!']);
  const [winner, setWinner] = useState<string | null>(null);

  const handleAttack = () => {
    const damage = Math.floor(Math.random() * 10) + 10;
    setOpponentHP(Math.max(0, opponentHP - damage));
    setBattleLog([...battleLog, `You attacked! ${damage} damage!`]);

    if (opponentHP - damage <= 0) {
      setGameState('result');
      setWinner('You Won!');
    }
  };

  const handleDefend = () => {
    setBattleLog([...battleLog, 'You defended!']);
  };

  const handleSpecial = () => {
    const damage = 25;
    setOpponentHP(Math.max(0, opponentHP - damage));
    setBattleLog([...battleLog, `Special attack! ${damage} damage!`]);

    if (opponentHP - damage <= 0) {
      setGameState('result');
      setWinner('You Won!');
    }
  };

  if (gameState === 'searching') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-primary mb-8">Finding Opponent...</h1>
        <div className="animate-spin text-primary text-6xl">⚔️</div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-secondary mb-8">{winner}</h1>
        <p className="text-xl mb-8">+10 Tokens Earned!</p>
        <button
          onClick={() => {
            setPlayerHP(100);
            setOpponentHP(100);
            setBattleLog(['Battle started!']);
            setWinner(null);
            setGameState('searching');
          }}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-3xl font-bold text-primary">SolaBattle</h1>
      
      <div className="flex gap-16">
        {/* Player 1 */}
        <div className="text-center">
          <p className="text-xl font-bold text-primary mb-4">You</p>
          <div className="w-48 bg-gray-700 rounded-lg p-4">
            <div className="w-full bg-red-900 rounded h-8 mb-2">
              <div
                className="bg-green-500 h-8 rounded transition-all"
                style={{ width: `${(playerHP / 100) * 100}%` }}
              ></div>
            </div>
            <p>{playerHP}/100 HP</p>
          </div>
        </div>

        {/* Player 2 */}
        <div className="text-center">
          <p className="text-xl font-bold text-secondary mb-4">Opponent</p>
          <div className="w-48 bg-gray-700 rounded-lg p-4">
            <div className="w-full bg-red-900 rounded h-8 mb-2">
              <div
                className="bg-green-500 h-8 rounded transition-all"
                style={{ width: `${(opponentHP / 100) * 100}%` }}
              ></div>
            </div>
            <p>{opponentHP}/100 HP</p>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg p-4 h-40 overflow-y-auto">
        {battleLog.map((log, i) => (
          <p key={i} className="text-sm text-gray-300">{log}</p>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAttack}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Attack
        </button>
        <button
          onClick={handleDefend}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Defend
        </button>
        <button
          onClick={handleSpecial}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Special
        </button>
      </div>
    </div>
  );
}