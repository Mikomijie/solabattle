'use client';

import { useState, useEffect, useRef } from 'react';

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

type Page = 'home' | 'battle' | 'leaderboard' | 'history';
type FighterState = 'idle' | 'attacking' | 'hit' | 'victory' | 'defeat';

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

// ============ INLINE SVG ICONS ============
const icons: Record<string, string> = {
  swords: 'M14.5 2.5c0 1.5-1.5 3-1.5 3L4 14l-2 4 4-2 8.5-9S16 5.5 16 4l2-2-1-1-2 2-1-1 2-2-1-1-1 1.5zM3 17l-1 3 3-1-2-2zm11-9l3 3-7 7-3-3 7-7z',
  shield: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  bolt: 'M7 2v11h3v9l7-12h-4l4-8z',
  check_circle: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  cancel: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z',
  smart_toy: 'M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13zm-3 3l-2-2h4l-2 2z',
  leaderboard: 'M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z',
  history: 'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
};

const Icon = ({ name, size = 20, color = colors.onSurface }: { name: string; size?: number; color?: string }) => {
  const d = icons[name];
  if (!d) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
};

// ============ WARRIOR SVG ============
const WarriorSVG = ({ isPlayer, state, size = 1 }: { isPlayer: boolean; state: FighterState; size?: number }) => {
  const primary = isPlayer ? colors.primaryContainer : colors.tertiaryContainer;

  const getTransform = () => {
    const flip = isPlayer ? '' : 'scaleX(-1)';
    switch (state) {
      case 'attacking': return `${flip} translateX(${isPlayer ? 16 : -16}px) rotate(${isPlayer ? -4 : 4}deg)`;
      case 'hit': return `${flip} translateX(${isPlayer ? -8 : 8}px)`;
      case 'victory': return `${flip} translateY(-8px)`;
      case 'defeat': return `${flip} rotate(${isPlayer ? 20 : -20}deg) translateY(8px)`;
      default: return flip;
    }
  };

  const getFilter = () => {
    switch (state) {
      case 'hit': return 'brightness(2) saturate(0)';
      case 'victory': return `drop-shadow(0 0 14px gold)`;
      case 'attacking': return `drop-shadow(0 0 10px ${primary})`;
      default: return `drop-shadow(0 4px 10px ${isPlayer ? 'rgba(79,70,229,0.25)' : 'rgba(194,11,23,0.25)'})`;
    }
  };

  const w = 80 * size;
  const h = 130 * size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 130"
      width={w}
      height={h}
      style={{
        transform: getTransform(),
        filter: getFilter(),
        transition: state === 'hit' ? 'transform 0.05s' : 'transform 0.2s ease, filter 0.2s ease',
        animation: state === 'victory' ? 'bounceWin 0.7s ease infinite' : 'none',
        opacity: state === 'defeat' ? 0.5 : 1,
      }}
    >
      {/* Head */}
      <circle cx="40" cy="16" r="12" fill={primary} />
      {/* Visor */}
      <rect x="31" y="13" width="18" height="6" rx="3" fill="rgba(0,0,0,0.35)" />

      {/* Body */}
      <rect x="27" y="29" width="26" height="30" rx="5" fill={primary} />
      {/* Chest plate */}
      <rect x="32" y="33" width="16" height="10" rx="3" fill="rgba(0,0,0,0.18)" />

      {/* Left arm */}
      <rect x="13" y="31" width="11" height="24" rx="5" fill={primary} />
      {/* Right arm */}
      <rect x="56" y="31" width="11" height="24" rx="5" fill={primary} />

      {/* Sword — player left side, bot right side */}
      {isPlayer ? (
        <>
          <rect x="7" y="26" width="5" height="30" rx="2" fill="#9ca3af" />
          <rect x="3" y="36" width="13" height="4" rx="1" fill="#d1d5db" />
        </>
      ) : (
        <>
          <rect x="68" y="26" width="5" height="30" rx="2" fill="#9ca3af" />
          <rect x="64" y="36" width="13" height="4" rx="1" fill="#d1d5db" />
        </>
      )}

      {/* Shield — opposite side */}
      {isPlayer
        ? <ellipse cx="63" cy="44" rx="8" ry="11" fill={colors.primaryContainer} opacity="0.75" />
        : <ellipse cx="17" cy="44" rx="8" ry="11" fill={colors.tertiaryContainer} opacity="0.75" />
      }

      {/* Legs */}
      <rect x="29" y="59" width="10" height="30" rx="5" fill={primary} />
      <rect x="41" y="59" width="10" height="30" rx="5" fill={primary} />

      {/* Boots */}
      <rect x="26" y="83" width="15" height="9" rx="3" fill="rgba(0,0,0,0.35)" />
      <rect x="39" y="83" width="15" height="9" rx="3" fill="rgba(0,0,0,0.35)" />
    </svg>
  );
};

