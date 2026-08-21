import { useState } from 'react';
import { motion } from 'framer-motion';
import { CHARACTER_IDS } from '../characters/characters';
import { CharacterSelector } from './CharacterSelector';
import { ColorSelector } from './ColorSelector';
import { DifficultySelector } from './DifficultySelector';
import { pickRandom } from '../utils/random';
import type { CharacterId, Difficulty, GameConfig, GameMode, Player, PlayerCharacters } from '../types';

interface ModeSelectorProps {
  onStart: (config: GameConfig) => void;
}

function randomCharacterExcluding(exclude: CharacterId): CharacterId {
  return pickRandom(CHARACTER_IDS.filter((id) => id !== exclude));
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
    let characters: PlayerCharacters;
    if (mode === 'cpu') {
      const aiCharacter = randomCharacterExcluding(playerCharacter);
      characters =
        humanColor === 'black'
          ? { black: playerCharacter, white: aiCharacter }
          : { black: aiCharacter, white: playerCharacter };
    } else {
      characters = { black: blackCharacter, white: whiteCharacter };
    }

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
      className="mx-auto w-full max-w-md rounded-2xl bg-white/90 p-5 shadow-xl backdrop-blur sm:p-7 dark:bg-slate-800/90"
    >
      <div className="mb-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode('cpu')}
          className={`rounded-xl border-2 px-3 py-4 text-center font-bold transition active:scale-95 ${
            mode === 'cpu'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:text-slate-300'
          }`}
        >
          <div className="mb-1 text-2xl">🖥️</div>
          VS コンピュータ
        </button>
        <button
          type="button"
          onClick={() => setMode('pvp')}
          className={`rounded-xl border-2 px-3 py-4 text-center font-bold transition active:scale-95 ${
            mode === 'pvp'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:text-slate-300'
          }`}
        >
          <div className="mb-1 text-2xl">🧑‍🤝‍🧑</div>
          二人対戦
        </button>
      </div>

      {mode === 'cpu' ? (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">あなたのキャラクター</p>
            <CharacterSelector value={playerCharacter} onChange={setPlayerCharacter} />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">あなたの石の色</p>
            <ColorSelector value={humanColor} onChange={setHumanColor} />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">難易度</p>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">黒プレイヤーのキャラクター</p>
            <CharacterSelector value={blackCharacter} onChange={setBlackCharacter} />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">白プレイヤーのキャラクター</p>
            <CharacterSelector value={whiteCharacter} onChange={setWhiteCharacter} />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">プレイヤー名（任意）</p>
            <div className="flex items-center gap-2">
              <span className="inline-block h-5 w-5 flex-shrink-0 rounded-full bg-gradient-to-br from-slate-600 to-black" />
              <input
                type="text"
                value={blackName}
                onChange={(e) => setBlackName(e.target.value)}
                placeholder="黒"
                maxLength={12}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-5 w-5 flex-shrink-0 rounded-full bg-gradient-to-br from-white to-slate-300 ring-1 ring-slate-300" />
              <input
                type="text"
                value={whiteName}
                onChange={(e) => setWhiteName(e.target.value)}
                placeholder="白"
                maxLength={12}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleStart}
        className="mt-7 w-full rounded-xl bg-emerald-600 px-4 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
      >
        ゲームをはじめる
      </button>
    </motion.div>
  );
}
