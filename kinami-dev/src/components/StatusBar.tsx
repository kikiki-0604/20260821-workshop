import { AnimatePresence, motion } from 'framer-motion';
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
  return (
    <div className="relative flex flex-col items-center gap-1">
      <AnimatePresence>
        {speech && <SpeechBubble key={speech.seq} text={speech.text} />}
      </AnimatePresence>
      <div
        className={`relative rounded-full transition ${
          active ? 'ring-4 ring-amber-400' : 'ring-2 ring-transparent'
        }`}
      >
        <CharacterAvatar id={characterId} size={44} />
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full shadow ${
            player === 'black' ? 'bg-black' : 'bg-white ring-1 ring-slate-300'
          }`}
        />
      </div>
      <span className="text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">{count}</span>
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
    <div className="mx-auto mb-4 flex w-full max-w-[560px] items-start justify-between gap-2 sm:mb-6">
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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className={`mt-2 flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2 text-center text-sm font-bold shadow-md sm:text-base ${
            currentPlayer === 'black'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-900 ring-1 ring-slate-300'
          }`}
        >
          {isThinking && (
            <span className="inline-block h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
