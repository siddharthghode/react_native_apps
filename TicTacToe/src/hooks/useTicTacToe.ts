import { useState, useCallback, useMemo } from 'react';
import { WINNING_COMBINATIONS, INITIAL_BOARD, INITIAL_SCORES } from '../constants/game';
import { Board, Cell, GameStatus, Player, Scores, WinningLine } from '../types/game';

export function checkWinner(
  board: Board
): { winner: Player; line: readonly [number, number, number] } | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    const valA = board[a];
    const valB = board[b];
    const valC = board[c];
    if (valA && valA === valB && valA === valC) {
      return { winner: valA, line: combination };
    }
  }
  return null;
}

export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function useTicTacToe() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [startingPlayer, setStartingPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine>(null);
  const [status, setStatus] = useState<GameStatus>('in_progress');
  const [scores, setScores] = useState<Scores>(INITIAL_SCORES);
  const [round, setRound] = useState<number>(1);

  const handleCellPress = useCallback(
    (index: number) => {
      // Guard against out of bounds, existing value, or game ended
      if (index < 0 || index >= 9) return;
      if (status !== 'in_progress') return;
      if (board[index] !== null) return;

      const newBoard: Board = [...board];
      newBoard[index] = currentPlayer;

      const winResult = checkWinner(newBoard);
      if (winResult) {
        setBoard(newBoard);
        setWinner(winResult.winner);
        setWinningLine(winResult.line);
        setStatus('won');
        setScores((prev) => ({
          ...prev,
          [winResult.winner === 'X' ? 'x' : 'o']: prev[winResult.winner === 'X' ? 'x' : 'o'] + 1,
        }));
        return;
      }

      if (checkDraw(newBoard)) {
        setBoard(newBoard);
        setStatus('draw');
        setScores((prev) => ({
          ...prev,
          draws: prev.draws + 1,
        }));
        return;
      }

      setBoard(newBoard);
      setCurrentPlayer((prev) => (prev === 'X' ? 'O' : 'X'));
    },
    [board, currentPlayer, status]
  );

  const restartGame = useCallback(() => {
    setBoard(INITIAL_BOARD);
    setWinner(null);
    setWinningLine(null);
    setStatus('in_progress');
    // Alternate starting player for fair gameplay each round
    const nextStart: Player = startingPlayer === 'X' ? 'O' : 'X';
    setStartingPlayer(nextStart);
    setCurrentPlayer(nextStart);
    setRound((prev) => prev + 1);
  }, [startingPlayer]);

  const resetScores = useCallback(() => {
    setScores(INITIAL_SCORES);
    setBoard(INITIAL_BOARD);
    setWinner(null);
    setWinningLine(null);
    setStatus('in_progress');
    setStartingPlayer('X');
    setCurrentPlayer('X');
    setRound(1);
  }, []);

  const winningCellsSet = useMemo(() => {
    if (!winningLine) return new Set<number>();
    return new Set<number>(winningLine);
  }, [winningLine]);

  return {
    board,
    currentPlayer,
    startingPlayer,
    winner,
    winningLine,
    winningCellsSet,
    status,
    scores,
    round,
    isGameOver: status !== 'in_progress',
    handleCellPress,
    restartGame,
    resetScores,
  };
}

export type UseTicTacToeReturn = ReturnType<typeof useTicTacToe>;
