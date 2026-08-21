import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  applyMove,
  countDiscs,
  createInitialBoard,
  getLegalMoves,
  getOpponent,
  isLegalMove,
} from '../logic/reversiEngine';
import type { AiWorkerRequest, AiWorkerResponse } from '../logic/aiWorker';
import type {
  BoardState,
  CharacterAssignment,
  Difficulty,
  GameConfig,
  GamePhase,
  GameResult,
  Player,
  PlayerCharacters,
  Position,
} from '../types';

function resolveCharacters(assignment: CharacterAssignment, humanColor: Player): PlayerCharacters {
  if (assignment.mode === 'pvp') return { black: assignment.black, white: assignment.white };
  return humanColor === 'black'
    ? { black: assignment.human, white: assignment.ai }
    : { black: assignment.ai, white: assignment.human };
}

interface HistorySnapshot {
  board: BoardState;
  currentPlayer: Player;
  lastMove: Position | null;
  lastFlips: Position[];
}

interface GameState {
  board: BoardState;
  currentPlayer: Player;
  lastMove: Position | null;
  lastFlips: Position[];
  phase: GamePhase;
  winner: GameResult;
  pendingPassFor: Player | null;
  history: HistorySnapshot[];
  mode: GameConfig['mode'];
  difficulty: Difficulty;
  humanColor: Player;
  names: GameConfig['names'];
  characters: CharacterAssignment;
  isThinking: boolean;
  lastMover: Player | null;
  moveSeq: number;
}

type Action =
  | { type: 'MOVE'; player: Player; pos: Position }
  | { type: 'PASS' }
  | { type: 'UNDO' }
  | { type: 'RESTART' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'SET_HUMAN_COLOR'; color: Player }
  | { type: 'SET_THINKING'; value: boolean };

interface PostMoveState {
  phase: GamePhase;
  winner: GameResult;
  pendingPassFor: Player | null;
}

function derivePostMoveState(board: BoardState, nextPlayer: Player): PostMoveState {
  const nextLegal = getLegalMoves(board, nextPlayer);
  if (nextLegal.length > 0) {
    return { phase: 'playing', winner: null, pendingPassFor: null };
  }

  const other = getOpponent(nextPlayer);
  const otherLegal = getLegalMoves(board, other);
  if (otherLegal.length === 0) {
    const { black, white } = countDiscs(board);
    const winner: GameResult = black === white ? 'draw' : black > white ? 'black' : 'white';
    return { phase: 'gameover', winner, pendingPassFor: null };
  }

  return { phase: 'passing', winner: null, pendingPassFor: nextPlayer };
}

function createInitialState(config: GameConfig): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: 'black',
    lastMove: null,
    lastFlips: [],
    phase: 'playing',
    winner: null,
    pendingPassFor: null,
    history: [],
    mode: config.mode,
    difficulty: config.difficulty,
    humanColor: config.humanColor,
    names: config.names,
    characters: config.characters,
    isThinking: false,
    lastMover: null,
    moveSeq: 0,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'MOVE': {
      if (state.phase !== 'playing') return state;
      const { player, pos } = action;
      if (player !== state.currentPlayer) return state;
      if (!isLegalMove(state.board, player, pos)) return state;
      const { board: newBoard, flips } = applyMove(state.board, player, pos);
      const nextPlayer = getOpponent(player);
      const snapshot: HistorySnapshot = {
        board: state.board,
        currentPlayer: state.currentPlayer,
        lastMove: state.lastMove,
        lastFlips: state.lastFlips,
      };
      const post = derivePostMoveState(newBoard, nextPlayer);
      return {
        ...state,
        board: newBoard,
        currentPlayer: nextPlayer,
        lastMove: pos,
        lastFlips: flips,
        history: [...state.history, snapshot],
        lastMover: player,
        moveSeq: state.moveSeq + 1,
        ...post,
      };
    }
    case 'PASS': {
      if (!state.pendingPassFor) return state;
      const passed = state.pendingPassFor;
      const nextPlayer = getOpponent(passed);
      const snapshot: HistorySnapshot = {
        board: state.board,
        currentPlayer: state.currentPlayer,
        lastMove: state.lastMove,
        lastFlips: state.lastFlips,
      };
      const post = derivePostMoveState(state.board, nextPlayer);
      return {
        ...state,
        currentPlayer: nextPlayer,
        lastMove: null,
        lastFlips: [],
        history: [...state.history, snapshot],
        lastMover: null,
        ...post,
      };
    }
    case 'UNDO': {
      if (state.history.length === 0) return state;
      const hist = [...state.history];
      let target = hist.pop() as HistorySnapshot;
      if (state.mode === 'cpu') {
        while (hist.length > 0 && target.currentPlayer !== state.humanColor) {
          target = hist.pop() as HistorySnapshot;
        }
      }
      const post = derivePostMoveState(target.board, target.currentPlayer);
      return {
        ...state,
        board: target.board,
        currentPlayer: target.currentPlayer,
        lastMove: target.lastMove,
        lastFlips: target.lastFlips,
        history: hist,
        isThinking: false,
        lastMover: null,
        ...post,
      };
    }
    case 'RESTART': {
      return createInitialState({
        mode: state.mode,
        difficulty: state.difficulty,
        humanColor: state.humanColor,
        names: state.names,
        characters: state.characters,
      });
    }
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty };
    case 'SET_HUMAN_COLOR':
      return { ...state, humanColor: action.color };
    case 'SET_THINKING':
      return { ...state, isThinking: action.value };
    default:
      return state;
  }
}

