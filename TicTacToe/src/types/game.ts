export type Player = 'X' | 'O';

export type Cell = Player | null;

export type Board = Cell[];

export type WinningLine = readonly [number, number, number] | null;

export type GameStatus = 'in_progress' | 'won' | 'draw';

export interface Scores {
  x: number;
  o: number;
  draws: number;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  winningLine: WinningLine;
  status: GameStatus;
  scores: Scores;
  round: number;
}
