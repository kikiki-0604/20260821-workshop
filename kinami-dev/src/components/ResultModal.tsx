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
        className="w-full max-w-md rounded-[2.5rem] bg-white p-6 text-center shadow-2xl ring-4 ring-white/70 sm:p-9 dark:bg-indigo-950 dark:ring-fuchsia-500/20"
      >
        <div className="mb-2 text-5xl sm:text-6xl">{winner === 'draw' ? '🤝' : '🏆'}</div>
        <h2 className="mb-1 text-3xl font-black text-slate-900 sm:text-4xl dark:text-white">{headline}</h2>
        <p className="mb-5 text-sm font-bold text-slate-500 sm:text-base dark:text-slate-300">{sub}</p>

        <div className="mb-7 flex items-center justify-center gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-1.5">
            <span className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-600 to-black shadow sm:h-11 sm:w-11" />
            <span className="text-2xl font-black text-slate-800 sm:text-3xl dark:text-slate-100">{blackCount}</span>
          </div>
          <span className="text-xl text-slate-300 sm:text-2xl dark:text-slate-500">-</span>
          <div className="flex flex-col items-center gap-1.5">
            <span className="h-9 w-9 rounded-full bg-gradient-to-br from-white to-slate-300 shadow ring-1 ring-slate-300 sm:h-11 sm:w-11" />
            <span className="text-2xl font-black text-slate-800 sm:text-3xl dark:text-slate-100">{whiteCount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRestart}
            className="pop-button flex-1 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 px-4 py-3 text-base font-extrabold text-white transition hover:brightness-110 active:scale-95 sm:text-lg"
          >
            もう一度対局する
          </button>
          <button
            type="button"
            onClick={onBackToMenu}
            className="flex-1 rounded-full bg-slate-200 px-4 py-3 text-base font-extrabold text-slate-700 shadow transition hover:bg-slate-300 active:scale-95 sm:text-lg dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            モード選択に戻る
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