// ============ HP BAR ============
const HPBar = ({
  hp, label, flipped = false,
}: {
  hp: number; label: string; flipped?: boolean;
}) => {
  const pct = Math.max(0, (hp / 200) * 100);
  const barColor = pct > 50 ? colors.secondary : pct > 25 ? '#f97316' : colors.error;
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        display: 'flex', justifyContent: flipped ? 'flex-end' : 'flex-start',
        gap: 6, marginBottom: 3,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: colors.onSurface }}>{hp}/200</span>
      </div>
      <div style={{
        background: colors.surfaceContainer, borderRadius: 4, height: 8,
        border: `1px solid ${colors.outlineVariant}`,
        direction: flipped ? 'rtl' : 'ltr',
        overflow: 'hidden',
      }}>
        <div style={{
          background: barColor, width: `${pct}%`, height: '100%',
          borderRadius: 4, transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
};

// ============ HOME SCREEN ============
function HomeScreen({ setPage }: { setPage: (p: Page) => void }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.onSurface, fontFamily: 'Inter, sans-serif' }}>
      <style>{`@keyframes bounceWin{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '16px 20px' : '20px 48px',
        borderBottom: `1px solid ${colors.outlineVariant}`,
        background: colors.surfaceContainerLow,
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: colors.primary, letterSpacing: '-0.02em' }}>BotBattle</span>
        <nav style={{ display: 'flex', gap: isMobile ? 16 : 32, alignItems: 'center' }}>
          {!isMobile && (
            <>
              <span onClick={() => setPage('leaderboard')} style={{ color: colors.onSurfaceVariant, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Leaderboard</span>
              <span onClick={() => setPage('history')} style={{ color: colors.onSurfaceVariant, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>History</span>
            </>
          )}
          <button onClick={() => setPage('battle')} style={{
            background: colors.primaryContainer, color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>Enter Arena</button>
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
            fontSize: isMobile ? 32 : 52, fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 16px',
          }}>
            1v1 Combat.<br />
            <span style={{ color: colors.primary }}>Prove Your Worth.</span>
          </h1>
          <p style={{ color: colors.onSurfaceVariant, fontSize: 16, marginBottom: 28, lineHeight: 1.6, margin: '0 0 28px' }}>
            10-round battles against the Combat AI. Every victory recorded permanently on BOT Chain.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => setPage('battle')} style={{
              background: colors.primaryContainer, color: '#fff', border: 'none',
              borderRadius: 8, padding: '14px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>Enter Arena</button>
            <button onClick={() => setPage('leaderboard')} style={{
              background: 'transparent', color: colors.primary, border: `1px solid ${colors.primary}`,
              borderRadius: 8, padding: '14px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>Leaderboard</button>
          </div>
        </div>

        {/* VS Card */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: isMobile ? 24 : 40,
          background: `linear-gradient(135deg, ${colors.surfaceContainer}, ${colors.surfaceContainerHigh})`,
          border: `1px solid ${colors.outlineVariant}`,
          borderRadius: 16, padding: isMobile ? '24px 20px' : '32px 48px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <WarriorSVG isPlayer state="idle" size={1.2} />
            <span style={{ fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: '0.1em' }}>YOU</span>
          </div>
          <span style={{ fontSize: 28, fontWeight: 900, color: colors.outline, fontStyle: 'italic', paddingBottom: 24 }}>VS</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <WarriorSVG isPlayer={false} state="idle" size={1.2} />
            <span style={{ fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: '0.1em' }}>BOT AI</span>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section style={{
        padding: isMobile ? '32px 20px' : '56px 48px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 24, maxWidth: 1100, margin: '0 auto',
      }}>
        {[
          { icon: 'swords', title: '10-Round Battles', desc: '200 HP each. Attack, defend, or special. Highest HP after 10 rounds wins.' },
          { icon: 'shield', title: 'On-Chain Results', desc: 'Every win recorded permanently on BOT Chain. Immutable and publicly verifiable.' },
          { icon: 'smart_toy', title: 'Combat AI', desc: 'The AI reads your moves and counters. It adapts every round.' },
        ].map(f => (
          <div key={f.title} style={{
            background: colors.surfaceContainerLow,
            border: `1px solid ${colors.outlineVariant}`,
            borderRadius: 12, padding: 24,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: colors.surfaceContainer,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
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
  const [log, setLog] = useState<string[]>(['Combat AI online. Round 1 begins.']);
  const [over, setOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [resolving, setResolving] = useState(false);
  const [playerState, setPlayerState] = useState<FighterState>('idle');
  const [botState, setBotState] = useState<FighterState>('idle');
  const [screenFlash, setScreenFlash] = useState(false);
  const [lastLine, setLastLine] = useState('');
  const [swipeHint, setSwipeHint] = useState(true);

  const lastMoveRef = useRef<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const resolvingRef = useRef(false);
  const overRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { resolvingRef.current = resolving; }, [resolving]);
  useEffect(() => { overRef.current = over; }, [over]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (resolvingRef.current || overRef.current) return;
      if (e.key === 'a' || e.key === 'A') act('attack');
      if (e.key === 'd' || e.key === 'D') act('defend');
      if (e.key === 's' || e.key === 'S') act('special');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const pickBotMove = (): 'attack' | 'defend' | 'special' => {
    const counters: Record<string, 'attack' | 'defend' | 'special'> = {
      attack: 'defend', defend: 'special', special: 'attack',
    };
    if (lastMoveRef.current && Math.random() < 0.45) return counters[lastMoveRef.current];
    const moves = ['attack', 'defend', 'special'] as const;
    return moves[Math.floor(Math.random() * 3)];
  };

  const act = async (type: 'attack' | 'defend' | 'special') => {
    if (overRef.current || resolvingRef.current) return;
    setResolving(true);
    resolvingRef.current = true;
    setSwipeHint(false);
    lastMoveRef.current = type;

    const labels: Record<string, string> = {
      attack: 'Kinetic Strike',
      defend: 'Iron Guard',
      special: 'Overload Circuit',
    };

    const botMove = pickBotMove();

    // Animate attack
    setPlayerState('attacking');
    setBotState('attacking');
    await new Promise(r => setTimeout(r, 220));

    let pDmg = 0;
    let bDmg = 0;
    let resultMsg = '';

    if (type === botMove) {
      if (type === 'defend') {
        resultMsg = 'Both guard. No damage.';
        setPlayerState('idle');
        setBotState('idle');
      } else {
        const base = type === 'special' ? 28 : 18;
        pDmg = base; bDmg = base;
        resultMsg = `Clash — both take ${base} dmg.`;
        setScreenFlash(true);
        setTimeout(() => setScreenFlash(false), 300);
        setPlayerState('hit');
        setBotState('hit');
      }
    } else if (
      (type === 'attack' && botMove === 'special') ||
      (type === 'defend' && botMove === 'attack') ||
      (type === 'special' && botMove === 'defend')
    ) {
      bDmg = type === 'special' ? 36 : type === 'attack' ? 24 : 15;
      resultMsg = `Your ${labels[type]} lands. Bot -${bDmg} HP.`;
      setPlayerState('idle');
      setBotState('hit');
    } else {
      pDmg = botMove === 'special' ? 36 : botMove === 'attack' ? 24 : 15;
      resultMsg = `Bot's ${labels[botMove]} connects. You -${pDmg} HP.`;
      setPlayerState('hit');
      setBotState('idle');
    }

    await new Promise(r => setTimeout(r, 320));
    setPlayerState('idle');
    setBotState('idle');

    const newBotHP = Math.max(0, botHP - bDmg);
    const newPlayerHP = Math.max(0, playerHP - pDmg);
    setBotHP(newBotHP);
    setPlayerHP(newPlayerHP);
    setLastLine(resultMsg);
    setLog(prev => [...prev.slice(-9), `R${round}: ${resultMsg}`]);

    const botDead = newBotHP === 0;
    const playerDead = newPlayerHP === 0;
    const isLastRound = round >= 10;

    if (botDead || playerDead || isLastRound) {
      const won = newPlayerHP > newBotHP || botDead;
      await new Promise(r => setTimeout(r, 200));
      setOver(true);
      overRef.current = true;
      setWinner(won ? 'You' : 'Bot');
      setPlayerState(won ? 'victory' : 'defeat');
      setBotState(won ? 'defeat' : 'victory');
      setResolving(false);
      resolvingRef.current = false;
      return;
    }

    setRound(r => r + 1);
    setResolving(false);
    resolvingRef.current = false;
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 40) return;
    if (absDy > absDx && dy < 0) act('special');
    else if (dx > 0) act('attack');
    else act('defend');
    touchStartRef.current = null;
  };

  const reset = () => {
    setPlayerHP(200); setBotHP(200); setRound(1);
    setOver(false); overRef.current = false;
    setWinner('');
    setPlayerState('idle'); setBotState('idle');
    setLog(['New battle initialized. Round 1 begins.']);
    setLastLine(''); setSwipeHint(true);
    setResolving(false); resolvingRef.current = false;
  };

  // ---- MOVE BUTTONS ----
  const MoveButtons = ({ compact = false }: { compact?: boolean }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)',
      gap: compact ? 4 : 8,
    }}>
      {([
        { type: 'attack' as const, icon: 'swords', label: 'ATTACK', hint: 'Swipe right · A', bg: colors.tertiaryContainer },
        { type: 'defend' as const, icon: 'shield', label: 'DEFEND', hint: 'Swipe left · D', bg: '#1e293b' },
        { type: 'special' as const, icon: 'bolt', label: 'SPECIAL', hint: 'Swipe up · S', bg: colors.primaryContainer },
      ]).map(m => (
        <button
          key={m.type}
          onClick={() => act(m.type)}
          disabled={resolving || over}
          style={{
            background: m.bg, color: '#fff', border: 'none',
            borderRadius: 8,
            padding: compact ? '8px 6px' : mobilePortrait ? '18px 12px' : '18px 20px',
            display: 'flex', alignItems: 'center',
            gap: compact ? 6 : 10,
            opacity: resolving || over ? 0.4 : 1,
            cursor: resolving || over ? 'not-allowed' : 'pointer',
            textAlign: 'left' as const,
            transition: 'opacity 0.2s',
            width: '100%',
          }}
        >
          <Icon name={m.icon} size={compact ? 16 : 22} color="#fff" />
          <div>
            <div style={{ fontWeight: 800, fontSize: compact ? 11 : 13, letterSpacing: '0.05em' }}>{m.label}</div>
            {!compact && (
              <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>
                {isMobile ? m.hint.split('·')[0].trim() : m.hint}
              </div>
            )}
          </div>
        </button>
      ))}
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
        <style>{`@keyframes bounceWin{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
        <div style={{
          background: '#fff', border: `1px solid ${colors.outlineVariant}`,
          borderRadius: 16, padding: isMobile ? 24 : 40,
          maxWidth: 400, width: '100%', textAlign: 'center',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
            <WarriorSVG isPlayer state={won ? 'victory' : 'defeat'} size={1.1} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 8px', color: won ? colors.secondary : colors.error }}>
            {won ? 'VICTORY' : 'DEFEAT'}
          </h1>
          <p style={{ color: colors.onSurfaceVariant, marginBottom: 24, fontSize: 14 }}>
            {won ? `Round ${round} — ${playerHP} HP remaining.` : 'The Combat AI was stronger this time.'}
          </p>

          <div style={{
            background: colors.surfaceContainerLow, borderRadius: 10,
            padding: 16, marginBottom: 20,
            display: 'flex', justifyContent: 'space-around',
          }}>
            {[
              { val: round, label: 'ROUNDS' },
              { val: playerHP, label: 'HP LEFT' },
              { val: won ? 'WIN' : 'LOSS', label: 'RESULT' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 24, fontWeight: 800,
                  color: s.label === 'RESULT' ? (won ? colors.secondary : colors.error) : colors.onSurface,
                }}>{s.val}</div>
                <div style={{ fontSize: 11, color: colors.onSurfaceVariant, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {won && (
            <div style={{
              background: colors.surfaceContainerLow, borderRadius: 10,
              padding: 14, marginBottom: 20, textAlign: 'left',
              border: `1px solid ${colors.outlineVariant}`,
            }}>
              <div style={{ fontWeight: 700, color: colors.secondary, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="check_circle" size={16} color={colors.secondary} />
                Match recorded on BOT Chain
              </div>
              <div style={{ color: colors.onSurfaceVariant, fontSize: 12, marginTop: 4 }}>
                Connect wallet to verify on-chain
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={reset} style={{
              background: colors.primaryContainer, color: '#fff', border: 'none',
              borderRadius: 10, padding: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>Fight Again</button>
            <button onClick={() => setPage('leaderboard')} style={{
              background: 'transparent', border: `1px solid ${colors.outlineVariant}`,
              color: colors.onSurface, borderRadius: 10, padding: 14, fontWeight: 600, cursor: 'pointer',
            }}>View Leaderboard</button>
            <button onClick={() => setPage('home')} style={{
              background: 'none', border: 'none', color: colors.primary,
              fontWeight: 600, fontSize: 13, cursor: 'pointer', marginTop: 4,
            }}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // ---- LANDSCAPE MOBILE ----
  if (mobileLandscape) {
    return (
      <div style={{
        background: screenFlash ? colors.surfaceContainerHigh : colors.background,
        height: '100dvh', color: colors.onSurface, fontFamily: 'Inter, sans-serif',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'background 0.15s',
      }}>
        <style>{`@keyframes bounceWin{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

        {/* HUD */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
          background: colors.surfaceContainerLow, borderBottom: `1px solid ${colors.outlineVariant}`,
          flexShrink: 0,
        }}>
          <HPBar hp={playerHP} label="YOU" />
          <div style={{
            background: colors.primaryContainer, color: '#fff',
            padding: '3px 12px', borderRadius: 20,
            fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0,
          }}>R{round}/10</div>
          <HPBar hp={botHP} label="BOT" flipped />
        </div>

        {/* Arena + sidebar */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Swipe arena */}
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{
              flex: 1, display: 'flex', alignItems: 'center',
              justifyContent: 'space-around', padding: '8px 16px',
              background: `linear-gradient(180deg, ${colors.surfaceContainerLow} 0%, ${colors.background} 100%)`,
              userSelect: 'none', position: 'relative',
            }}
          >
            <WarriorSVG isPlayer state={playerState} size={0.9} />
            <div style={{ textAlign: 'center' }}>
              {lastLine
                ? <div style={{ fontSize: 11, color: colors.onSurfaceVariant, fontWeight: 600, maxWidth: 90 }}>{lastLine}</div>
                : swipeHint && <div style={{ fontSize: 10, color: colors.outline, fontStyle: 'italic' }}>swipe to fight</div>
              }
            </div>
            <WarriorSVG isPlayer={false} state={botState} size={0.9} />
          </div>

          {/* Sidebar */}
          <div style={{
            width: 156, borderLeft: `1px solid ${colors.outlineVariant}`,
            display: 'flex', flexDirection: 'column', gap: 6,
            padding: 8, background: colors.surfaceContainerLow, flexShrink: 0,
          }}>
            <div style={{
              background: '#fff', border: `1px solid ${colors.outlineVariant}`,
              borderRadius: 8, padding: '6px 8px', fontSize: 10,
              color: colors.onSurfaceVariant, lineHeight: 1.6,
              flex: 1, overflow: 'hidden',
              fontFamily: 'monospace',
            }}>
              {log.slice(-4).map((l, i) => <div key={i}>{l}</div>)}
            </div>
            <MoveButtons compact />
          </div>
        </div>
      </div>
    );
  }

  // ---- PORTRAIT MOBILE ----
  if (mobilePortrait) {
    return (
      <div style={{
        background: screenFlash ? colors.surfaceContainerHigh : colors.background,
        height: '100dvh', color: colors.onSurface, fontFamily: 'Inter, sans-serif',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'background 0.15s',
      }}>
        <style>{`@keyframes bounceWin{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

        {/* HUD */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
          background: colors.surfaceContainerLow, borderBottom: `1px solid ${colors.outlineVariant}`,
          flexShrink: 0,
        }}>
          <HPBar hp={playerHP} label="YOU" />
          <div style={{
            background: colors.primaryContainer, color: '#fff',
            padding: '4px 12px', borderRadius: 20,
            fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0,
          }}>R{round}/10</div>
          <HPBar hp={botHP} label="BOT" flipped />
        </div>

        {/* Swipe arena */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            flex: 1, display: 'flex', alignItems: 'center',
            justifyContent: 'space-around', padding: '20px 16px',
            background: `linear-gradient(180deg, ${colors.surfaceContainerLow} 0%, ${colors.background} 100%)`,
            userSelect: 'none', position: 'relative',
          }}
        >
          <WarriorSVG isPlayer state={playerState} size={1.1} />

          <div style={{ textAlign: 'center' }}>
            {lastLine
              ? <div style={{ fontSize: 12, color: colors.onSurfaceVariant, fontWeight: 600, maxWidth: 80, lineHeight: 1.4 }}>{lastLine}</div>
              : <div style={{ fontSize: 13, color: colors.outline, fontStyle: 'italic' }}>vs</div>
            }
          </div>

          <WarriorSVG isPlayer={false} state={botState} size={1.1} />

          {/* Swipe hint */}
          {swipeHint && (
            <div style={{
              position: 'absolute', bottom: 12, left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.05)', borderRadius: 20,
              padding: '6px 16px', fontSize: 11,
              color: colors.onSurfaceVariant, fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              Swipe right · left · up to fight
            </div>
          )}
        </div>

        {/* Last log line */}
        <div style={{
          padding: '8px 16px', background: colors.surfaceContainerLow,
          borderTop: `1px solid ${colors.outlineVariant}`,
          fontSize: 12, color: colors.onSurfaceVariant,
          fontFamily: 'monospace', flexShrink: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {log[log.length - 1]}
        </div>

        {/* Buttons */}
        <div style={{
          padding: '10px 16px 20px', background: colors.background,
          borderTop: `1px solid ${colors.outlineVariant}`, flexShrink: 0,
        }}>
          <MoveButtons />
        </div>
      </div>
    );
  }

  // ---- DESKTOP ----
  return (
    <div style={{
      background: screenFlash ? colors.surfaceContainerHigh : colors.background,
      height: '100vh', color: colors.onSurface, fontFamily: 'Inter, sans-serif',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      transition: 'background 0.15s',
    }}>
      <style>{`@keyframes bounceWin{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      {/* Top HUD */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '12px 32px',
        background: colors.surfaceContainerLow, borderBottom: `1px solid ${colors.outlineVariant}`,
        flexShrink: 0,
      }}>
        <span onClick={() => setPage('home')} style={{
          fontWeight: 800, color: colors.primary, cursor: 'pointer', fontSize: 16, flexShrink: 0,
        }}>BotBattle</span>
        <HPBar hp={playerHP} label="YOU" />
        <div style={{
          background: colors.primaryContainer, color: '#fff',
          padding: '6px 20px', borderRadius: 20,
          fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', flexShrink: 0,
        }}>ROUND {round} / 10</div>
        <HPBar hp={botHP} label="BOT AI" flipped />
        <span style={{ fontSize: 12, color: colors.secondary, fontWeight: 600, flexShrink: 0 }}>● BOT Chain</span>
      </div>

      {/* Arena */}
      <div style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 260px 1fr', overflow: 'hidden',
        background: `linear-gradient(180deg, ${colors.surfaceContainerLow} 0%, ${colors.background} 70%)`,
      }}>

        {/* Player */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          padding: '24px 24px 32px',
          borderRight: `1px solid ${colors.outlineVariant}`,
        }}>
          <WarriorSVG isPlayer state={playerState} size={1.3} />
          <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: '0.1em' }}>YOU</div>
          <div style={{ marginTop: 4, fontSize: 11, color: colors.outline }}>A · D · S keys</div>
        </div>

        {/* Battle log center */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 16, borderRight: `1px solid ${colors.outlineVariant}`,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            color: colors.onSurfaceVariant, marginBottom: 8, textAlign: 'center',
          }}>BATTLE LOG</div>
          <div style={{
            background: '#fff', border: `1px solid ${colors.outlineVariant}`,
            borderRadius: 10, padding: '10px 12px',
            fontFamily: 'monospace', fontSize: 12,
            overflowY: 'auto', maxHeight: 260,
          }}>
            {log.slice(-6).map((l, i) => (
              <div key={i} style={{
                padding: '4px 0',
                borderBottom: `1px solid ${colors.outlineVariant}`,
                color: l.includes('lands') || l.includes('Victory') ? colors.secondary
                  : l.includes('connects') || l.includes('Defeat') ? colors.error
                  : colors.onSurfaceVariant,
                lineHeight: 1.5,
              }}>{l}</div>
            ))}
          </div>
        </div>

        {/* Bot */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          padding: '24px 24px 32px',
        }}>
          <WarriorSVG isPlayer={false} state={botState} size={1.3} />
          <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: '0.1em' }}>COMBAT AI</div>
        </div>
      </div>

      {/* Move buttons */}
      <div style={{
        padding: '14px 32px 20px', flexShrink: 0,
        background: colors.surfaceContainerLow,
        borderTop: `1px solid ${colors.outlineVariant}`,
      }}>
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
        background: colors.surfaceContainerLow,
      }}>
        <span onClick={() => setPage('home')} style={{ fontSize: 20, fontWeight: 800, color: colors.primary, cursor: 'pointer' }}>BotBattle</span>
        <button onClick={() => setPage('battle')} style={{
          background: colors.primaryContainer, color: '#fff', border: 'none',
          borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer',
        }}>Enter Arena</button>
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
        background: colors.surfaceContainerLow,
      }}>
        <span onClick={() => setPage('home')} style={{ fontSize: 20, fontWeight: 800, color: colors.primary, cursor: 'pointer' }}>BotBattle</span>
        <button onClick={() => setPage('battle')} style={{
          background: colors.primaryContainer, color: '#fff', border: 'none',
          borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer',
        }}>Enter Arena</button>
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