'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// ============ DESIGN TOKENS ============
const colors = {
  primary: '#3525cd',
  primaryContainer: '#4f46e5',
  onPrimary: '#ffffff',
  secondary: '#006c49',
  secondaryFixedDim: '#4edea3',
  tertiary: '#97000c',
  tertiaryContainer: '#c20b17',
  background: '#f9f9ff',
  surfaceContainerLow: '#f1f3ff',
  surfaceContainer: '#e9edff',
  surfaceContainerHigh: '#e1e8fd',
  onSurface: '#141b2b',
  onSurfaceVariant: '#464555',
  outlineVariant: '#c7c4d8',
  outline: '#777587',
  error: '#ba1a1a',
};

type Page = 'home' | 'dashboard' | 'battle' | 'leaderboard' | 'howtoplay';

const Icon = ({ name, size = 20, style = {} }: { name: string; size?: number; style?: React.CSSProperties }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>
);

const truncateAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

type WalletProps = {
  setPage: (p: Page) => void;
  connected: boolean;
  address: string | null;
  balance: number | null;
  onConnectClick: () => void;
  onDisconnect: () => void;
  onAirdrop: () => void;
  airdropping: boolean;
};

// ============ HOME SCREEN ============
function HomeScreen({ setPage, connected, address, balance, onConnectClick }: WalletProps) {
  return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.onSurface }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px', borderBottom: `1px solid ${colors.outlineVariant}`,
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: colors.primary }}>SolaBattle</span>
        <nav style={{ display: 'flex', gap: 32 }}>
          <span style={{ color: colors.onSurface, fontWeight: 500, cursor: 'pointer' }}>Arena</span>
          <span onClick={() => setPage('leaderboard')} style={{ color: colors.onSurfaceVariant, cursor: 'pointer' }}>Leaderboard</span>
          <span onClick={() => setPage('howtoplay')} style={{ color: colors.onSurfaceVariant, cursor: 'pointer' }}>How to Play</span>
        </nav>
        {connected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: colors.surfaceContainerLow, borderRadius: 20, padding: '8px 14px', fontWeight: 700, fontSize: 13 }}>
              {balance !== null ? `${balance.toFixed(2)} SOL` : '...'} · {truncateAddress(address!)}
            </span>
            <button onClick={() => setPage('dashboard')} style={{
              background: colors.primaryContainer, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 20px', fontWeight: 700, fontSize: 14,
            }}>Enter Arena</button>
          </div>
        ) : (
          <button onClick={onConnectClick} style={{
            background: colors.primaryContainer, color: colors.onPrimary, border: 'none',
            borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 14,
          }}>Connect Wallet</button>
        )}
      </header>

      <section style={{
        background: colors.surfaceContainerLow, padding: '64px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap',
      }}>
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
            1v1 Blockchain Combat. Prove Your Worth.
          </h1>
          <p style={{ color: colors.onSurfaceVariant, fontSize: 16, marginBottom: 28 }}>
            Battle real opponents on Solana. Win tokens. Climb the ranks.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setPage(connected ? 'dashboard' : 'dashboard')} style={{
              background: colors.primaryContainer, color: colors.onPrimary, border: 'none',
              borderRadius: 8, padding: '14px 28px', fontWeight: 700, fontSize: 15,
            }}>Enter Arena</button>
            <button onClick={() => setPage('leaderboard')} style={{
              background: 'transparent', color: colors.primary, border: `1px solid ${colors.primary}`,
              borderRadius: 8, padding: '14px 28px', fontWeight: 700, fontSize: 15,
            }}>View Leaderboard</button>
          </div>
        </div>
        <div style={{
          width: 460, maxWidth: '100%', height: 320, borderRadius: 12,
          background: `linear-gradient(135deg, ${colors.surfaceContainer}, ${colors.surfaceContainerHigh})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
          border: `1px solid ${colors.outlineVariant}`,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shield_person" size={44} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: colors.onSurfaceVariant }}>YOU</span>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: colors.outline, fontStyle: 'italic' }}>VS</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: colors.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="sports_kabaddi" size={44} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: colors.onSurfaceVariant }}>OPPONENT</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
        {[
          { icon: 'swords', title: 'Battle the AI', desc: 'Face off against a scripted combat AI in fast-paced turn-based battles, right in your browser.' },
          { icon: 'payments', title: 'Earn $SOLA Tokens', desc: 'Stake your reputation and tokens in high-stakes wagers. Winners take all, settled instantly on the Solana blockchain.' },
          { icon: 'sync_alt', title: 'On-Chain Results', desc: 'Every strike, victory, and loss is immutable. Build your permanent combat history on the ledger.' },
        ].map(f => (
          <div key={f.title}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: colors.surfaceContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: colors.primary }}>
              <Icon name={f.icon} size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      <section style={{ background: colors.surfaceContainerLow, padding: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Active Arena Log</h2>
          <span style={{ color: colors.primary, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View all matches</span>
        </div>
        {[
          { p1: 'CryptoKnight.sol', p2: 'ChainBreaker_99', pool: '5.00', live: true },
          { p1: 'SolaVixen', p2: 'Titan_One', pool: '12.50', live: false },
        ].map((m, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 10, padding: '14px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{m.p1}</span>
            <span style={{ color: colors.primary, fontSize: 11, fontWeight: 700, background: colors.surfaceContainer, padding: '2px 8px', borderRadius: 6 }}>VS</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{m.p2}</span>
            <div style={{ flex: 1 }} />
            <span style={{ color: colors.onSurfaceVariant, fontSize: 13 }}>Stake Pool</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{m.pool} SOL</span>
            <span style={{ color: m.live ? colors.secondary : colors.onSurfaceVariant, fontWeight: 700, fontSize: 12 }}>{m.live ? '● LIVE' : 'COMPLETED'}</span>
            <button style={{ background: m.live ? colors.surfaceContainer : 'transparent', border: `1px solid ${colors.outlineVariant}`, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
              {m.live ? 'Watch Match' : 'Replay Log'}
            </button>
          </div>
        ))}
      </section>

      <footer style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${colors.outlineVariant}`, fontSize: 13 }}>
        <div>
          <div style={{ fontWeight: 700, color: colors.primary }}>SolaBattle</div>
          <div style={{ color: colors.onSurfaceVariant }}>© 2026 SolaBattle. All combat is final.</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: colors.secondary, fontWeight: 600 }}>● Solana Devnet: Operational</div>
          <div style={{ color: colors.onSurfaceVariant, display: 'flex', gap: 16, marginTop: 4 }}>
            <span>Privacy</span><span>Terms</span><span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============ DASHBOARD SCREEN ============
