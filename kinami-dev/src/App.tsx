import { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-100 px-4 py-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-10">
      <div className="mx-auto flex w-full max-w-[560px] items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 sm:text-2xl">
            Reversi Arena
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">本格オセロ対戦</p>
        </div>
        <div className="flex items-center gap-2">
          <BgmToggle enabled={bgm.enabled} onToggle={bgm.toggle} />
          {voice.supported && <VoiceToggle enabled={voice.enabled} onToggle={voice.toggle} />}
          <DarkModeToggle isDark={isDark} onToggle={toggle} />
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        {config ? (
          <GameScreen key={gameKey} config={config} onBackToMenu={handleBackToMenu} voice={voice} />
        ) : (
          <ModeSelector onStart={handleStart} />
        )}
      </div>
    </div>
  );
}
