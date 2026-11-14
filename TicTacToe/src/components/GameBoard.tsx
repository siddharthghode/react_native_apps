import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { COLORS } from '../constants/game';
import { Board, Player, WinningLine } from '../types/game';
import { GameCell } from './GameCell';

interface GameBoardProps {
  board: Board;
  winningLine: WinningLine;
  winner: Player | null;
  disabled: boolean;
  onCellPress: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = React.memo(
  ({ board, winningLine, winner, disabled, onCellPress }) => {
    const { width, height } = useWindowDimensions();

    // Calculate responsive board size that fits well across screen sizes
    const { boardSize, cellSize, gap, padding } = useMemo(() => {
      // Allow board to occupy up to width - 40, capped at 360, but also don't exceed 42% of height
      const maxAvailableWidth = Math.min(width - 40, 360);
      const maxAvailableHeight = height * 0.44;
      const targetSize = Math.max(260, Math.min(maxAvailableWidth, maxAvailableHeight));

      const boardPadding = Math.round(targetSize * 0.04);
      const cellGap = Math.round(targetSize * 0.03);
      const innerSize = targetSize - boardPadding * 2;
      const calculatedCellSize = Math.floor((innerSize - cellGap * 2) / 3);

      return {
        boardSize: calculatedCellSize * 3 + cellGap * 2 + boardPadding * 2,
        cellSize: calculatedCellSize,
        gap: cellGap,
        padding: boardPadding,
      };
    }, [width, height]);

    const winningSet = useMemo(() => {
      if (!winningLine) return new Set<number>();
      return new Set<number>(winningLine);
    }, [winningLine]);

    return (
      <View
        style={[
          styles.container,
          {
            width: boardSize,
            height: boardSize,
            padding,
          },
        ]}>
        <View style={[styles.grid, { gap }]}>
          {board.map((cellValue, index) => (
            <GameCell
              key={`cell-${index}`}
              index={index}
              value={cellValue}
              size={cellSize}
              disabled={disabled}
              isWinningCell={winningSet.has(index)}
              winningPlayer={winner}
              onPress={onCellPress}
            />
          ))}
        </View>
      </View>
    );
  }
);

GameBoard.displayName = 'GameBoard';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
