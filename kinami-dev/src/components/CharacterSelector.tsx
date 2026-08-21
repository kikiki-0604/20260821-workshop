import { CHARACTERS, CHARACTER_IDS } from '../characters/characters';
import { CharacterAvatar } from '../characters/avatars';
import type { CharacterId } from '../types';

interface CharacterSelectorProps {
  value: CharacterId;
  onChange: (id: CharacterId) => void;
}

export function CharacterSelector({ value, onChange }: CharacterSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CHARACTER_IDS.map((id) => {
        const active = id === value;
        const def = CHARACTERS[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition active:scale-95 ${
              active
                ? 'border-fuchsia-500 bg-fuchsia-50 shadow-sm dark:bg-fuchsia-500/15'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500'
            }`}
          >
            <CharacterAvatar id={id} size={48} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{def.name}</span>
          </button>
        );
      })}
    </div>
  );
}
