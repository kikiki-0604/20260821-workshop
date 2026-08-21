import { motion } from 'framer-motion';
import { Disc } from './Disc';
import type { CellValue, Player } from '../types';

interface CellProps {
  value: CellValue;
  isLegal: boolean;
  isLastMove: boolean;
  interactive: boolean;
  currentPlayer: Player;
  onClick: () => void;
}

export function Cell({ value, isLegal, isLastMove, interactive, currentPlayer, onClick }: CellProps) {
  const clickable = interactive && isLegal;

  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      aria-label={value ? `${value === 'black' ? '黒' : '白'}の石` : clickable ? '着手可能' : 'マス'}
      className={`board-cell relative aspect-square w-full ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {isLegal && interactive && (
        <motion.span
          className={`pointer-events-none absolute inset-[32%] rounded-full ${
            currentPlayer === 'black' ? 'bg-black/25 dark:bg-white/20' : 'bg-white/50 dark:bg-white/30'
          }`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.25, opacity: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        />
      )}

      <Disc value={value} />

      {isLastMove && value && (
        <motion.span
          className="pointer-events-none absolute inset-[38%] rounded-full ring-2 ring-amber-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.9, 0.3, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </button>
  );
}
