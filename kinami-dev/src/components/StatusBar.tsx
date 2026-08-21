import { AnimatePresence, motion } from 'framer-motion';
import { CHARACTERS } from '../characters/characters';
import { CharacterAvatar } from '../characters/avatars';
import { playerLabel } from '../logic/labels';
import { SpeechBubble } from './SpeechBubble';
import type { GameMode, Player, PlayerCharacters, PlayerNames } from '../types';

interface StatusBarProps {
  currentPlayer: Player;
  isThinking: boolean;
  blackCount: number;
  whiteCount: number;
  mode: GameMode;
  names: PlayerNames;
  humanColor: Player;
  characters: PlayerCharacters;
  speech: { player: Player; text: string; seq: number } | null;
}

function PlayerBadge({
  player,
  count,
  active,
  characterId,
  speech,
}: {
  player: Player;
  count: number;
  active: boolean;
  characterId: PlayerCharacters['black'];
  speech: { text: string; seq: number } | null;
}) {
  const accent = player === 'black' ? 'ring-fuchsia-400' : 'ring-teal-400';
  const characterName = CHARACTERS[characterId].name;

  return (
    <div className="relative flex flex-col items-center gap-1 sm:gap-2">
      <AnimatePresence>
        {speech && <SpeechBubble key={speech.seq} text={speech.text} />}
      </AnimatePresence>
      <span className="relative">
        <CharacterAvatar
          id={characterId}
          className={`h-16 w-16 transition-all duration-300 sm:h-24 sm:w-24 lg:h-28 lg:w-28 ${
            active ? 'scale-105 shadow-2xl' : 'opacity-85'
          }`}
          ringClassName={`ring-4 sm:ring-[6px] ${active ? accent : 'ring-white/80 dark:ring-slate-700'}`}
        />
        <span
          className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full shadow-md ring-4 ring-white sm:h-7 sm:w-7 dark:ring-slate-900 ${
            player === 'black'
              ? 'bg-gradient-to-br from-slate-600 to-black'
              : 'bg-gradient-to-br from-white to-slate-300'
          }`}
        />
      </span>

      <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-extrabold text-slate-700 shadow sm:px-3 sm:py-1 sm:text-sm dark:bg-slate-800/80 dark:text-slate-100">
        {characterName}
      </span>
      <span className="text-lg font-black tabular-nums text-slate-800 sm:text-2xl dark:text-slate-100">
        {count}
      </span>
    </div>
  );
}

export function StatusBar({
  currentPlayer,
  isThinking,
  blackCount,
  whiteCount,
  mode,
  names,
  humanColor,
  characters,
  speech,
}: StatusBarProps) {
  const label = playerLabel(currentPlayer, mode, names);

  let banner: string;
  if (mode === 'cpu') {
    if (currentPlayer === humanColor) {
      banner = 'あなたの番です';
    } else {
      banner = isThinking ? 'AIが考え中...' : 'AIの番です';
    }
  } else {
    banner = `${label}の番です`;
  }

  return (
    <div className="mx-auto mb-5 flex w-full max-w-[720px] items-start justify-between gap-2 sm:mb-8 sm:gap-4">
      <PlayerBadge
        player="black"
        count={blackCount}
        active={currentPlayer === 'black'}
        characterId={characters.black}
        speech={speech?.player === 'black' ? { text: speech.text, seq: speech.seq } : null}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPlayer}-${isThinking}`}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="mt-6 flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 px-3 py-2.5 text-center text-sm font-extrabold text-white shadow-lg shadow-fuchsia-500/30 sm:mt-8 sm:gap-3 sm:px-5 sm:py-3.5 sm:text-xl"
        >
          {isThinking && (
            <span className="inline-block h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-white/70 border-t-transparent sm:h-5 sm:w-5" />
          )}
          <span className="truncate">{banner}</span>
        </motion.div>
      </AnimatePresence>

      <PlayerBadge
        player="white"
        count={whiteCount}
        active={currentPlayer === 'white'}
        characterId={characters.white}
        speech={speech?.player === 'white' ? { text: speech.text, seq: speech.seq } : null}
      />
    </div>
  );
}
