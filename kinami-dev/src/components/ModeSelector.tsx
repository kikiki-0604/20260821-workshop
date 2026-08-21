import { useState } from 'react';
import { motion } from 'framer-motion';
import { CHARACTER_IDS } from '../characters/characters';
import { CharacterSelector } from './CharacterSelector';
import { ColorSelector } from './ColorSelector';
import { DifficultySelector } from './DifficultySelector';
import { pickRandom } from '../utils/random';
import type { CharacterAssignment, CharacterId, Difficulty, GameConfig, GameMode, Player } from '../types';

interface ModeSelectorProps {
  onStart: (config: GameConfig) => void;
}

function randomCharacterExcluding(exclude: CharacterId): CharacterId {
  return pickRandom(CHARACTER_IDS.filter((id) => id !== exclude));
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-base font-extrabold text-slate-700 sm:text-lg dark:text-slate-200">{children}</p>
  );
}

export function ModeSelector({ onStart }: ModeSelectorProps) {
  const [mode, setMode] = useState<GameMode>('cpu');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [humanColor, setHumanColor] = useState<Player>('black');
  const [blackName, setBlackName] = useState('');
  const [whiteName, setWhiteName] = useState('');
  const [playerCharacter, setPlayerCharacter] = useState<CharacterId>('cat');
  const [blackCharacter, setBlackCharacter] = useState<CharacterId>('cat');
  const [whiteCharacter, setWhiteCharacter] = useState<CharacterId>('dog');

  const handleStart = () => {
    const characters: CharacterAssignment =
      mode === 'cpu'
        ? { mode: 'cpu', human: playerCharacter, ai: randomCharacterExcluding(playerCharacter) }
        : { mode: 'pvp', black: blackCharacter, white: whiteCharacter };

    onStart({
      mode,
      difficulty,
      humanColor,
      names: {
        black: blackName.trim() || '黒',
        white: whiteName.trim() || '白',
      },
      characters,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-xl rounded-[2.5rem] bg-white/90 p-5 shadow-2xl ring-4 ring-white/70 backdrop-blur sm:p-9 dark:bg-indigo-950/75 dark:ring-fuchsia-500/20"
    >
      <div className="mb-7 grid grid-cols-2 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setMode('cpu')}
          className={`flex flex-col items-center gap-2 rounded-3xl border-4 px-3 py-5 text-center font-extrabold transition active:scale-95 sm:py-6 ${
            mode === 'cpu'
              ? 'border-pink-400 bg-gradient-to-b from-pink-200 to-fuchsia-200 text-fuchsia-800 shadow-lg dark:from-pink-500/25 dark:to-fuchsia-500/25 dark:text-fuchsia-200'
              : 'border-slate-200 bg-white text-slate-500 hover:border-pink-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          <span className="text-3xl sm:text-4xl">🖥️</span>
          <span className="text-sm sm:text-base">VS コンピュータ</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('pvp')}
          className={`flex flex-col items-center gap-2 rounded-3xl border-4 px-3 py-5 text-center font-extrabold transition active:scale-95 sm:py-6 ${
            mode === 'pvp'
              ? 'border-teal-400 bg-gradient-to-b from-teal-200 to-cyan-200 text-teal-800 shadow-lg dark:from-teal-500/25 dark:to-cyan-500/25 dark:text-teal-200'
              : 'border-slate-200 bg-white text-slate-500 hover:border-teal-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          <span className="text-3xl sm:text-4xl">🧑‍🤝‍🧑</span>
          <span className="text-sm sm:text-base">二人対戦</span>
        </button>
      </div>

      {mode === 'cpu' ? (
        <div className="space-y-6 sm:space-y-8">
          <div>
            <SectionLabel>あなたのキャラクター</SectionLabel>
            <CharacterSelector value={playerCharacter} onChange={setPlayerCharacter} />
          </div>
          <div>
            <SectionLabel>あなたの石の色</SectionLabel>
            <ColorSelector value={humanColor} onChange={setHumanColor} />
          </div>
          <div>
            <SectionLabel>難易度</SectionLabel>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
          </div>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          <div>
            <SectionLabel>黒プレイヤーのキャラクター</SectionLabel>
            <CharacterSelector value={blackCharacter} onChange={setBlackCharacter} />
          </div>
          <div>
            <SectionLabel>白プレイヤーのキャラクター</SectionLabel>
            <CharacterSelector value={whiteCharacter} onChange={setWhiteCharacter} />
          </div>
          <div className="space-y-3">
            <SectionLabel>プレイヤー名（任意）</SectionLabel>
            <div className="flex items-center gap-2">
              <span className="inline-block h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-slate-600 to-black" />
              <input
                type="text"
                value={blackName}
                onChange={(e) => setBlackName(e.target.value)}
                placeholder="黒"
                maxLength={12}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-base text-slate-800 outline-none focus:border-fuchsia-400 sm:py-3 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-white to-slate-300 ring-1 ring-slate-300" />
              <input
                type="text"
                value={whiteName}
                onChange={(e) => setWhiteName(e.target.value)}
                placeholder="白"
                maxLength={12}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-base text-slate-800 outline-none focus:border-fuchsia-400 sm:py-3 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleStart}
        className="pop-button relative mt-8 w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 px-6 py-4 text-xl font-black text-white transition hover:brightness-110 active:scale-[0.98] sm:py-5 sm:text-2xl"
      >
        ゲームをはじめる！
        <span className="absolute -right-2 -top-3 text-3xl drop-shadow sm:-right-3 sm:-top-4 sm:text-4xl">💖</span>
      </button>
    </motion.div>
  );
}
