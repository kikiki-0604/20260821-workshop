import type { Player } from '../types';

interface ColorSelectorProps {
  value: Player;
  onChange: (color: Player) => void;
}

export function ColorSelector({ value, onChange }: ColorSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(['black', 'white'] as const).map((color) => {
        const active = value === color;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`flex items-center justify-center gap-2.5 rounded-full border-4 px-4 py-3 text-base font-extrabold transition active:scale-95 sm:py-4 sm:text-lg ${
              active
                ? 'border-fuchsia-400 bg-gradient-to-r from-fuchsia-100 to-pink-100 text-fuchsia-700 shadow-md dark:from-fuchsia-500/20 dark:to-pink-500/20 dark:text-fuchsia-200'
                : 'border-slate-200 bg-white text-slate-600 hover:border-fuchsia-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full shadow-inner sm:h-7 sm:w-7 ${
                color === 'black'
                  ? 'bg-gradient-to-br from-slate-600 to-black'
                  : 'bg-gradient-to-br from-white to-slate-300 ring-1 ring-slate-300'
              }`}
            />
            <span>{color === 'black' ? '黒' : '白'}</span>
          </button>
        );
      })}
    </div>
  );
}
