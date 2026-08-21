import { motion } from 'framer-motion';
import { playerLabel } from '../logic/labels';
import type { GameMode, Player, PlayerNames } from '../types';

interface PassNoticeProps {
  player: Player;
  mode: GameMode;
  names: PlayerNames;
}

export function PassNotice({ player, mode, names }: PassNoticeProps) {
  const label = playerLabel(player, mode, names);
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="mx-auto mb-4 w-full max-w-[560px] rounded-xl bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-900 shadow dark:bg-amber-500/20 dark:text-amber-200"
    >
      {label}は置ける場所がないためパスします
    </motion.div>
  );
}
