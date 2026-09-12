'use client';

import { useState, useEffect, useRef } from 'react';

// ============ BOT CHAIN CONFIG ============
const BOT_CHAIN = {
  chainId: '0x3C8',
  chainName: 'BOT Chain Testnet',
  rpcUrls: ['https://rpc.bohr.life'],
  nativeCurrency: { name: 'BOT', symbol: 'BOT', decimals: 18 },
  blockExplorerUrls: ['https://scan.bohr.life'],
};

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// ============ DESIGN TOKENS (same as original SolaBattle) ============
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

type Page = 'home' | 'battle' | 'leaderboard' | 'history';

// ============ HOOKS ============
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function useOrientation() {
  const [landscape, setLandscape] = useState(false);
  useEffect(() => {
    const check = () => setLandscape(window.innerWidth > window.innerHeight);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return landscape;
}

const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

// ============ SVG ICONS ============
const Icon = ({ name, size = 20, color = colors.onSurface }: { name: string; size?: number; color?: string }) => {
  const icons: Record<string, string> = {
    swords: 'M6.92 5L5.5 3.58a2 2 0 0 0-2.82 2.82L4.08 7.77 2 9.84l1.41 1.42 8.49-8.49L10.48 1.35 8.34 3.5 6.92 2.08A2 2 0 0 0 4.1 4.9L5.5 6.31 4.09 7.72l1.41 1.42L6.92 7.72l1.41 1.42L6.92 5zm10.16 0l-1.42 1.42 1.42 1.41-1.41 1.42-1.42-1.42-1.41 1.42 8.49 8.48 1.41-1.41-2.08-2.09 1.41-1.41-1.41-1.42-1.42 1.42-1.41-1.42 1.41-1.41L17.08 5z',
    shield: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
    bolt: 'M7 2v11h3v9l7-12h-4l4-8z',
    military_tech: 'M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5.17L4 20.17V5h15v14z',
    leaderboard: 'M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z',
    history: 'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
    account_balance_wallet: 'M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
    smart_toy: 'M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13zm-3 3l-2-2h4l-2 2z',
    arrow_back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    check_circle: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    cancel: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z',
    open_in_new: 'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z',
    shield_person: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 14c-2 0-3.75-1.03-4.75-2.58.05-1.57 3.17-2.42 4.75-2.42s4.7.85 4.75 2.42C15.75 17.97 14 19 12 19z',
    sports_kabaddi: 'M10.42 7.12c.71.56 1.54.88 2.43.88h2.81l-1.63 4.27-2.8-1.17-3.43 6.63-1.76-.92 3.02-5.84-1.73-.71 1.09-3.14zm4.08-2.62c.83 0 1.5.67 1.5 1.5S15.33 7.5 14.5 7.5 13 6.83 13 6s.67-1.5 1.5-1.5zM8.82 3.5C9.65 3.5 10.32 4.17 10.32 5S9.65 6.5 8.82 6.5 7.32 5.83 7.32 5s.67-1.5 1.5-1.5zm10.93 12.07l-3.03-5.84-1.73.71 3.02 5.84-1.76.92-3.43-6.63-2.8 1.17L8.39 8.5h2.81c.89 0 1.72-.32 2.43-.88l1.37 3.96-1.73-.71 1.09 3.14-1.73.71 3.02 5.84-1.76.92z',
  };

  const d = icons[name];
  if (!d) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      style={{ flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  );
};

// ============ SVG WARRIOR CHARACTER ============
const WarriorSVG = ({
  isPlayer,
  state,
}: {
  isPlayer: boolean;
  state: 'idle' | 'attacking' | 'hit' | 'victory' | 'defeat';
}) => {
  const primary = isPlayer ? colors.primaryContainer : colors.tertiaryContainer;
  const shadow = isPlayer ? 'rgba(79,70,229,0.3)' : 'rgba(194,11,23,0.3)';

  const getStyle = (): React.CSSProperties => {
    switch (state) {
      case 'attacking':
        return {
          transform: isPlayer ? 'translateX(18px) rotate(-5deg)' : 'translateX(-18px) rotate(5deg)',
          transition: 'transform 0.15s ease-out',
          filter: `drop-shadow(0 0 12px ${primary})`,
        };
      case 'hit':
        return {
          transform: 'translateX(-6px)',
          transition: 'transform 0.05s',
          filter: 'brightness(2) saturate(0)',
        };
      case 'victory':
        return {
          transform: 'translateY(-6px)',
          animation: 'bounceWin 0.7s ease infinite',
          filter: `drop-shadow(0 0 16px gold)`,
        };
      case 'defeat':
        return {
          transform: 'rotate(25deg) translateY(8px)',
          transition: 'transform 0.5s ease',
          opacity: 0.5,
        };
      default:
        return {
          transform: 'translateX(0)',
          transition: 'transform 0.3s ease',
          filter: `drop-shadow(0 4px 12px ${shadow})`,
        };
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 120"
        width={80}
        height={120}
        style={{
          ...getStyle(),
          transform: `${isPlayer ? '' : 'scaleX(-1) '}${getStyle().transform || ''}`,
        }}
      >
        {/* Head */}
        <circle cx="40" cy="18" r="11" fill={primary} />
        {/* Visor */}
        <rect x="32" y="15" width="16" height="5" rx="2" fill="rgba(0,0,0,0.4)" />

        {/* Body / torso */}
        <rect x="28" y="30" width="24" height="28" rx="4" fill={primary} />
        {/* Chest detail */}
        <rect x="33" y="34" width="14" height="8" rx="2" fill="rgba(0,0,0,0.2)" />

        {/* Left arm */}
        <rect
          x={state === 'attacking' && isPlayer ? "10" : "14"}
          y="32"
          width="10"
          height="22"
          rx="5"
          fill={primary}
          style={{ transition: 'x 0.15s ease' }}
        />
        {/* Right arm */}
        <rect
          x={state === 'attacking' && !isPlayer ? "60" : "56"}
          y="32"
          width="10"
          height="22"
          rx="5"
          fill={primary}
          style={{ transition: 'x 0.15s ease' }}
        />

        {/* Weapon (sword) */}
        {isPlayer ? (
          <g transform={state === 'attacking' ? 'translate(2, -4)' : 'translate(0,0)'} style={{ transition: 'transform 0.15s' }}>
            <rect x="8" y="28" width="4" height="28" rx="1" fill="#888" />
            <rect x="4" y="38" width="12" height="3" rx="1" fill="#aaa" />
          </g>
        ) : (
          <g transform={state === 'attacking' ? 'translate(-2, -4)' : 'translate(0,0)'} style={{ transition: 'transform 0.15s' }}>
            <rect x="68" y="28" width="4" height="28" rx="1" fill="#888" />
            <rect x="64" y="38" width="12" height="3" rx="1" fill="#aaa" />
          </g>
        )}

        {/* Shield */}
        {isPlayer ? (
          <ellipse cx="62" cy="44" rx="7" ry="10" fill={colors.primary} opacity="0.8" />
        ) : (
          <ellipse cx="18" cy="44" rx="7" ry="10" fill={colors.tertiaryContainer} opacity="0.8" />
        )}

        {/* Left leg */}
        <rect x="30" y="58" width="10" height="28" rx="5" fill={primary} />
        {/* Right leg */}
        <rect x="40" y="58" width="10" height="28" rx="5" fill={primary} />

        {/* Boots */}
        <rect x="27" y="80" width="14" height="8" rx="3" fill="rgba(0,0,0,0.4)" />
        <rect x="39" y="80" width="14" height="8" rx="3" fill="rgba(0,0,0,0.4)" />
      </svg>
    </div>
  );
};

// ============ HP BAR ============
const HPBar = ({
  hp, maxHP = 200, label, flipped = false,
}: {
  hp: number; maxHP?: number; label: string; flipped?: boolean;
}) => {
  const pct = Math.max(0, (hp / maxHP) * 100);
  const barColor = pct > 50 ? colors.secondary : pct > 25 ? '#f97316' : colors.error;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{
        display: 'flex', justifyContent: flipped ? 'flex-end' : 'flex-start',
        alignItems: 'center', gap: 6,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: '0.08em' }}>
          {label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 800, color: colors.onSurface }}>
          {hp}/{maxHP}
        </span>
      </div>
      <div style={{
        background: colors.surfaceContainer,
        borderRadius: 4, height: 10, overflow: 'hidden',
        border: `1px solid ${colors.outlineVariant}`,
        direction: flipped ? 'rtl' : 'ltr',
      }}>
        <div style={{
          background: barColor,
          width: `${pct}%`, height: '100%',
          borderRadius: 4,
          transition: 'width 0.4s ease',
          boxShadow: `0 0 6px ${barColor}`,
        }} />
      </div>
    </div>
  );
};

// ============ HOME SCREEN ============
function HomeScreen({
  setPage,
}: {
  setPage: (p: Page) => void;
}) {
  const isMobile = useIsMobile();

  return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.onSurface, fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '16px 20px' : '20px 48px',
        borderBottom: `1px solid ${colors.outlineVariant}`,
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: colors.primary, letterSpacing: '-0.02em' }}>
          BotBattle
        </span>
        <nav style={{ display: 'flex', gap: isMobile ? 16 : 32, alignItems: 'center' }}>
          {!isMobile && (
            <>
              <span onClick={() => setPage('leaderboard')} style={{ color: colors.onSurfaceVariant, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                Leaderboard
              </span>
              <span onClick={() => setPage('history')} style={{ color: colors.onSurfaceVariant, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                History
              </span>
            </>
          )}
          <button onClick={() => setPage('battle')} style={{
            background: colors.primaryContainer, color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>
            Enter Arena
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section style={{
        background: colors.surfaceContainerLow,
        padding: isMobile ? '40px 20px' : '72px 48px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
      }}>
        <div style={{ maxWidth: 480 }}>
          <h1 style={{
            fontSize: isMobile ? 30 : 52, fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 16px',
          }}>
            1v1 Combat.<br />
            <span style={{ color: colors.primary }}>Prove Your Worth.</span>
          </h1>
          <p style={{ color: colors.onSurfaceVariant, fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
            10-round battles against the Combat AI. Every victory recorded permanently on BOT Chain.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => setPage('battle')} style={{
              background: colors.primaryContainer, color: '#fff', border: 'none',
              borderRadius: 8, padding: '14px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              Enter Arena
            </button>
            <button onClick={() => setPage('leaderboard')} style={{
              background: 'transparent', color: colors.primary,
              border: `1px solid ${colors.primary}`,
              borderRadius: 8, padding: '14px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              Leaderboard
            </button>
          </div>
        </div>

        {/* VS preview */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 32,
          background: `linear-gradient(135deg, ${colors.surfaceContainer}, ${colors.surfaceContainerHigh})`,
          border: `1px solid ${colors.outlineVariant}`,
          borderRadius: 16, padding: isMobile ? '24px 20px' : '32px 40px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <WarriorSVG isPlayer state="idle" />
            <span style={{ fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: '0.1em' }}>YOU</span>
          </div>
          <span style={{ fontSize: 28, fontWeight: 900, color: colors.outline, fontStyle: 'italic', paddingBottom: 24 }}>VS</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <WarriorSVG isPlayer={false} state="idle" />
            <span style={{ fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: '0.1em' }}>BOT AI</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: isMobile ? '32px 20px' : '56px 48px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 24, maxWidth: 1100, margin: '0 auto',
      }}>
        {[
          {
            icon: 'swords', title: '10-Round Battles',
            desc: '200 HP each. Attack, defend, or unleash your special. First to zero loses — or highest HP after 10 rounds wins.',
          },
          {
            icon: 'shield', title: 'On-Chain Results',
            desc: 'Every win recorded permanently on BOT Chain. Your combat history is immutable and publicly verifiable.',
          },
          {
            icon: 'smart_toy', title: 'Combat AI',
            desc: 'The AI reads your moves and counters. It gets commentary rights too — and it uses them.',
          },
        ].map(f => (
          <div key={f.title} style={{
            background: colors.surfaceContainerLow,
            border: `1px solid ${colors.outlineVariant}`,
            borderRadius: 12, padding: 24,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: colors.surfaceContainer,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Icon name={f.icon} size={22} color={colors.primary} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>{f.title}</h3>
            <p style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer style={{
        padding: isMobile ? '20px' : '20px 48px',
        borderTop: `1px solid ${colors.outlineVariant}`,
        display: 'flex', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8, fontSize: 13, color: colors.onSurfaceVariant,
      }}>
        <span style={{ fontWeight: 700, color: colors.primary }}>BotBattle</span>
        <span style={{ color: colors.secondary, fontWeight: 600 }}>● BOT Chain: Live</span>
      </footer>
    </div>
  );
}

// ============ BATTLE SCREEN ============
function BattleScreen({ setPage }: { setPage: (p: Page) => void }) {
  const isMobile = useIsMobile();
  const isLandscape = useOrientation();
  const mobileLandscape = isMobile && isLandscape;
  const mobilePortrait = isMobile && !isLandscape;

  const [playerHP, setPlayerHP] = useState(200);
  const [botHP, setBotHP] = useState(200);
  const [round, setRound] = useState(1);
  const [log, setLog] = useState<string[]>([
    'Neural combat link established.',
    'Combat AI online. Round 1 begins.',
  ]);
  const [over, setOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [resolving, setResolving] = useState(false);
  const [playerState, setPlayerState] = useState<'idle' | 'attacking' | 'hit' | 'victory' | 'defeat'>('idle');
  const [botState, setBotState] = useState<'idle' | 'attacking' | 'hit' | 'victory' | 'defeat'>('idle');
  const [txHash] = useState<string | null>(null);
  const [screenFlash, setScreenFlash] = useState(false);
  const lastMoveRef = useRef<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const addLog = (msgs: string[]) =>
    setLog(prev => [...prev, ...msgs]);

  const pickBotMove = (): 'attack' | 'defend' | 'special' => {
    const counters: Record<string, 'attack' | 'defend' | 'special'> = {
      attack: 'defend', defend: 'special', special: 'attack',
    };
    if (lastMoveRef.current && Math.random() < 0.45)
      return counters[lastMoveRef.current];
    const moves = ['attack', 'defend', 'special'] as const;
    return moves[Math.floor(Math.random() * 3)];
  };

  const act = async (type: 'attack' | 'defend' | 'special') => {
    if (over || resolving) return;
    setResolving(true);
    lastMoveRef.current = type;

    const labels: Record<string, string> = {
      attack: 'Kinetic Strike',
      defend: 'Iron Guard',
      special: 'Overload Circuit',
    };

    const botMove = pickBotMove();
    addLog([
      `Round ${round} — You: ${labels[type]} vs Bot: ${labels[botMove]}`,
    ]);

    // Animate
    setPlayerState('attacking');
    setBotState('attacking');
    await new Promise(r => setTimeout(r, 250));
    setPlayerState('idle');
    setBotState('idle');

    let pDmg = 0, bDmg = 0, resultMsg = '';

    if (type === botMove) {
      if (type === 'defend') {
        resultMsg = 'Both hold guard. No damage.';
      } else {
        const base = type === 'special' ? 28 : 18;
        pDmg = base; bDmg = base;
        resultMsg = `Clash — both take ${base} damage.`;
        setScreenFlash(true);
        setTimeout(() => setScreenFlash(false), 350);
      }
      setPlayerState('hit');
      setBotState('hit');
    } else if (
      (type === 'attack' && botMove === 'special') ||
      (type === 'defend' && botMove === 'attack') ||
      (type === 'special' && botMove === 'defend')
    ) {
      bDmg = type === 'special' ? 36 : type === 'attack' ? 24 : 15;
      resultMsg = `Your ${labels[type]} lands. Bot takes ${bDmg} damage.`;
      setBotState('hit');
    } else {
      pDmg = botMove === 'special' ? 36 : botMove === 'attack' ? 24 : 15;
      resultMsg = `Bot's ${labels[botMove]} connects. You take ${pDmg} damage.`;
      setPlayerState('hit');
    }

    await new Promise(r => setTimeout(r, 350));
    setPlayerState('idle');
    setBotState('idle');

    const newBotHP = Math.max(0, botHP - bDmg);
    const newPlayerHP = Math.max(0, playerHP - pDmg);
    setBotHP(newBotHP);
    setPlayerHP(newPlayerHP);
    addLog([resultMsg]);

    // Check end
    const isLastRound = round >= 10;
    const botDead = newBotHP === 0;
    const playerDead = newPlayerHP === 0;

    if (botDead || playerDead || isLastRound) {
      const won = newPlayerHP > newBotHP || botDead;
      setOver(true);
      setWinner(won ? 'You' : 'Bot');
      setPlayerState(won ? 'victory' : 'defeat');
      setBotState(won ? 'defeat' : 'victory');
      addLog([won ? 'Victory. Recording result on BOT Chain...' : 'Defeat.']);
      setResolving(false);
      return;
    }

    setRound(r => r + 1);
    setResolving(false);
  };

  const reset = () => {
    setPlayerHP(200); setBotHP(200); setRound(1);
    setOver(false); setWinner('');
    setPlayerState('idle'); setBotState('idle');
    setLog(['New battle initialized. Round 1 begins.']);
  };

  // ---- MOVE BUTTONS ----
  const MoveButtons = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: mobileLandscape ? '1fr' : 'repeat(3, 1fr)',
      gap: mobileLandscape ? 6 : 12,
    }}>
      {([
        { type: 'attack', icon: 'swords', label: 'ATTACK', sub: 'Kinetic Strike', bg: colors.tertiaryContainer },
        { type: 'defend', icon: 'shield', label: 'DEFEND', sub: 'Iron Guard', bg: '#1e293b' },
        { type: 'special', icon: 'bolt', label: 'SPECIAL', sub: 'Overload Circuit', bg: colors.primaryContainer },
      ] as const).map(m => (
        <button
          key={m.type}
          onClick={() => act(m.type)}
          disabled={resolving || over}
          style={{
            background: m.bg, color: '#fff', border: 'none',
            borderRadius: 10,
            padding: mobileLandscape ? '10px 8px' : mobilePortrait ? '18px 12px' : '18px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
            opacity: resolving || over ? 0.45 : 1,
            cursor: resolving || over ? 'not-allowed' : 'pointer',
            textAlign: 'left',
          }}
        >
          <Icon name={m.icon} size={mobileLandscape ? 18 : 24} color="#fff" />
          <div>
            <div style={{ fontWeight: 800, fontSize: mobileLandscape ? 12 : 14, letterSpacing: '0.05em' }}>{m.label}</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>{m.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );

  // ---- BATTLE LOG ----
  const BattleLog = ({ height }: { height: number | string }) => (
    <div style={{
      background: colors.surfaceContainerLow,
      border: `1px solid ${colors.outlineVariant}`,
      borderRadius: 10, padding: '10px 14px',
      height, overflowY: 'auto',
      fontFamily: 'monospace', fontSize: 12,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
        color: colors.onSurfaceVariant, marginBottom: 8,
      }}>
        BATTLE LOG
      </div>
      {log.map((l, i) => (
        <div key={i} style={{
          padding: '3px 0',
          borderBottom: `1px solid ${colors.outlineVariant}`,
          color: l.includes('Victory') ? colors.secondary
            : l.includes('Defeat') ? colors.error
            : l.includes('You:') ? colors.primary
            : colors.onSurfaceVariant,
          fontSize: 12, lineHeight: 1.5,
        }}>{l}</div>
      ))}
      <div ref={logEndRef} />
    </div>
  );

  // ---- BATTLE OVER ----
  if (over) {
    const won = winner === 'You';
    return (
      <div style={{
        background: colors.background, minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, fontFamily: 'Inter, sans-serif',
      }}>
        <style>{`@keyframes bounceWin { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>
        <div style={{
          background: '#fff',
          border: `1px solid ${colors.outlineVariant}`,
          borderRadius: 16, padding: isMobile ? 24 : 40,
          maxWidth: 420, width: '100%', textAlign: 'center',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        }}>
          <div style={{ marginBottom: 16 }}>
            <WarriorSVG isPlayer state={won ? 'victory' : 'defeat'} />
          </div>
          <h1 style={{
            fontSize: 36, fontWeight: 900, margin: '0 0 8px',
            color: won ? colors.secondary : colors.error,
          }}>
            {won ? 'VICTORY' : 'DEFEAT'}
          </h1>
          <p style={{ color: colors.onSurfaceVariant, marginBottom: 24, fontSize: 14 }}>
            {won
              ? `You won in round ${round} with ${playerHP} HP remaining.`
              : 'The Combat AI was stronger this time.'}
          </p>

          <div style={{
            background: colors.surfaceContainerLow,
            borderRadius: 10, padding: 16, marginBottom: 20,
            display: 'flex', justifyContent: 'space-around',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.onSurface }}>{round}</div>
              <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>ROUNDS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.secondary }}>{playerHP}</div>
              <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>HP LEFT</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.primary }}>
                <Icon name={won ? 'check_circle' : 'cancel'} size={24} color={won ? colors.secondary : colors.error} />
              </div>
              <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>RESULT</div>
            </div>
          </div>

          {won && (
            <div style={{
              background: colors.surfaceContainerLow,
              borderRadius: 10, padding: 14, marginBottom: 20,
              textAlign: 'left', fontSize: 13,
              border: `1px solid ${colors.outlineVariant}`,
            }}>
              <div style={{ fontWeight: 700, color: colors.secondary, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="check_circle" size={16} color={colors.secondary} />
                Match recorded on BOT Chain
              </div>
                                          <span style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>
                Connect wallet to record on-chain
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={reset} style={{
              background: colors.primaryContainer, color: '#fff', border: 'none',
              borderRadius: 10, padding: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              Fight Again
            </button>
            <button onClick={() => setPage('leaderboard')} style={{
              background: 'transparent', border: `1px solid ${colors.outlineVariant}`,
              color: colors.onSurface, borderRadius: 10, padding: 14,
              fontWeight: 600, cursor: 'pointer',
            }}>
              View Leaderboard
            </button>
            <button onClick={() => setPage('home')} style={{
              background: 'none', border: 'none',
              color: colors.primary, fontWeight: 600,
              fontSize: 13, cursor: 'pointer', marginTop: 4,
            }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- LANDSCAPE MOBILE ----
  if (mobileLandscape) {
    return (
      <div style={{
        background: screenFlash ? colors.surfaceContainer : colors.background,
        height: '100vh', color: colors.onSurface,
        fontFamily: 'Inter, sans-serif',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'background 0.2s',
      }}>
        <style>{`@keyframes bounceWin { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>

        {/* Top HUD */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', borderBottom: `1px solid ${colors.outlineVariant}`,
          background: colors.surfaceContainerLow,
        }}>
          <HPBar hp={playerHP} label="YOU" />
          <div style={{
            background: colors.primaryContainer, color: '#fff',
            padding: '4px 14px', borderRadius: 20,
            fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {round}/10
          </div>
          <HPBar hp={botHP} label="BOT" flipped />
        </div>

        {/* Arena */}
        <div style={{ flex: 1, display: 'flex', gap: 8, padding: '8px 12px', overflow: 'hidden' }}>
          {/* Fighters */}
          <div style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-around', flex: 1,
          }}>
            <WarriorSVG isPlayer state={playerState} />
            <WarriorSVG isPlayer={false} state={botState} />
          </div>

          {/* Log + buttons */}
          <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            <BattleLog height={100} />
            <MoveButtons />
          </div>
        </div>
      </div>
    );
  }

  // ---- PORTRAIT + DESKTOP ----
  return (
    <div style={{
      background: screenFlash ? colors.surfaceContainer : colors.background,
      minHeight: '100vh', color: colors.onSurface,
      fontFamily: 'Inter, sans-serif',
      transition: 'background 0.2s',
    }}>
      <style>{`@keyframes bounceWin { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>

      {/* Header HUD */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16,
        padding: isMobile ? '12px 16px' : '14px 32px',
        borderBottom: `1px solid ${colors.outlineVariant}`,
        background: colors.surfaceContainerLow,
      }}>
        <HPBar hp={playerHP} label="YOU" />
        <div style={{
          background: colors.primaryContainer, color: '#fff',
          padding: '6px 18px', borderRadius: 20, fontWeight: 800,
          fontSize: 14, whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          ROUND {round} / 10
        </div>
        <HPBar hp={botHP} label="BOT AI" flipped />
      </div>

      {/* Arena */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto 1fr' : '1fr 1.4fr 1fr',
        gap: isMobile ? 8 : 24,
        padding: isMobile ? '20px 16px' : '32px',
        alignItems: 'end',
      }}>
        <WarriorSVG isPlayer state={playerState} />
        <BattleLog height={isMobile ? 180 : 260} />
        <WarriorSVG isPlayer={false} state={botState} />
      </div>

      {/* Move buttons */}
      <div style={{ padding: isMobile ? '0 16px 24px' : '0 32px 32px' }}>
        <MoveButtons />
      </div>
    </div>
  );
}

// ============ LEADERBOARD ============
function LeaderboardScreen({ setPage }: { setPage: (p: Page) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.onSurface, fontFamily: 'Inter, sans-serif' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '16px 20px' : '20px 48px',
        borderBottom: `1px solid ${colors.outlineVariant}`,
      }}>
        <span onClick={() => setPage('home')} style={{ fontSize: 20, fontWeight: 800, color: colors.primary, cursor: 'pointer' }}>
          BotBattle
        </span>
        <button onClick={() => setPage('battle')} style={{
          background: colors.primaryContainer, color: '#fff', border: 'none',
          borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer',
        }}>
          Enter Arena
        </button>
      </header>
      <main style={{ maxWidth: 600, margin: '0 auto', padding: isMobile ? '32px 20px' : '48px 24px' }}>
        <h1 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 900, marginBottom: 8 }}>Leaderboard</h1>
        <p style={{ color: colors.onSurfaceVariant, fontSize: 14 }}>
          On-chain records from BOT Chain. Connect wallet to see your stats.
        </p>
      </main>
    </div>
  );
}

// ============ HISTORY ============
function HistoryScreen({ setPage }: { setPage: (p: Page) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.onSurface, fontFamily: 'Inter, sans-serif' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '16px 20px' : '20px 48px',
        borderBottom: `1px solid ${colors.outlineVariant}`,
      }}>
        <span onClick={() => setPage('home')} style={{ fontSize: 20, fontWeight: 800, color: colors.primary, cursor: 'pointer' }}>
          BotBattle
        </span>
        <button onClick={() => setPage('battle')} style={{
          background: colors.primaryContainer, color: '#fff', border: 'none',
          borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer',
        }}>
          Enter Arena
        </button>
      </header>
      <main style={{ maxWidth: 600, margin: '0 auto', padding: isMobile ? '32px 20px' : '48px 24px' }}>
        <h1 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 900, marginBottom: 8 }}>Battle History</h1>
        <p style={{ color: colors.onSurfaceVariant, fontSize: 14 }}>
          Your on-chain match history will appear here once your wallet is connected.
        </p>
      </main>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [page, setPage] = useState<Page>('home');

  if (page === 'home') return <HomeScreen setPage={setPage} />;
  if (page === 'battle') return <BattleScreen setPage={setPage} />;
  if (page === 'leaderboard') return <LeaderboardScreen setPage={setPage} />;
  if (page === 'history') return <HistoryScreen setPage={setPage} />;
  return null;
}