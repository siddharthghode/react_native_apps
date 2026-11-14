import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../constants/game';
import { GameStatus, Player, Scores } from '../types/game';

interface WinnerModalProps {
  visible: boolean;
  status: GameStatus;
  winner: Player | null;
  scores: Scores;
  onPlayAgain: () => void;
  onDismiss: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = React.memo(
  ({ visible, status, winner, scores, onPlayAgain, onDismiss }) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (visible) {
        scaleAnim.setValue(0.85);
        opacityAnim.setValue(0);
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 120,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [visible, scaleAnim, opacityAnim]);

    if (!visible || status === 'in_progress') return null;

    const isDraw = status === 'draw';
    const isX = winner === 'X';
    const theme = isDraw
      ? COLORS.draw
      : isX
      ? COLORS.x
      : COLORS.o;

    return (
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={onDismiss}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={onDismiss} />

          <Animated.View
            style={[
              styles.card,
              {
                borderColor: theme.light,
                shadowColor: theme.light,
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}>
            {/* Celebration Icon */}
            <View style={[styles.iconBadge, { backgroundColor: theme.bg }]}>
              <Text style={styles.emojiIcon}>{isDraw ? '🤝' : '🏆'}</Text>
            </View>

            {/* Title */}
            <Text style={[styles.celebrationSubtitle, { color: theme.light }]}>
              {isDraw ? 'GAME TIED' : 'VICTORY!'}
            </Text>

            <Text style={styles.celebrationTitle}>
              {isDraw ? "It's a Draw!" : `Player ${winner} Wins!`}
            </Text>

            {/* Score pill */}
            <View style={styles.scoreRow}>
              <View style={styles.scorePill}>
                <Text style={[styles.scorePillLabel, { color: COLORS.x.light }]}>X</Text>
                <Text style={styles.scorePillVal}>{scores.x}</Text>
              </View>
              <Text style={styles.scoreSeparator}>•</Text>
              <View style={styles.scorePill}>
                <Text style={[styles.scorePillLabel, { color: COLORS.draw.light }]}>Draws</Text>
                <Text style={styles.scorePillVal}>{scores.draws}</Text>
              </View>
              <Text style={styles.scoreSeparator}>•</Text>
              <View style={styles.scorePill}>
                <Text style={[styles.scorePillLabel, { color: COLORS.o.light }]}>O</Text>
                <Text style={styles.scorePillVal}>{scores.o}</Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Play Next Round"
                onPress={onPlayAgain}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.primaryButtonText}>Play Again</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View Board"
                onPress={onDismiss}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.secondaryButtonText}>View Board</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
);

WinnerModal.displayName = 'WinnerModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 2,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emojiIcon: {
    fontSize: 34,
  },
  celebrationSubtitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  celebrationTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text.primary,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 24,
    gap: 8,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scorePillLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  scorePillVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  scoreSeparator: {
    color: COLORS.text.muted,
    fontSize: 12,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.purple.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.purple.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  secondaryButton: {
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
