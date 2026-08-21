import type { Difficulty } from '../types';

interface DifficultyOption {
  value: Difficulty;
  label: string;
  desc: string;
}

const OPTIONS: DifficultyOption[] = [
  { value: 'easy', label: 'かんたん', desc: 'オセロを始めたばかりの方向け' },
  { value: 'normal', label: 'ふつう', desc: 'ちょうどいい歯ごたえ' },
  { value: 'hard', label: 'つよい', desc: '先読みと定石を駆使' },
  { value: 'extreme', label: '激つよ', desc: '終盤は完全読み切り' },
];

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  compact?: boolean;
}

export function DifficultySelector({ value, onChange, compact = false }: DifficultySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-lg border-2 px-3 py-2 text-left transition active:scale-95 ${
              active
                ? 'border-fuchsia-500 bg-fuchsia-50 shadow-sm dark:bg-fuchsia-500/15'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500'
            }`}
          >
            <div className="font-bold text-slate-800 dark:text-slate-100">{option.label}</div>
            {!compact && (
              <div className="text-xs text-slate-500 dark:text-slate-400">{option.desc}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
