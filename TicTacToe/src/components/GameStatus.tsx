import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/game';
import { GameStatus as GameStatusType, Player } from '../types/game';

interface GameStatusProps {
  status: GameStatusType;
  currentPlayer: Player;
  winner: Player | null;
}

export const GameStatus: React.FC<GameStatusProps> = React.memo(
  ({ status, currentPlayer, winner }) => {
    // Pulse animation for turn indicator dot
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      let pulseLoop: Animated.CompositeAnimation | null = null;
      if (status === 'in_progress') {
        pulseLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.35,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
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
    }, [status, pulseAnim]);

    if (status === 'won' && winner) {
      const isX = winner === 'X';
      const colorTheme = isX ? COLORS.x : COLORS.o;

      return (
        <View
          style={[
            styles.container,
            styles.wonContainer,
            {
              borderColor: colorTheme.light,
              backgroundColor: colorTheme.bg,
              shadowColor: colorTheme.light,
            },
          ]}>
          <Text style={[styles.statusText, { color: colorTheme.light }]}>
            WINNER: PLAYER {winner}! 🎉
          </Text>
        </View>
      );
    }

    if (status === 'draw') {
      return (
        <View
          style={[
            styles.container,
            styles.drawContainer,
            {
              borderColor: COLORS.draw.light,
              backgroundColor: COLORS.draw.bg,
              shadowColor: COLORS.draw.light,
            },
          ]}>
          <Text style={[styles.statusText, { color: COLORS.draw.light }]}>
            IT'S A DRAW! 🤝
          </Text>
        </View>
      );
    }

    // In progress turn indicator
    const isX = currentPlayer === 'X';
    const playerTheme = isX ? COLORS.x : COLORS.o;

    return (
      <View
        style={[
          styles.container,
          {
            borderColor: COLORS.surfaceBorder,
            backgroundColor: COLORS.surface,
          },
        ]}>
        <Animated.View
          style={[
            styles.indicatorDot,
            {
              backgroundColor: playerTheme.light,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Text style={[styles.turnText]}>
          TURN:{' '}
          <Text style={{ color: playerTheme.light, fontWeight: '800' }}>
            PLAYER {currentPlayer}
          </Text>
        </Text>
      </View>
    );
  }
);

GameStatus.displayName = 'GameStatus';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    marginVertical: 12,
    minHeight: 46,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  wonContainer: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  drawContainer: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  turnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.secondary,
    letterSpacing: 0.8,
  },
  indicatorDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 9,
  },
});
