import { chooseAiMove } from './ai';
import type { BoardState, Difficulty, Player, Position } from '../types';

export interface AiWorkerRequest {
  board: BoardState;
  player: Player;
  difficulty: Difficulty;
}

export type AiWorkerResponse = Position | null;

// Cast around lib.dom's `self: Window` typing so this file doesn't need the
// separate "webworker" lib (which conflicts with "DOM" in one tsconfig).
const ctx = self as unknown as {
  onmessage: ((event: MessageEvent<AiWorkerRequest>) => void) | null;
  postMessage: (message: AiWorkerResponse) => void;
};

ctx.onmessage = (event) => {
  const { board, player, difficulty } = event.data;
  const move = chooseAiMove(board, player, difficulty);
  ctx.postMessage(move);
};
