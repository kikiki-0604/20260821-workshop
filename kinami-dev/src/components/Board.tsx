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
    <div className="board-frame mx-auto w-full max-w-[720px] rounded-[2rem] p-3 sm:p-5">
      <div className="board-felt grid grid-cols-8 grid-rows-8 gap-[3px] overflow-hidden rounded-3xl p-2 sm:gap-1.5 sm:p-3">
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
