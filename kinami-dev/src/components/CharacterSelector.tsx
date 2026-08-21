import { CHARACTERS, CHARACTER_IDS } from '../characters/characters';
import { CharacterAvatar } from '../characters/avatars';
import type { CharacterId } from '../types';

interface CharacterSelectorProps {
  value: CharacterId;
  onChange: (id: CharacterId) => void;
}

export function CharacterSelector({ value, onChange }: CharacterSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {CHARACTER_IDS.map((id) => {
        const active = id === value;
        const def = CHARACTERS[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className="group flex flex-col items-center gap-1.5 rounded-2xl p-1 transition active:scale-95 sm:gap-2 sm:p-2"
          >
            <span className="relative">
              <CharacterAvatar
                id={id}
                className={`h-16 w-16 transition sm:h-24 sm:w-24 lg:h-28 lg:w-28 ${
                  active
                    ? 'scale-105 shadow-xl shadow-fuchsia-400/50'
                    : 'opacity-80 grayscale-[15%] group-hover:opacity-100 group-hover:grayscale-0'
                }`}
                ringClassName={
                  active
                    ? 'ring-4 sm:ring-[6px] ring-fuchsia-400 dark:ring-fuchsia-400'
                    : 'ring-4 sm:ring-[6px] ring-white/90 dark:ring-slate-700'
                }
              />
              {active && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500 text-xs text-white shadow-md ring-2 ring-white sm:h-8 sm:w-8 sm:text-sm dark:ring-slate-900">
                  ✓
                </span>
              )}
            </span>
            <span
              className={`text-xs font-bold sm:text-base ${
                active ? 'text-fuchsia-600 dark:text-fuchsia-300' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {def.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