export function useGame(config: GameConfig) {
  const [state, dispatch] = useReducer(reducer, config, createInitialState);

  const legalMoves = useMemo(
    () => (state.phase === 'playing' ? getLegalMoves(state.board, state.currentPlayer) : []),
    [state.board, state.currentPlayer, state.phase],
  );

  const { black: blackCount, white: whiteCount } = useMemo(
    () => countDiscs(state.board),
    [state.board],
  );

  const characters = useMemo(
    () => resolveCharacters(state.characters, state.humanColor),
    [state.characters, state.humanColor],
  );

  const isHumanTurn = state.mode === 'pvp' || state.currentPlayer === state.humanColor;

  const workerRef = useRef<Worker | null>(null);
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // Auto-pass: when the current player has no legal move but the game isn't
  // over, show a notice for a moment, then hand the turn to the opponent.
  useEffect(() => {
    if (state.phase !== 'passing') return;
    const timer = window.setTimeout(() => dispatch({ type: 'PASS' }), 1600);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.pendingPassFor]);

  // CPU turn: compute the move in a background worker (so deep searches never
  // freeze the UI), then think for a random 300-800ms before playing it.
  useEffect(() => {
    if (state.mode !== 'cpu') return;
    if (state.phase !== 'playing') return;
    if (state.currentPlayer === state.humanColor) return;

    let cancelled = false;
    dispatch({ type: 'SET_THINKING', value: true });

    const aiPlayer = state.currentPlayer;
    const boardSnapshot = state.board;
    const difficulty = state.difficulty;
    const minDelay = 300 + Math.random() * 500;
    const startedAt = performance.now();

    workerRef.current?.terminate();
    const worker = new Worker(new URL('../logic/aiWorker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<AiWorkerResponse>) => {
      const move = event.data;
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, minDelay - elapsed);
      window.setTimeout(() => {
        if (cancelled) return;
        dispatch({ type: 'SET_THINKING', value: false });
        if (move) dispatch({ type: 'MOVE', player: aiPlayer, pos: move });
      }, remaining);
    };

    const request: AiWorkerRequest = { board: boardSnapshot, player: aiPlayer, difficulty };
    worker.postMessage(request);

    return () => {
      cancelled = true;
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      dispatch({ type: 'SET_THINKING', value: false });
    };
  }, [state.mode, state.phase, state.currentPlayer, state.humanColor, state.board, state.difficulty]);

  const playHumanMove = useCallback(
    (pos: Position) => {
      if (!isHumanTurn || state.phase !== 'playing') return;
      if (!legalMoves.some((m) => m.row === pos.row && m.col === pos.col)) return;
      dispatch({ type: 'MOVE', player: state.currentPlayer, pos });
    },
    [isHumanTurn, state.phase, state.currentPlayer, legalMoves],
  );

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const setDifficulty = useCallback(
    (difficulty: Difficulty) => dispatch({ type: 'SET_DIFFICULTY', difficulty }),
    [],
  );
  // Changing sides mid-game would otherwise hand control of the
  // already-in-progress turn straight to the AI, so start a fresh game instead.
  const setHumanColor = useCallback((color: Player) => {
    dispatch({ type: 'SET_HUMAN_COLOR', color });
    dispatch({ type: 'RESTART' });
  }, []);

  const canUndo =
    state.history.length > 0 && !state.isThinking && state.phase !== 'gameover';

  return {
    board: state.board,
    currentPlayer: state.currentPlayer,
    legalMoves,
    lastMove: state.lastMove,
    lastFlips: state.lastFlips,
    phase: state.phase,
    winner: state.winner,
    pendingPassFor: state.pendingPassFor,
    mode: state.mode,
    difficulty: state.difficulty,
    humanColor: state.humanColor,
    names: state.names,
    characters,
    isThinking: state.isThinking,
    lastMover: state.lastMover,
    moveSeq: state.moveSeq,
    isHumanTurn,
    blackCount,
    whiteCount,
    canUndo,
    playHumanMove,
    undo,
    restart,
    setDifficulty,
    setHumanColor,
  };
}
