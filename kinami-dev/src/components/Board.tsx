import { Cell } from './Cell';
import type { BoardState, Player, Position } from '../types';

interface BoardProps {
  board: BoardState;
  legalMoves: Position[];
  lastMove: Position | null;
  interactive: boolean;
  currentPlayer: Player;
  onCellClick: (pos: Position) => void;
}

export function Board({ board, legalMoves, lastMove, interactive, currentPlayer, onCellClick }: BoardProps) {
  const legalSet = new Set(legalMoves.map((m) => `${m.row}-${m.col}`));

  return (
    <div className="board-frame mx-auto w-full max-w-[560px] rounded-2xl p-3 sm:p-4">
      <div className="board-felt grid grid-cols-8 grid-rows-8 gap-[3px] rounded-lg p-[3px] sm:gap-1 sm:p-2">
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isLegal = legalSet.has(`${rowIndex}-${colIndex}`);
            const isLastMove = lastMove?.row === rowIndex && lastMove?.col === colIndex;
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={value}
                isLegal={isLegal}
                isLastMove={isLastMove}
                interactive={interactive}
                currentPlayer={currentPlayer}
                onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
