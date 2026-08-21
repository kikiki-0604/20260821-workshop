import type { Player } from '../types';

interface ColorSelectorProps {
  value: Player;
  onChange: (color: Player) => void;
}

export function ColorSelector({ value, onChange }: ColorSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(['black', 'white'] as const).map((color) => {
        const active = value === color;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 font-bold transition active:scale-95 ${
              active
                ? 'border-emerald-500 bg-emerald-50 shadow-sm dark:bg-emerald-500/10'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full shadow-inner ${
                color === 'black'
                  ? 'bg-gradient-to-br from-slate-600 to-black'
                  : 'bg-gradient-to-br from-white to-slate-300 ring-1 ring-slate-300'
              }`}
            />
            <span className="text-slate-800 dark:text-slate-100">{color === 'black' ? '黒' : '白'}</span>
          </button>
        );
      })}
    </div>
  );
}