function DashboardScreen({ setPage, connected, address, balance, onConnectClick, onDisconnect, onAirdrop, airdropping }: WalletProps) {
  const navItems = [
    { icon: 'swords', label: 'Arena', active: true, page: 'dashboard' as Page },
    { icon: 'leaderboard', label: 'Leaderboard', active: false, page: 'leaderboard' as Page },
    { icon: 'inventory_2', label: 'Inventory', active: false, page: null },
    { icon: 'history', label: 'History', active: false, page: null },
  ];

  const matches = [
    { result: 'Victory', opp: '0x...99e1', time: '14 minutes ago • Tier IV Arena', sol: '+2.4 SOL', xp: '+142 XP', win: true },
    { result: 'Defeat', opp: '0x...c2f4', time: '2 hours ago • Ranked Match', sol: '-1.2 SOL', xp: '-45 XP', win: false },
    { result: 'Victory', opp: '0x...k8k1', time: 'Yesterday • Tier III Arena', sol: '+1.8 SOL', xp: '+98 XP', win: true },
  ];

  return (
    <div style={{ background: colors.background, minHeight: '100vh', display: 'flex', color: colors.onSurface }}>
      <aside style={{ width: 260, borderRight: `1px solid ${colors.outlineVariant}`, display: 'flex', flexDirection: 'column', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh' }}>
        <span onClick={() => setPage('home')} style={{ fontSize: 20, fontWeight: 800, color: colors.primary, marginBottom: 24, cursor: 'pointer' }}>SolaBattle</span>

        <div style={{ background: colors.surfaceContainerLow, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="shield_person" size={28} style={{ color: '#fff' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Warrior</div>
            <div style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>
              {connected && address ? truncateAddress(address) : 'Not connected'}
            </div>
          </div>
          <span style={{ background: 'rgba(78,222,163,0.15)', color: colors.secondary, fontWeight: 700, fontSize: 12, padding: '3px 10px', borderRadius: 20 }}>
            {connected && balance !== null ? `${balance.toFixed(3)} SOL` : '—'}
          </span>
          {connected ? (
            <>
              <button onClick={onAirdrop} disabled={airdropping} style={{
                width: '100%', marginTop: 4, background: 'transparent', border: `1px solid ${colors.outlineVariant}`,
                color: colors.primary, borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 600,
              }}>{airdropping ? 'Airdropping...' : 'Airdrop 1 SOL (devnet)'}</button>
              <button onClick={onDisconnect} style={{
                width: '100%', background: 'none', border: 'none', color: colors.error, fontSize: 12, fontWeight: 600,
              }}>Disconnect</button>
            </>
          ) : (
            <button onClick={onConnectClick} style={{
              width: '100%', background: colors.primaryContainer, color: '#fff', border: 'none',
              borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700,
            }}>Connect Wallet</button>
          )}
        </div>

        {navItems.map(item => (
          <div key={item.label} onClick={() => item.page && setPage(item.page)} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
            background: item.active ? colors.primaryContainer : 'transparent',
            color: item.active ? '#fff' : colors.onSurfaceVariant,
            fontWeight: item.active ? 700 : 500, fontSize: 14,
          }}>
            <Icon name={item.icon} size={20} />{item.label}
          </div>
        ))}

        <div style={{ flex: 1 }} />
        <button onClick={() => setPage('battle')} style={{
          background: colors.primaryContainer, color: '#fff', border: 'none', borderRadius: 10,
          padding: '13px', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}><Icon name="smart_toy" size={18} />Battle the AI Champion</button>
      </aside>

      <main style={{ flex: 1, padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <span style={{ color: colors.onSurfaceVariant, fontSize: 15 }}>
            Welcome back, <strong style={{ color: colors.onSurface }}>{connected && address ? truncateAddress(address) : '[not connected]'}</strong>
          </span>
          <div style={{ background: colors.surfaceContainerLow, borderRadius: 20, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
            {connected && balance !== null ? `${balance.toFixed(3)} SOL` : '—'} <Icon name="content_copy" size={16} style={{ color: colors.onSurfaceVariant }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 12, padding: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: colors.onSurfaceVariant }}>RECORD</span>
            <div style={{ fontSize: 28, fontWeight: 800, margin: '6px 0' }}>12W — 5L</div>
            <span style={{ color: colors.secondary, fontWeight: 600, fontSize: 13 }}>70.6% Win Rate</span>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: colors.onSurfaceVariant }}>ARENA RANK</span>
              <span style={{ color: colors.primary, fontSize: 11, fontWeight: 700 }}>Top 1%</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, margin: '6px 0' }}>#8 Global</div>
            <div style={{ background: colors.surfaceContainer, borderRadius: 4, height: 5 }}>
              <div style={{ background: colors.primaryContainer, width: '65%', height: '100%', borderRadius: 4 }} />
            </div>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 12, padding: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: colors.onSurfaceVariant }}>EARNINGS</span>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.secondary, margin: '6px 0' }}>485 SOLA</div>
            <span style={{ color: colors.onSurfaceVariant, fontSize: 13 }}>Lifetime $SOLA earned</span>
          </div>
        </div>

        <button onClick={() => setPage('battle')} style={{
          width: '100%', background: colors.primaryContainer, color: '#fff', border: 'none', borderRadius: 12,
          padding: 18, fontWeight: 700, fontSize: 16, marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}><Icon name="bolt" size={20} />Find New Opponent</button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Recent Matches</h3>
              <span style={{ color: colors.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View All History</span>
            </div>
            {matches.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#fff',
                border: `1px solid ${colors.outlineVariant}`, borderLeft: `3px solid ${m.win ? colors.secondary : colors.error}`,
                borderRadius: 10, marginBottom: 10,
              }}>
                <Icon name={m.win ? 'check_circle' : 'cancel'} size={22} style={{ color: m.win ? colors.secondary : colors.error }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.result} vs {m.opp}</div>
                  <div style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>{m.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: m.win ? colors.secondary : colors.error }}>{m.sol}</div>
                  <div style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>{m.xp}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ background: colors.surfaceContainerLow, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="inventory_2" size={18} style={{ color: colors.primary }} />COMBAT GEAR
              </span>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {['MK-II Aegis', 'Pulse Visor'].map(g => (
                  <div key={g} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 10, height: 64, marginBottom: 6 }} />
                    <span style={{ fontSize: 11, color: colors.onSurfaceVariant }}>{g}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', marginTop: 12, background: 'transparent', border: `1px solid ${colors.outlineVariant}`, color: colors.primary, borderRadius: 8, padding: 10, fontWeight: 600, fontSize: 13 }}>Manage Inventory</button>
            </div>

            <div style={{ background: colors.primaryContainer, borderRadius: 12, padding: 18, color: '#fff' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Weekly Prize Pool</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 14 }}>5,000 $SOLA up for grabs</div>
              <button onClick={() => setPage('leaderboard')} style={{ width: '100%', background: '#fff', color: colors.primary, border: 'none', borderRadius: 8, padding: 10, fontWeight: 700, fontSize: 13 }}>View Leaderboard</button>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${colors.outlineVariant}`, display: 'flex', justifyContent: 'space-between', color: colors.onSurfaceVariant, fontSize: 12 }}>
          <span>© 2026 SolaBattle</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ color: colors.secondary }}>● Network: Solana Devnet</span>
            <span>Support</span>
            <span>Rules of Combat</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ============ BATTLE SCREEN ============
function BattleScreen({ setPage }: WalletProps) {
  const [playerHP, setPlayerHP] = useState(100);
  const [oppHP, setOppHP] = useState(100);
  const [log, setLog] = useState<string[]>(['>> Initializing Neural Combat Link... [SUCCESS]', '>> Validating Block State... [OK]']);
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(60);
  const [over, setOver] = useState(false);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => setTimer(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [over]);

const act = (type: 'attack' | 'defend' | 'special') => {
    if (over) return;
    const dmg = type === 'special' ? 25 : type === 'attack' ? Math.floor(Math.random() * 10) + 10 : 0;
    const move = type === 'attack' ? 'KINETIC STRIKE' : type === 'defend' ? 'DEFENSIVE STANCE' : 'OVERLOAD CIRCUIT';
    const newOpp = Math.max(0, oppHP - dmg);
    setOppHP(newOpp);
    setLog(prev => [...prev, `>> PLAYER executes ${move}`, dmg > 0 ? `>> OPPONENT receives ${dmg} DMG` : `>> Damage mitigated`]);
    if (newOpp === 0) { setOver(true); setWinner('You'); setLog(prev => [...prev, '>> VICTORY: Opponent eliminated']); return; }
    // End the fight after round 5 no matter what, so it doesn't drag on
    if (round >= 5) {
      setOver(true);
      setWinner(playerHP >= oppHP ? 'You' : 'Opponent');
      return;
    }
    setTimeout(() => {
      const eDmg = type === 'defend' ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 10) + 8;
      const newP = Math.max(0, playerHP - eDmg);
      setPlayerHP(newP);
      setRound(r => r + 1);
      setTimer(60);
      setLog(prev => [...prev, `>> OPPONENT counters! ${eDmg} DMG taken`, '>> Syncing results to Solana Devnet...']);
      if (newP === 0) { setOver(true); setWinner('Opponent'); }
    }, 700);
  };
  if (over) {
    const won = winner === 'You';
    return (
      <div style={{ background: colors.surfaceContainerLow, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.onSurface }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: `1px solid ${colors.outlineVariant}` }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
            background: won ? 'rgba(78,222,163,0.15)' : 'rgba(186,26,26,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: won ? colors.secondary : colors.error,
          }}><Icon name={won ? 'military_tech' : 'sentiment_dissatisfied'} size={36} /></div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px' }}>{won ? 'YOU WON!' : 'YOU LOST'}</h1>
          <p style={{ color: colors.onSurfaceVariant, marginBottom: 24 }}>{won ? 'Victory belongs to the swift.' : 'Better luck next time, warrior.'}</p>

          <div style={{ background: colors.surfaceContainerLow, borderRadius: 10, padding: 18, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${colors.outlineVariant}` }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: '0.05em' }}>ROUNDS</span>
              <span style={{ fontWeight: 700 }}>{round}/5</span>
            </div>
            {won && (
              <>
                <div style={{ fontWeight: 700, color: colors.secondary, marginBottom: 2 }}>+10 Tokens Earned!</div>
                <div style={{ fontWeight: 600, color: colors.primary, fontSize: 13 }}>+20 XP gained</div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => { setPlayerHP(100); setOppHP(100); setRound(1); setTimer(60); setOver(false); setWinner(''); setLog(['>> New battle initialized']); }} style={{
              background: colors.primaryContainer, color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontWeight: 700,
            }}>Play Again</button>
            <button onClick={() => setPage('leaderboard')} style={{
              background: 'transparent', border: `1px solid ${colors.outlineVariant}`, color: colors.onSurface, borderRadius: 10, padding: 14, fontWeight: 700,
            }}>View Leaderboard</button>
            <button onClick={() => setPage('dashboard')} style={{ background: 'none', border: 'none', color: colors.primary, fontWeight: 600, fontSize: 13, marginTop: 4 }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.onSurface }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 32px', borderBottom: `1px solid ${colors.outlineVariant}` }}>
        <span style={{ background: colors.primaryContainer, color: '#fff', borderRadius: 6, padding: '5px 12px', fontWeight: 700, fontSize: 13 }}>ROUND {round} OF 5</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.secondary, fontSize: 13, fontWeight: 600 }}>● Network: Solana Devnet</span>
        <span style={{ fontWeight: 700, fontSize: 14 }}>ID: #A4F2</span>
        <span style={{ color: colors.tertiary, fontWeight: 800, fontSize: 18 }}>{timer}s</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 20, padding: '24px 32px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: colors.primary, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="shield_person" size={44} style={{ color: '#fff' }} />
          </div>
          <div style={{ fontWeight: 700 }}>You</div>
          <div style={{ color: colors.onSurfaceVariant, fontSize: 12, marginBottom: 12 }}>Master Warrior</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span>Health</span><strong>{playerHP}/100</strong>
          </div>
          <div style={{ background: colors.surfaceContainer, borderRadius: 4, height: 8, marginBottom: 14 }}>
            <div style={{ background: colors.primaryContainer, width: `${playerHP}%`, height: '100%', borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
            {[{ l: 'ATK', v: 20 }, { l: 'DEF', v: 10 }, { l: 'SPD', v: 18 }].map(s => (
              <div key={s.l} style={{ background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 8, padding: '8px 4px' }}>
                <div style={{ fontSize: 10, color: colors.onSurfaceVariant }}>{s.l}</div>
                <div style={{ fontWeight: 700 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 12, padding: 16, height: 320, overflowY: 'auto' }}>
          <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', color: colors.onSurfaceVariant, marginBottom: 10 }}>BATTLE PROTOCOL LOG</div>
          {log.map((l, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: 12, padding: '6px 0', color: l.includes('PLAYER') ? colors.primary : l.includes('OPPONENT') ? colors.tertiary : colors.onSurfaceVariant }}>{l}</div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: colors.tertiary, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="sports_kabaddi" size={44} style={{ color: '#fff' }} />
          </div>
          <div style={{ fontWeight: 700 }}>Combat AI</div>
          <div style={{ color: colors.tertiary, fontSize: 12, marginBottom: 12 }}>Arena Bot · Round-based AI</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span>Health</span><strong>{oppHP}/100</strong>
          </div>
          <div style={{ background: colors.surfaceContainer, borderRadius: 4, height: 8, marginBottom: 14 }}>
            <div style={{ background: colors.tertiary, width: `${oppHP}%`, height: '100%', borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
            {[{ l: 'ATK', v: 19 }, { l: 'DEF', v: 11 }, { l: 'SPD', v: 17 }].map(s => (
              <div key={s.l} style={{ background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 8, padding: '8px 4px' }}>
                <div style={{ fontSize: 10, color: colors.onSurfaceVariant }}>{s.l}</div>
                <div style={{ fontWeight: 700 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, padding: '0 32px 32px' }}>
        <button onClick={() => act('attack')} style={{ background: colors.tertiaryContainer, color: '#fff', border: 'none', borderRadius: 10, padding: 18, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
          <Icon name="swords" size={26} />
          <div><div style={{ fontWeight: 800 }}>ATTACK</div><div style={{ fontSize: 12, opacity: 0.85 }}>High impact burst</div></div>
        </button>
        <button onClick={() => act('defend')} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: 10, padding: 18, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
          <Icon name="shield" size={26} />
          <div><div style={{ fontWeight: 800 }}>DEFEND</div><div style={{ fontSize: 12, opacity: 0.85 }}>Fortify, neutralize</div></div>
        </button>
        <button onClick={() => act('special')} style={{ background: colors.primaryContainer, color: '#fff', border: 'none', borderRadius: 10, padding: 18, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
          <Icon name="bolt" size={26} />
          <div><div style={{ fontWeight: 800 }}>SPECIAL</div><div style={{ fontSize: 12, opacity: 0.85 }}>Overload circuit</div></div>
        </button>
      </div>
    </div>
  );
}

// ============ LEADERBOARD SCREEN ============
function LeaderboardScreen({ setPage }: WalletProps) {
  const [tab, setTab] = useState<'all' | 'week' | 'month'>('all');

  const navItems = [
    { icon: 'swords', label: 'Arena', active: false, page: 'dashboard' as Page },
    { icon: 'leaderboard', label: 'Leaderboard', active: true, page: 'leaderboard' as Page },
    { icon: 'inventory_2', label: 'Inventory', active: false, page: null },
    { icon: 'history', label: 'History', active: false, page: null },
  ];

  const topThree = [
    { rank: 1, name: 'Player_Alpha', wins: 48, losses: 12, winRate: 80, sol: '145.20' },
    { rank: 2, name: 'SolSlayer_99', wins: 42, losses: 15, winRate: 74, sol: '98.45' },
    { rank: 3, name: 'ValidatorElite', wins: 39, losses: 18, winRate: 68, sol: '82.10' },
  ];

  const midTier = [
    { rank: 4, name: 'BlockBuster', wins: 35, losses: 20, winRate: 63, sol: '71.00' },
  ];

  const you = { rank: 8, name: 'You (0x...7a2b)', wins: 28, losses: 22, winRate: 56, sol: '42.50' };

  const rest = [
    { rank: 9, name: 'GridMaster', wins: 27, losses: 25, winRate: 52, sol: '38.20' },
    { rank: 10, name: 'ChainReax', wins: 25, losses: 28, winRate: 47, sol: '31.05' },
  ];

  const Row = ({ p, highlight = false }: { p: typeof topThree[0]; highlight?: boolean }) => (
    <div style={{
      display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 140px 120px',
      alignItems: 'center', padding: '16px 20px',
      borderBottom: `1px solid ${colors.outlineVariant}`,
      background: highlight ? 'rgba(79,70,229,0.06)' : 'transparent',
      borderLeft: highlight ? `3px solid ${colors.primaryContainer}` : '3px solid transparent',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: p.rank === 1 ? colors.primaryContainer : highlight ? colors.surfaceContainer : colors.surfaceContainerLow,
        color: p.rank === 1 ? '#fff' : colors.onSurface,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13,
      }}>{p.rank}</div>
      <span style={{ fontWeight: highlight ? 700 : 600, fontSize: 14, color: highlight ? colors.primary : colors.onSurface }}>{p.name}</span>
      <span style={{ color: colors.secondary, fontWeight: 600 }}>{p.wins}W</span>
      <span style={{ color: colors.onSurfaceVariant }}>{p.losses}L</span>
      <span style={{
        fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, width: 'fit-content',
        background: p.winRate >= 70 ? 'rgba(78,222,163,0.15)' : highlight ? 'rgba(79,70,229,0.12)' : 'transparent',
        color: p.winRate >= 70 ? colors.secondary : highlight ? colors.primary : colors.onSurfaceVariant,
      }}>{p.winRate}% Win Rate</span>
      <span style={{ textAlign: 'right', color: colors.primary, fontWeight: 700 }}>{p.sol} SOL</span>
    </div>
  );

  return (
    <div style={{ background: colors.background, minHeight: '100vh', display: 'flex', color: colors.onSurface }}>
      <aside style={{ width: 260, borderRight: `1px solid ${colors.outlineVariant}`, display: 'flex', flexDirection: 'column', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh' }}>
        <span onClick={() => setPage('home')} style={{ fontSize: 20, fontWeight: 800, color: colors.primary, marginBottom: 24, cursor: 'pointer' }}>SolaBattle</span>

        <div style={{ background: colors.surfaceContainerLow, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="shield_person" size={28} style={{ color: '#fff' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Warrior_0x7a2b</div>
            <div style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>0x...7a2b</div>
          </div>
          <span style={{ background: 'rgba(78,222,163,0.15)', color: colors.secondary, fontWeight: 700, fontSize: 12, padding: '3px 10px', borderRadius: 20 }}>12.5 SOL</span>
        </div>

        {navItems.map(item => (
          <div key={item.label} onClick={() => item.page && setPage(item.page)} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
            background: item.active ? colors.primaryContainer : 'transparent',
            color: item.active ? '#fff' : colors.onSurfaceVariant,
            fontWeight: item.active ? 700 : 500, fontSize: 14,
          }}>
            <Icon name={item.icon} size={20} />{item.label}
          </div>
        ))}

        <div style={{ flex: 1 }} />
        <button onClick={() => setPage('battle')} style={{
          background: colors.primaryContainer, color: '#fff', border: 'none', borderRadius: 10,
          padding: '13px', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}><Icon name="search" size={18} />Find Opponent</button>
      </aside>

      <main style={{ flex: 1, padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Leaderboard</h1>
            <p style={{ color: colors.onSurfaceVariant, fontSize: 14, margin: '6px 0 0' }}>SolaBattle Arena: Top 50 Warriors dominating the Solana grid.</p>
          </div>
          <span style={{
            border: `1px solid ${colors.outlineVariant}`, borderRadius: 20, padding: '8px 16px',
            fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
          }}><Icon name="group" size={16} />Top 50 Players</span>
        </div>

        <div style={{ display: 'flex', gap: 24, marginBottom: 20, borderBottom: `1px solid ${colors.outlineVariant}` }}>
          {(['all', 'week', 'month'] as const).map(t => (
            <span key={t} onClick={() => setTab(t)} style={{
              paddingBottom: 12, cursor: 'pointer', fontSize: 14,
              fontWeight: tab === t ? 700 : 500,
              color: tab === t ? colors.onSurface : colors.onSurfaceVariant,
              borderBottom: tab === t ? `2px solid ${colors.onSurface}` : 'none',
            }}>{t === 'all' ? 'All Time' : t === 'week' ? 'This Week' : 'This Month'}</span>
          ))}
        </div>

        <div style={{ background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 140px 120px', padding: '12px 20px',
            background: colors.surfaceContainerLow, color: colors.primary, fontWeight: 700, fontSize: 12, letterSpacing: '0.03em',
          }}>
            <span>RANK</span><span>PLAYER</span><span>WINS</span><span>LOSSES</span><span>WIN%</span><span style={{ textAlign: 'right' }}>TOKENS</span>
          </div>

          {topThree.map(p => <Row key={p.rank} p={p} />)}
          {midTier.map(p => <Row key={p.rank} p={p} />)}

          <div style={{ textAlign: 'center', padding: '8px', background: colors.surfaceContainerLow, color: colors.onSurfaceVariant, fontSize: 12, fontWeight: 600 }}>
            RANK 5 — 7
          </div>

          <Row p={you} highlight />
          {rest.map(p => <Row key={p.rank} p={p} />)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, color: colors.onSurfaceVariant, fontSize: 13 }}>
          <span>Showing 1-10 of 50 Top Warriors</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ border: `1px solid ${colors.outlineVariant}`, background: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 13 }}>Previous</button>
            <button style={{ border: `1px solid ${colors.outlineVariant}`, background: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 13 }}>Next</button>
          </div>
        </div>

        <footer style={{ marginTop: 40, paddingTop: 16, borderTop: `1px solid ${colors.outlineVariant}`, display: 'flex', justifyContent: 'space-between', color: colors.onSurfaceVariant, fontSize: 12 }}>
          <span>© 2026 SolaBattle</span>
          <span style={{ color: colors.secondary }}>● Network: Solana Devnet</span>
        </footer>
      </main>
    </div>
  );
}
// ============ HOW TO PLAY SCREEN ============
function HowToPlayScreen({ setPage }: WalletProps) {
  const steps = [
    { icon: 'account_balance_wallet', title: '1. Connect Your Wallet', desc: 'Link your Phantom wallet to SolaBattle. This is your identity in the arena — no sign-up forms, just your wallet.' },
    { icon: 'search', title: '2. Find an Opponent', desc: 'Hit "Find Opponent" from your dashboard to get matched into a 1v1 battle.' },
    { icon: 'swords', title: '3. Battle in Real Time', desc: 'Each round, choose Attack, Defend, or Special. Attack deals steady damage, Defend reduces incoming damage, Special is a high-risk high-reward strike.' },
    { icon: 'favorite', title: '4. Watch Your Health', desc: 'Both fighters have 100 HP. First one to 0 loses. The battle log on screen shows every move in real time.' },
    { icon: 'military_tech', title: '5. Win Rewards', desc: 'Winning earns you $SOLA tokens and XP, and moves you up the leaderboard rankings.' },
    { icon: 'leaderboard', title: '6. Climb the Ranks', desc: 'Check the Leaderboard anytime to see how you stack up against other warriors in the arena.' },
  ];

  return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.onSurface }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px', borderBottom: `1px solid ${colors.outlineVariant}`,
      }}>
        <span onClick={() => setPage('home')} style={{ fontSize: 22, fontWeight: 800, color: colors.primary, cursor: 'pointer' }}>SolaBattle</span>
        <button onClick={() => setPage('dashboard')} style={{
          background: colors.primaryContainer, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 14,
        }}>Enter Arena</button>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>How to Play</h1>
        <p style={{ color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: 40, fontSize: 15 }}>
          New to SolaBattle or new to Solana? Here's everything you need to know.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map(s => (
            <div key={s.title} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              background: '#fff', border: `1px solid ${colors.outlineVariant}`, borderRadius: 12, padding: 20,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: colors.surfaceContainer,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: colors.primary,
              }}><Icon name={s.icon} size={22} /></div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{s.title}</h3>
                <p style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 32, background: colors.surfaceContainerLow, borderRadius: 12, padding: 20,
          border: `1px solid ${colors.outlineVariant}`,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="info" size={18} style={{ color: colors.primary }} />New to Solana?
          </h3>
          <p style={{ color: colors.onSurfaceVariant, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            You'll need the Phantom wallet browser extension, set to Devnet mode. Devnet SOL is free test currency —
            you can request some anytime using the Airdrop button on your dashboard. No real money is involved.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={() => setPage('dashboard')} style={{
            background: colors.primaryContainer, color: '#fff', border: 'none', borderRadius: 10,
            padding: '14px 32px', fontWeight: 700, fontSize: 15,
          }}>Enter the Arena</button>
        </div>
      </main>

      <footer style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${colors.outlineVariant}`, fontSize: 13, marginTop: 40 }}>
        <span style={{ color: colors.onSurfaceVariant }}>© 2026 SolaBattle</span>
        <span style={{ color: colors.secondary, fontWeight: 600 }}>● Solana Devnet: Operational</span>
      </footer>
    </div>
  );
}

// ============ MAIN APP ============
export default function Pages() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { publicKey, connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number | null>(null);
  const [airdropping, setAirdropping] = useState(false);

  const address = publicKey ? publicKey.toBase58() : null;

  const fetchBalance = useCallback(async () => {
    if (!publicKey) { setBalance(null); return; }
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (e) {
      console.error('Balance fetch failed:', e);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleAirdrop = async () => {
    if (!publicKey) return;
    setAirdropping(true);
    try {
      const sig = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig, 'confirmed');
      await fetchBalance();
    } catch (e) {
      console.error('Airdrop failed:', e);
      alert('Airdrop failed — devnet faucet may be rate-limited. Try again in a bit.');
    } finally {
      setAirdropping(false);
    }
  };

  const walletProps: WalletProps = {
    setPage: setCurrentPage,
    connected,
    address,
    balance,
    onConnectClick: () => setVisible(true),
    onDisconnect: disconnect,
    onAirdrop: handleAirdrop,
    airdropping,
  };

  if (currentPage === 'home') return <HomeScreen {...walletProps} />;
  if (currentPage === 'dashboard') return <DashboardScreen {...walletProps} />;
  if (currentPage === 'battle') return <BattleScreen {...walletProps} />;
  if (currentPage === 'leaderboard') return <LeaderboardScreen {...walletProps} />;
if (currentPage === 'howtoplay') return <HowToPlayScreen {...walletProps} />;
  return (
    <div style={{ background: colors.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.onSurfaceVariant }}>
      <div style={{ textAlign: 'center' }}>
        <p>{currentPage} screen coming next</p>
        <button onClick={() => setCurrentPage('home')} style={{ marginTop: 12, background: colors.primaryContainer, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px' }}>Back Home</button>
      </div>
    </div>
  );
}