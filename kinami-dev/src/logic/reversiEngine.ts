import type { BoardState, CellValue, Player, Position } from '../types';

export const BOARD_SIZE = 8;

const DIRECTIONS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

export function getOpponent(player: Player): Player {
  return player === 'black' ? 'white' : 'black';
}

export function createInitialBoard(): BoardState {
  const board: BoardState = Array.from({ length: BOARD_SIZE }, () =>
    Array<CellValue>(BOARD_SIZE).fill(null),
  );
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  return board;
}

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

/** Cells that would be flipped if `player` plays at (row, col). Empty if the move is illegal. */
export function getFlipsForMove(
  board: BoardState,
  player: Player,
  row: number,
  col: number,
): Position[] {
  if (board[row][col] !== null) return [];
  const opponent = getOpponent(player);
  const flips: Position[] = [];

  for (const [dr, dc] of DIRECTIONS) {
    const line: Position[] = [];
    let r = row + dr;
    let c = col + dc;
    while (inBounds(r, c) && board[r][c] === opponent) {
      line.push({ row: r, col: c });
      r += dr;
      c += dc;
    }
    if (line.length > 0 && inBounds(r, c) && board[r][c] === player) {
      flips.push(...line);
    }
  }

  return flips;
}

export function getLegalMoves(board: BoardState, player: Player): Position[] {
  const moves: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== null) continue;
      if (getFlipsForMove(board, player, row, col).length > 0) {
        moves.push({ row, col });
      }
    }
  }
  return moves;
}

export function isLegalMove(board: BoardState, player: Player, pos: Position): boolean {
  return getFlipsForMove(board, player, pos.row, pos.col).length > 0;
}

export interface ApplyMoveResult {
  board: BoardState;
  flips: Position[];
}

export function applyMove(
  board: BoardState,
  player: Player,
  pos: Position,
): ApplyMoveResult {
  const flips = getFlipsForMove(board, player, pos.row, pos.col);
  const next: BoardState = board.map((row) => row.slice());
  next[pos.row][pos.col] = player;
  for (const flip of flips) {
    next[flip.row][flip.col] = player;
  }
  return { board: next, flips };
}

export function countDiscs(board: BoardState): { black: number; white: number } {
  let black = 0;
  let white = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 'black') black++;
      else if (cell === 'white') white++;
    }
  }
  return { black, white };
}

export function countEmpty(board: BoardState): number {
  let empty = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === null) empty++;
    }
  }
  return empty;
}

export function hasAnyLegalMove(board: BoardState, player: Player): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== null) continue;
      if (getFlipsForMove(board, player, row, col).length > 0) return true;
    }
  }
  return false;
}
