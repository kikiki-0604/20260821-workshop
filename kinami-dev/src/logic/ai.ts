import type { BoardState, Difficulty, Player, Position } from '../types';
import {
  applyMove,
  countDiscs,
  countEmpty,
  getLegalMoves,
  getOpponent,
} from './reversiEngine';

/**
 * Classic Othello positional weight table. Corners are extremely valuable,
 * the squares diagonally adjacent to an empty corner (the "X-squares") are
 * dangerous because they hand the opponent the corner.
 */
const WEIGHT_TABLE: ReadonlyArray<ReadonlyArray<number>> = [
  [120, -20, 20, 5, 5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20, 5, 5, 20, -20, 120],
];

interface DifficultySettings {
  /** Fixed search depth used outside of the exact endgame window. */
  depth: number;
  /** Probability of playing a random legal move instead of the computed best move. */
  randomness: number;
  /** When the number of empty squares drops to this value or below, search to the end of the game. */
  endgameExactFrom: number;
}

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: { depth: 1, randomness: 0.35, endgameExactFrom: 0 },
  normal: { depth: 3, randomness: 0.05, endgameExactFrom: 8 },
  hard: { depth: 5, randomness: 0, endgameExactFrom: 10 },
  extreme: { depth: 6, randomness: 0, endgameExactFrom: 12 },
};

function weightDiff(board: BoardState, player: Player): number {
  const opponent = getOpponent(player);
  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = board[row][col];
      if (cell === player) score += WEIGHT_TABLE[row][col];
      else if (cell === opponent) score -= WEIGHT_TABLE[row][col];
    }
  }
  return score;
}

/** Approximate stable-disc count: a disc is "full-line stable" when its entire
 * row, column and both diagonals are already filled, so no future move can
 * ever flank it, or when it sits in a corner (always permanently stable). */
function countStable(board: BoardState, player: Player): number {
  const rowFull = board.map((row) => row.every((cell) => cell !== null));
  const colFull = Array.from({ length: 8 }, (_, col) =>
    board.every((row) => row[col] !== null),
  );
  const diagFull = new Map<number, boolean>();
  const antiDiagFull = new Map<number, boolean>();

  for (let d = -7; d <= 7; d++) {
    let full = true;
    for (let row = 0; row < 8; row++) {
      const col = row - d;
      if (col < 0 || col > 7) continue;
      if (board[row][col] === null) {
        full = false;
        break;
      }
    }
    diagFull.set(d, full);
  }

  for (let s = 0; s <= 14; s++) {
    let full = true;
    for (let row = 0; row < 8; row++) {
      const col = s - row;
      if (col < 0 || col > 7) continue;
      if (board[row][col] === null) {
        full = false;
        break;
      }
    }
    antiDiagFull.set(s, full);
  }

  let count = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] !== player) continue;
      const isCorner = (row === 0 || row === 7) && (col === 0 || col === 7);
      if (isCorner) {
        count++;
        continue;
      }
      if (
        rowFull[row] &&
        colFull[col] &&
        diagFull.get(row - col) &&
        antiDiagFull.get(row + col)
      ) {
        count++;
      }
    }
  }
  return count;
}

/** Heuristic evaluation from `player`'s point of view. Weights shift with the
 * game phase: early on, position & mobility dominate; near the end, raw disc
 * count takes over. */
function evaluate(board: BoardState, player: Player): number {
  const opponent = getOpponent(player);
  const empty = countEmpty(board);
  const { black, white } = countDiscs(board);
  const my = player === 'black' ? black : white;
  const opp = player === 'black' ? white : black;

  const positional = weightDiff(board, player);

  const myMoves = getLegalMoves(board, player).length;
  const oppMoves = getLegalMoves(board, opponent).length;
  const mobility =
    myMoves + oppMoves === 0 ? 0 : (100 * (myMoves - oppMoves)) / (myMoves + oppMoves);

  const stability = (countStable(board, player) - countStable(board, opponent)) * 20;
  const discDiff = my - opp;

  let wPositional: number;
  let wMobility: number;
  let wStability: number;
  let wDisc: number;

  if (empty > 44) {
    wPositional = 1.0;
    wMobility = 1.0;
    wStability = 1.0;
    wDisc = 0.1;
  } else if (empty > 12) {
    wPositional = 0.8;
    wMobility = 0.8;
    wStability = 1.2;
    wDisc = 0.3;
  } else {
    wPositional = 0.3;
    wMobility = 0.3;
    wStability = 1.0;
    wDisc = 2.0;
  }

  return (
    positional * wPositional +
    mobility * wMobility +
    stability * wStability +
    discDiff * wDisc
  );
}

