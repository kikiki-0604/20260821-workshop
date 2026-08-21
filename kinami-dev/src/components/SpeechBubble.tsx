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
      className="pointer-events-none absolute -top-2 left-1/2 z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-2xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-lg dark:bg-slate-700 dark:text-slate-100"
    >
      {text}
      <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1.5 rotate-45 bg-white dark:bg-slate-700" />
    </motion.div>
  );
}
