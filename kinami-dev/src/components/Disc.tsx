import { AnimatePresence, motion } from 'framer-motion';
import type { Player } from '../types';

interface DiscProps {
  value: Player | null;
}

export function Disc({ value }: DiscProps) {
  return (
    <div className="disc-perspective absolute inset-[10%]">
      <AnimatePresence>
        {value && (
          <motion.div
            key="disc"
            className="disc-container"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotateY: value === 'black' ? 0 : 180 }}
            exit={{ scale: 0 }}
            transition={{
              scale: { type: 'spring', stiffness: 320, damping: 22 },
              rotateY: { duration: 0.5, ease: 'easeInOut' },
            }}
          >
            <div className="disc-face disc-face-black" />
            <div className="disc-face disc-face-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
