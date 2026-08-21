import { AnimatePresence } from 'framer-motion';
import { Board } from './Board';
import { GameControls } from './GameControls';
import { PassNotice } from './PassNotice';
import { ResultModal } from './ResultModal';
import { StatusBar } from './StatusBar';
import { useGame } from '../hooks/useGame';
import type { GameConfig } from '../types';

interface GameScreenProps {
  config: GameConfig;
  onBackToMenu: () => void;
}

export function GameScreen({ config, onBackToMenu }: GameScreenProps) {
  const game = useGame(config);

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
