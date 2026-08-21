import { useState } from 'react';
import { BackgroundDecor } from './components/BackgroundDecor';
import { BgmToggle } from './components/BgmToggle';
import { DarkModeToggle } from './components/DarkModeToggle';
import { GameScreen } from './components/GameScreen';
import { ModeSelector } from './components/ModeSelector';
import { VoiceToggle } from './components/VoiceToggle';
import { useBgm } from './hooks/useBgm';
import { useDarkMode } from './hooks/useDarkMode';
import { useVoice } from './hooks/useVoice';
import type { GameConfig } from './types';

export default function App() {
  const { isDark, toggle } = useDarkMode();
  const bgm = useBgm();
  const voice = useVoice();
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = (newConfig: GameConfig) => {
    setConfig(newConfig);
    setGameKey((k) => k + 1);
    bgm.ensureStarted();
  };

  const handleBackToMenu = () => setConfig(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ffd6ec_0%,#e0c3fc_28%,#c3e9fc_55%,#e0c3fc_80%,#fff3c4_100%)] px-4 py-6 dark:bg-[linear-gradient(135deg,#3b0764_0%,#312e81_35%,#1e1b4b_70%,#4c1d95_100%)] sm:py-10">
      <BackgroundDecor />

      <div className="relative z-10 mx-auto flex w-full max-w-[760px] items-center justify-between">
        <div>
          <h1 className="kawaii-outline -rotate-2 font-pop text-3xl leading-none text-transparent sm:text-5xl">
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 bg-clip-text">
              Reversi Arena
            </span>
          </h1>
          <p className="mt-1.5 inline-block rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-fuchsia-600 shadow sm:text-sm dark:bg-slate-900/60 dark:text-fuchsia-300">
            本格オセロ対戦
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <BgmToggle enabled={bgm.enabled} onToggle={bgm.toggle} />
          {voice.supported && <VoiceToggle enabled={voice.enabled} onToggle={voice.toggle} />}
          <DarkModeToggle isDark={isDark} onToggle={toggle} />
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mt-10">
        {config ? (
          <GameScreen key={gameKey} config={config} onBackToMenu={handleBackToMenu} voice={voice} />
        ) : (
          <ModeSelector onStart={handleStart} />
        )}
      </div>
    </div>
  );
}
