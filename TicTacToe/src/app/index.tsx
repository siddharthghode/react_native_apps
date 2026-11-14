import React, { useState, useEffect } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameBoard } from '../components/GameBoard';
import { GameStatus } from '../components/GameStatus';
import { ScoreBoard } from '../components/ScoreBoard';
import { WinnerModal } from '../components/WinnerModal';
import { COLORS } from '../constants/game';
import { useTicTacToe } from '../hooks/useTicTacToe';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    board,
    currentPlayer,
    winner,
    winningLine,
    status,
    scores,
    round,
    isGameOver,
    handleCellPress,
    restartGame,
    resetScores,
  } = useTicTacToe();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Automatically show celebratory modal after a short delay so players see the winning highlight
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (isGameOver) {
      timeoutId = setTimeout(() => {
        setModalVisible(true);
      }, 500);
    } else {
      setModalVisible(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isGameOver, round]);

  const handlePlayAgain = () => {
    setModalVisible(false);
    restartGame();
  };

  const handleResetScores = () => {
    const doReset = () => {
      setModalVisible(false);
      resetScores();
    };

    if (Platform.OS === 'web') {
      if (
        typeof window !== 'undefined' &&
        window.confirm('Reset all scores back to zero and start fresh?')
      ) {
        doReset();
      }
    } else {
      Alert.alert(
        'Reset Scores',
        'Are you sure you want to reset all player scores and start a fresh match?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: doReset },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 8, 20),
            paddingBottom: Math.max(insets.bottom + 16, 28),
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>NEON EDITION</Text>
            </View>
            <View style={styles.roundBadge}>
              <Text style={styles.roundBadgeText}>ROUND {round}</Text>
            </View>
          </View>

          <Text style={styles.title}>
            <Text style={{ color: COLORS.x.light }}>TIC </Text>
            <Text style={{ color: COLORS.purple.light }}>TAC </Text>
            <Text style={{ color: COLORS.o.light }}>TOE</Text>
          </Text>
          <Text style={styles.subtitle}>Two-Player Tactical Showdown</Text>
        </View>

        {/* Score Board */}
        <ScoreBoard
          scores={scores}
          currentPlayer={currentPlayer}
          status={status}
        />

        {/* Turn / Game Status */}
        <GameStatus
          status={status}
          currentPlayer={currentPlayer}
          winner={winner}
        />

        {/* 3x3 Game Board */}
        <View style={styles.boardWrapper}>
          <GameBoard
            board={board}
            winningLine={winningLine}
            winner={winner}
            disabled={isGameOver}
            onCellPress={handleCellPress}
          />
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionsContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isGameOver ? 'Play Next Round' : 'Restart Current Round'}
            onPress={handlePlayAgain}
            style={({ pressed }) => [
              styles.primaryActionBtn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.primaryActionBtnText}>
              {isGameOver ? 'PLAY NEXT ROUND' : 'RESTART ROUND'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset Match Scores"
            onPress={handleResetScores}
            style={({ pressed }) => [
              styles.secondaryActionBtn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.secondaryActionBtnText}>RESET SCORES</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Winner / Draw Celebratory Modal */}
      <WinnerModal
        visible={modalVisible}
        status={status}
        winner={winner}
        scores={scores}
        onPlayAgain={handlePlayAgain}
        onDismiss={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: COLORS.purple.bg,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.purple.border,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.purple.light,
    letterSpacing: 1.2,
  },
  roundBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  roundBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.text.secondary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.muted,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  boardWrapper: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 360,
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.purple.primary,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.purple.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  secondaryActionBtn: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1.5,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionBtnText: {
    color: COLORS.text.secondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
