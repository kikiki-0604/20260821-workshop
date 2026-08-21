import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Board } from './Board';
import { GameControls } from './GameControls';
import { PassNotice } from './PassNotice';
import { ResultModal } from './ResultModal';
import { StatusBar } from './StatusBar';
import { randomLine } from '../characters/characters';
import { useGame } from '../hooks/useGame';
import type { useVoice } from '../hooks/useVoice';
import type { GameConfig, Player } from '../types';

interface GameScreenProps {
  config: GameConfig;
  onBackToMenu: () => void;
  voice: ReturnType<typeof useVoice>;
}

export function GameScreen({ config, onBackToMenu, voice }: GameScreenProps) {
  const game = useGame(config);
  const [speech, setSpeech] = useState<{ player: Player; text: string; seq: number } | null>(null);

  useEffect(() => {
    if (!game.lastMover) {
      // An undo (or restart) cleared the last mover: dismiss any bubble left
      // over from the move that just got undone instead of letting it linger.
      setSpeech(null);
      return;
    }
    const characterId = game.characters[game.lastMover];
    const text = randomLine(characterId);
    setSpeech({ player: game.lastMover, text, seq: game.moveSeq });
    voice.speak(characterId, text);
    const timer = window.setTimeout(() => setSpeech(null), 2200);
    return () => window.clearTimeout(timer);
  }, [game.moveSeq, game.lastMover]);

  return (
    <div className="w-full">
      <StatusBar
        currentPlayer={game.currentPlayer}
        isThinking={game.isThinking}
        blackCount={game.blackCount}
        whiteCount={game.whiteCount}
        mode={game.mode}
        names={game.names}
        humanColor={game.humanColor}
        characters={game.characters}
        speech={speech}
      />

      <AnimatePresence>
        {game.phase === 'passing' && game.pendingPassFor && (
          <PassNotice player={game.pendingPassFor} mode={game.mode} names={game.names} />
        )}
      </AnimatePresence>

      <Board
        board={game.board}
        legalMoves={game.legalMoves}
        lastMove={game.lastMove}
        interactive={game.isHumanTurn && game.phase === 'playing'}
        currentPlayer={game.currentPlayer}
        onCellClick={game.playHumanMove}
      />

      <GameControls
        mode={game.mode}
        canUndo={game.canUndo}
        onUndo={game.undo}
        onRestart={game.restart}
        onBackToMenu={onBackToMenu}
        difficulty={game.difficulty}
        onChangeDifficulty={game.setDifficulty}
        humanColor={game.humanColor}
        onChangeColor={game.setHumanColor}
      />

      <AnimatePresence>
        {game.phase === 'gameover' && (
          <ResultModal
            winner={game.winner}
            blackCount={game.blackCount}
            whiteCount={game.whiteCount}
            mode={game.mode}
            names={game.names}
            humanColor={game.humanColor}
            onRestart={game.restart}
            onBackToMenu={onBackToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
