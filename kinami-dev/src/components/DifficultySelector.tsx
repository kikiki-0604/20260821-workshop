import type { Difficulty } from '../types';

interface DifficultyOption {
  value: Difficulty;
  label: string;
  desc: string;
  icon: string;
}

const OPTIONS: DifficultyOption[] = [
  { value: 'easy', label: 'かんたん', desc: 'オセロを始めたばかりの方向け', icon: '⭐' },
  { value: 'normal', label: 'ふつう', desc: 'ちょうどいい歯ごたえ', icon: '💗' },
  { value: 'hard', label: 'つよい', desc: '先読みと定石を駆使', icon: '⚡' },
  { value: 'extreme', label: '激つよ', desc: '終盤は完全読み切り', icon: '👑' },
];

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  compact?: boolean;
}

export function DifficultySelector({ value, onChange, compact = false }: DifficultySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2.5 rounded-2xl border-4 px-3 py-3 text-left transition active:scale-95 sm:gap-3 sm:px-4 sm:py-4 ${
              active
                ? 'border-fuchsia-400 bg-gradient-to-br from-fuchsia-100 to-pink-100 shadow-md dark:from-fuchsia-500/20 dark:to-pink-500/20'
                : 'border-slate-200 bg-white hover:border-fuchsia-200 dark:border-slate-600 dark:bg-slate-800'
            }`}
          >
            <span className="text-2xl sm:text-3xl">{option.icon}</span>
            <span>
              <span className="block text-sm font-extrabold text-slate-800 sm:text-base dark:text-slate-100">
                {option.label}
              </span>
              {!compact && (
                <span className="block text-xs text-slate-500 dark:text-slate-400">{option.desc}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
