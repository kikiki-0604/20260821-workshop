export type Player = 'black' | 'white';

export type CellValue = Player | null;

export type BoardState = CellValue[][];

export interface Position {
  row: number;
  col: number;
}

export type Difficulty = 'easy' | 'normal' | 'hard' | 'extreme';

export type GameMode = 'cpu' | 'pvp';

export interface PlayerNames {
  black: string;
  white: string;
}

export interface GameConfig {
  mode: GameMode;
  difficulty: Difficulty;
  humanColor: Player;
  names: PlayerNames;
}

export type GamePhase = 'playing' | 'passing' | 'gameover';

export type GameResult = Player | 'draw' | null;
