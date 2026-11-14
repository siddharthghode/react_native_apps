import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/game';
import { Cell, Player } from '../types/game';

interface GameCellProps {
  value: Cell;
  index: number;
  isWinningCell: boolean;
  winningPlayer: Player | null;
  disabled: boolean;
  size: number;
  onPress: (index: number) => void;
}

export const GameCell: React.FC<GameCellProps> = React.memo(
  ({ value, index, isWinningCell, winningPlayer, disabled, size, onPress }) => {
    // Entrance animation for mark (X or O)
    const scaleAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
    const opacityAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

    // Pulse animation for winning cells
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Trigger entrance animation when cell receives a value
    useEffect(() => {
      if (value) {
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);

        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 140,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
      }
    }, [value, scaleAnim, opacityAnim]);

    // Looping pulse when this cell is part of winning line
    useEffect(() => {
      let pulseLoop: Animated.CompositeAnimation | null = null;
      if (isWinningCell) {
        pulseLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.06,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
        pulseLoop.start();
      } else {
        pulseAnim.setValue(1);
      }

      return () => {
        if (pulseLoop) {
          pulseLoop.stop();
        }
      };
    }, [isWinningCell, pulseAnim]);

    const handlePress = () => {
      if (!disabled && value === null) {
        onPress(index);
      }
    };

    // Calculate dimensions based on dynamic cell size
    const markContainerSize = Math.round(size * 0.56);
    const strokeWidth = Math.max(6, Math.round(size * 0.1));

    // Dynamic styles based on winning state
    const winnerTheme = winningPlayer === 'X' ? COLORS.x : COLORS.o;
    const cellBorderColor = isWinningCell
      ? winnerTheme.light
      : COLORS.surfaceBorder;
    const cellBgColor = isWinningCell
      ? winnerTheme.bg
      : COLORS.surfaceElevated;

    return (
      <Animated.View
        style={[
          styles.cellWrapper,
          {
            width: size,
            height: size,
            transform: [{ scale: pulseAnim }],
          },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Cell ${index + 1}, ${value ? `occupied by ${value}` : 'empty'}`}
          accessibilityState={{ disabled: disabled || value !== null }}
          disabled={disabled || value !== null}
          onPress={handlePress}
          style={({ pressed }) => [
            styles.cell,
            {
              backgroundColor: pressed && !value && !disabled ? COLORS.surfaceHighlight : cellBgColor,
              borderColor: cellBorderColor,
              borderWidth: isWinningCell ? 2.5 : 1.5,
              borderRadius: Math.round(size * 0.22),
            },
            isWinningCell && {
              shadowColor: winnerTheme.light,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 12,
              elevation: 8,
            },
          ]}>
          {value !== null && (
            <Animated.View
              style={[
                styles.markContainer,
                {
                  width: markContainerSize,
                  height: markContainerSize,
                  opacity: opacityAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}>
              {value === 'X' ? (
                <View style={styles.xContainer}>
                  {/* Primary X Bar 1 */}
                  <View
                    style={[
                      styles.xBar,
                      {
                        width: strokeWidth,
                        height: markContainerSize,
                        borderRadius: strokeWidth / 2,
                        backgroundColor: COLORS.x.light,
                        transform: [{ rotate: '45deg' }],
                      },
                    ]}
                  />
                  {/* Primary X Bar 2 */}
                  <View
                    style={[
                      styles.xBar,
                      {
                        width: strokeWidth,
                        height: markContainerSize,
                        borderRadius: strokeWidth / 2,
                        backgroundColor: COLORS.x.light,
                        transform: [{ rotate: '-45deg' }],
                      },
                    ]}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.oRing,
                    {
                      width: markContainerSize,
                      height: markContainerSize,
                      borderRadius: markContainerSize / 2,
                      borderWidth: strokeWidth,
                      borderColor: COLORS.o.light,
                    },
                  ]}
                />
              )}
            </Animated.View>
          )}
        </Pressable>
      </Animated.View>
    );
  }
);

GameCell.displayName = 'GameCell';

const styles = StyleSheet.create({
  cellWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  markContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  xContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: COLORS.x.light,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  xBar: {
    position: 'absolute',
  },
  oRing: {
    shadowColor: COLORS.o.light,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
});
