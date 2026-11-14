import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/game';
import { GameStatus, Player, Scores } from '../types/game';

interface ScoreBoardProps {
  scores: Scores;
  currentPlayer: Player;
  status: GameStatus;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = React.memo(
  ({ scores, currentPlayer, status }) => {
    const isXTurn = status === 'in_progress' && currentPlayer === 'X';
    const isOTurn = status === 'in_progress' && currentPlayer === 'O';

    return (
      <View style={styles.container}>
        {/* Player X Card */}
        <View
          style={[
            styles.card,
            isXTurn ? styles.cardActiveX : styles.cardInactive,
          ]}>
          <View style={styles.cardHeader}>
            <View style={[styles.avatarBadge, { backgroundColor: COLORS.x.bg }]}>
              <Text style={[styles.avatarText, { color: COLORS.x.light }]}>X</Text>
            </View>
            <Text style={[styles.playerName, { color: COLORS.x.light }]}>PLAYER X</Text>
          </View>
          <Text style={[styles.scoreValue, { color: COLORS.text.primary }]}>
            {scores.x}
          </Text>
          {isXTurn && <View style={[styles.activeDot, { backgroundColor: COLORS.x.light }]} />}
        </View>

        {/* Ties Card */}
        <View style={[styles.card, styles.cardInactive, styles.tiesCard]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.playerName, { color: COLORS.draw.light }]}>DRAWS</Text>
          </View>
          <Text style={[styles.scoreValue, { color: COLORS.text.primary }]}>
            {scores.draws}
          </Text>
        </View>

        {/* Player O Card */}
        <View
          style={[
            styles.card,
            isOTurn ? styles.cardActiveO : styles.cardInactive,
          ]}>
          <View style={styles.cardHeader}>
            <View style={[styles.avatarBadge, { backgroundColor: COLORS.o.bg }]}>
              <Text style={[styles.avatarText, { color: COLORS.o.light }]}>O</Text>
            </View>
            <Text style={[styles.playerName, { color: COLORS.o.light }]}>PLAYER O</Text>
          </View>
          <Text style={[styles.scoreValue, { color: COLORS.text.primary }]}>
            {scores.o}
          </Text>
          {isOTurn && <View style={[styles.activeDot, { backgroundColor: COLORS.o.light }]} />}
        </View>
      </View>
    );
  }
);

ScoreBoard.displayName = 'ScoreBoard';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '100%',
    maxWidth: 360,
    gap: 8,
    marginVertical: 10,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    minHeight: 74,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInactive: {
    borderColor: COLORS.surfaceBorder,
  },
  cardActiveX: {
    borderColor: COLORS.x.light,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    shadowColor: COLORS.x.light,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  cardActiveO: {
    borderColor: COLORS.o.light,
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    shadowColor: COLORS.o.light,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  tiesCard: {
    flex: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  avatarBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '800',
  },
  playerName: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activeDot: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