function terminalScore(board: BoardState, player: Player): number {
  const { black, white } = countDiscs(board);
  const my = player === 'black' ? black : white;
  const opp = player === 'black' ? white : black;
  return (my - opp) * 1000;
}

function orderMoves(moves: Position[]): Position[] {
  return [...moves].sort(
    (a, b) => WEIGHT_TABLE[b.row][b.col] - WEIGHT_TABLE[a.row][a.col],
  );
}

/** Fixed-depth minimax with alpha-beta pruning, using the heuristic evaluation. */
function negamaxHeuristic(
  board: BoardState,
  player: Player,
  depth: number,
  alpha: number,
  beta: number,
): number {
  const legal = getLegalMoves(board, player);
  const opponent = getOpponent(player);

  if (legal.length === 0) {
    const oppLegal = getLegalMoves(board, opponent);
    if (oppLegal.length === 0) return terminalScore(board, player);
    if (depth === 0) return evaluate(board, player);
    return -negamaxHeuristic(board, opponent, depth - 1, -beta, -alpha);
  }

  if (depth === 0) return evaluate(board, player);

  let best = -Infinity;
  let localAlpha = alpha;
  for (const move of orderMoves(legal)) {
    const { board: next } = applyMove(board, player, move);
    const score = -negamaxHeuristic(next, opponent, depth - 1, -beta, -localAlpha);
    if (score > best) best = score;
    if (best > localAlpha) localAlpha = best;
    if (localAlpha >= beta) break;
  }
  return best;
}

/** Full-depth minimax with alpha-beta pruning searched all the way to the end
 * of the game, for a perfect result in the closing moves. */
function negamaxExact(
  board: BoardState,
  player: Player,
  alpha: number,
  beta: number,
): number {
  const legal = getLegalMoves(board, player);
  const opponent = getOpponent(player);

  if (legal.length === 0) {
    const oppLegal = getLegalMoves(board, opponent);
    if (oppLegal.length === 0) return terminalScore(board, player);
    return -negamaxExact(board, opponent, -beta, -alpha);
  }

  let best = -Infinity;
  let localAlpha = alpha;
  for (const move of orderMoves(legal)) {
    const { board: next } = applyMove(board, player, move);
    const score = -negamaxExact(next, opponent, -beta, -localAlpha);
    if (score > best) best = score;
    if (best > localAlpha) localAlpha = best;
    if (localAlpha >= beta) break;
  }
  return best;
}

/** Picks the AI's next move for the given difficulty. Returns null if there is
 * no legal move (callers should not invoke this in that case). */
export function chooseAiMove(
  board: BoardState,
  player: Player,
  difficulty: Difficulty,
): Position | null {
  const legal = getLegalMoves(board, player);
  if (legal.length === 0) return null;
  if (legal.length === 1) return legal[0];

  const settings = DIFFICULTY_SETTINGS[difficulty];

  if (settings.randomness > 0 && Math.random() < settings.randomness) {
    return legal[Math.floor(Math.random() * legal.length)];
  }

  const empty = countEmpty(board);
  const exact = empty <= settings.endgameExactFrom;
  const opponent = getOpponent(player);
  const ordered = orderMoves(legal);

  let bestMove = ordered[0];
  let bestScore = -Infinity;
  let alpha = -Infinity;
  const beta = Infinity;

  for (const move of ordered) {
    const { board: next } = applyMove(board, player, move);
    const score = exact
      ? -negamaxExact(next, opponent, -beta, -alpha)
      : -negamaxHeuristic(next, opponent, settings.depth - 1, -beta, -alpha);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    if (score > alpha) alpha = score;
  }

  return bestMove;
}
