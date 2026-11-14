import { Board, Scores } from '../types/game';

export const WINNING_COMBINATIONS: readonly (readonly [number, number, number])[] = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const INITIAL_BOARD: Board = [
  null, null, null,
  null, null, null,
  null, null, null,
];

export const INITIAL_SCORES: Scores = {
  x: 0,
  o: 0,
  draws: 0,
};

export const COLORS = {
  background: '#0B0F19',
  surface: '#131D2E',
  surfaceElevated: '#1A243B',
  surfaceBorder: '#27354E',
  surfaceHighlight: '#2E3F5F',

  // Player X - Electric Cyan
  x: {
    primary: '#06B6D4',
    light: '#22D3EE',
    glow: 'rgba(34, 211, 238, 0.35)',
    bg: 'rgba(6, 182, 212, 0.14)',
    border: '#0891B2',
  },

  // Player O - Neon Pink
  o: {
    primary: '#EC4899',
    light: '#F43F5E',
    glow: 'rgba(244, 63, 94, 0.35)',
    bg: 'rgba(236, 72, 153, 0.14)',
    border: '#DB2777',
  },

  // Purple Accent
  purple: {
    primary: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED',
    glow: 'rgba(139, 92, 246, 0.35)',
    bg: 'rgba(139, 92, 246, 0.16)',
    border: '#6D28D9',
  },

  // Ties / Draws
  draw: {
    primary: '#F59E0B',
    light: '#FBBF24',
    glow: 'rgba(245, 158, 11, 0.35)',
    bg: 'rgba(245, 158, 11, 0.14)',
    border: '#D97706',
  },

  // Typography & Neutrals
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B',
    inverse: '#0B0F19',
  },
} as const;
