import { motion } from 'framer-motion';

interface SpeechBubbleProps {
  text: string;
}

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.85 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-none absolute -top-2 left-1/2 z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-2xl border-2 border-fuchsia-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 shadow-lg sm:px-4 sm:text-base dark:border-fuchsia-500/30 dark:bg-slate-700 dark:text-slate-100"
    >
      {text}
      <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 border-b-2 border-r-2 border-fuchsia-200 bg-white dark:border-fuchsia-500/30 dark:bg-slate-700" />
    </motion.div>
  );
}
