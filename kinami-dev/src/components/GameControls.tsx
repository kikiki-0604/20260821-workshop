import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ColorSelector } from './ColorSelector';
import { DifficultySelector } from './DifficultySelector';
import type { Difficulty, GameMode, Player } from '../types';

interface GameControlsProps {
  mode: GameMode;
  canUndo: boolean;
  onUndo: () => void;
  onRestart: () => void;
  onBackToMenu: () => void;
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  humanColor: Player;
  onChangeColor: (color: Player) => void;
}

function PopoverButton({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow transition hover:bg-fuchsia-50 active:scale-95 dark:bg-indigo-900/70 dark:text-slate-100 dark:hover:bg-indigo-900"
      >
        <span>{icon}</span>
        <span className="hidden sm:inline">{label}</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-20 mt-2 w-64 rounded-xl bg-white p-3 shadow-xl ring-1 ring-fuchsia-200/60 dark:bg-indigo-950 dark:ring-fuchsia-500/20"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GameControls({
  mode,
  canUndo,
  onUndo,
  onRestart,
  onBackToMenu,
  difficulty,
  onChangeDifficulty,
  humanColor,
  onChangeColor,
}: GameControlsProps) {
  return (
    <div className="mx-auto mt-5 flex w-full max-w-[560px] flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow transition hover:bg-fuchsia-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-indigo-900/70 dark:text-slate-100 dark:hover:bg-indigo-900"
      >
        <span>↩️</span>
        <span className="hidden sm:inline">待った</span>
      </button>

      <button
        type="button"
        onClick={onRestart}
        className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow transition hover:bg-fuchsia-50 active:scale-95 dark:bg-indigo-900/70 dark:text-slate-100 dark:hover:bg-indigo-900"
      >
        <span>🔄</span>
        <span className="hidden sm:inline">新規対局</span>
      </button>

      <button
        type="button"
        onClick={onBackToMenu}
        className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow transition hover:bg-fuchsia-50 active:scale-95 dark:bg-indigo-900/70 dark:text-slate-100 dark:hover:bg-indigo-900"
      >
        <span>⬅️</span>
        <span className="hidden sm:inline">モード選択に戻る</span>
      </button>

      {mode === 'cpu' && (
        <>
          <PopoverButton label="難易度変更" icon="⚙️">
            <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">難易度を選ぶ</p>
            <DifficultySelector value={difficulty} onChange={onChangeDifficulty} compact />
          </PopoverButton>

          <PopoverButton label="石の色選択" icon="🎨">
            <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">あなたの石</p>
            <p className="mb-2 text-[11px] text-slate-400 dark:text-slate-500">
              変更すると新しい対局を開始します
            </p>
            <ColorSelector value={humanColor} onChange={onChangeColor} />
          </PopoverButton>
        </>
      )}
    </div>
  );
}
