/**
 * @fileoverview Application-wide configuration constants.
 * Centralizes magic numbers, API paths, and theme tokens
 * to improve maintainability and reduce duplication.
 *
 * @author sarang-sketch
 * @module constants/config
 */

/** Application metadata */
export const APP_NAME = 'ElectionEdu';
export const APP_VERSION = '2.0.0';

/** API endpoint paths (relative to base URL) */
export const API_ENDPOINTS = Object.freeze({
  CHAT: '/api/chat',
  TRANSLATE: '/api/translate',
  HEALTH: '/api/health',
  SENTIMENT: '/api/analyze-sentiment',
  SUMMARIZE: '/api/summarize',
});

/** Rate limit configuration (mirrors backend) */
export const RATE_LIMITS = Object.freeze({
  GENERAL_WINDOW_MS: 15 * 60 * 1000,
  GENERAL_MAX: 100,
  CHAT_WINDOW_MS: 1 * 60 * 1000,
  CHAT_MAX: 20,
});

/** Input validation limits */
export const INPUT_LIMITS = Object.freeze({
  CHAT_MESSAGE_MAX: 2000,
  TRANSLATION_TEXT_MAX: 5000,
  SEARCH_QUERY_MAX: 200,
});

/** Theme color tokens used across components */
export const COLORS = Object.freeze({
  PRIMARY: '#2563eb',
  SECONDARY: '#7c3aed',
  SUCCESS: '#059669',
  WARNING: '#d97706',
  DANGER: '#dc2626',
  MUTED: '#94a3b8',
  TEXT_PRIMARY: '#1e293b',
  TEXT_SECONDARY: '#475569',
  BACKGROUND: '#ffffff',
  SURFACE: '#f8fafc',
  BORDER: '#e8ddd0',
});

/** Animation duration constants (in ms) */
export const ANIMATION = Object.freeze({
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
});

/** Accessibility constants */
export const A11Y = Object.freeze({
  SKIP_LINK_ID: 'main-content',
  CHAT_INPUT_ID: 'chat-input',
  SEARCH_INPUT_ID: 'glossary-search',
  LANG_SELECT_ID: 'language-selector',
});
