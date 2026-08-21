import { motion } from 'framer-motion';
import { Confetti } from './Confetti';
import { playerLabel } from '../logic/labels';
import type { GameMode, GameResult, Player, PlayerNames } from '../types';

interface ResultModalProps {
  winner: GameResult;
  blackCount: number;
  whiteCount: number;
  mode: GameMode;
  names: PlayerNames;
  humanColor: Player;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export function ResultModal({
  winner,
  blackCount,
  whiteCount,
  mode,
  names,
  humanColor,
  onRestart,
  onBackToMenu,
}: ResultModalProps) {
  let headline: string;
  let sub: string;

  if (winner === 'draw') {
    headline = '引き分け';
    sub = `${blackCount} - ${whiteCount} の互角の戦いでした`;
  } else if (mode === 'cpu') {
    const humanWon = winner === humanColor;
    headline = humanWon ? 'あなたの勝ち！' : 'あなたの負け...';
    sub = humanWon ? 'お見事な采配でした 🎉' : 'AIに軍配が上がりました。次こそは！';
  } else {
    const label = winner ? playerLabel(winner, mode, names) : '';
    headline = `${label}の勝ち！`;
    sub = `${blackCount} - ${whiteCount} で決着`;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {winner !== 'draw' && <Confetti />}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl ring-1 ring-fuchsia-200/60 dark:bg-indigo-950 dark:ring-fuchsia-500/20"
      >
        <div className="mb-2 text-4xl">{winner === 'draw' ? '🤝' : '🏆'}</div>
        <h2 className="mb-1 text-2xl font-extrabold text-slate-900 dark:text-white">{headline}</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">{sub}</p>

        <div className="mb-6 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-600 to-black shadow" />
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{blackCount}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-500">-</span>
          <div className="flex flex-col items-center gap-1">
            <span className="h-7 w-7 rounded-full bg-gradient-to-br from-white to-slate-300 shadow ring-1 ring-slate-300" />
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{whiteCount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 px-4 py-2.5 font-semibold text-white shadow shadow-fuchsia-500/30 transition hover:brightness-110 active:scale-95"
          >
            もう一度対局する
          </button>
          <button
            type="button"
            onClick={onBackToMenu}
            className="flex-1 rounded-full bg-slate-200 px-4 py-2.5 font-semibold text-slate-700 shadow transition hover:bg-slate-300 active:scale-95 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            モード選択に戻る
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
