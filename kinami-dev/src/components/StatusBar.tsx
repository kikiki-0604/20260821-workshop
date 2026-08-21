import { AnimatePresence, motion } from 'framer-motion';
import { playerLabel } from '../logic/labels';
import type { GameMode, Player, PlayerNames } from '../types';

interface StatusBarProps {
  currentPlayer: Player;
  isThinking: boolean;
  blackCount: number;
  whiteCount: number;
  mode: GameMode;
  names: PlayerNames;
  humanColor: Player;
}

function ScoreChip({ player, count, active }: { player: Player; count: number; active: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all sm:px-4 ${
        active
          ? 'bg-white shadow-md ring-2 ring-amber-400 dark:bg-slate-800'
          : 'bg-white/60 dark:bg-slate-800/60'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full shadow-inner ${
          player === 'black'
            ? 'bg-gradient-to-br from-slate-600 to-black'
            : 'bg-gradient-to-br from-white to-slate-300 ring-1 ring-slate-300'
        }`}
      />
      <span className="text-lg font-bold tabular-nums text-slate-800 dark:text-slate-100">{count}</span>
    </div>
  );
}

export function StatusBar({
  currentPlayer,
  isThinking,
  blackCount,
  whiteCount,
  mode,
  names,
  humanColor,
}: StatusBarProps) {
  const label = playerLabel(currentPlayer, mode, names);

  let banner: string;
  if (mode === 'cpu') {
    if (currentPlayer === humanColor) {
      banner = 'あなたの番です';
    } else {
      banner = isThinking ? 'AIが考え中...' : 'AIの番です';
    }
  } else {
    banner = `${label}の番です`;
  }

  return (
    <div className="mx-auto mb-4 flex w-full max-w-[560px] items-center justify-between gap-2 sm:mb-6">
      <ScoreChip player="black" count={blackCount} active={currentPlayer === 'black'} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPlayer}-${isThinking}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2 text-center text-sm font-bold shadow-md sm:text-base ${
            currentPlayer === 'black'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-900 ring-1 ring-slate-300'
          }`}
        >
          {isThinking && (
            <span className="inline-block h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          <span className="truncate">{banner}</span>
        </motion.div>
      </AnimatePresence>

      <ScoreChip player="white" count={whiteCount} active={currentPlayer === 'white'} />
    </div>
  );
}
