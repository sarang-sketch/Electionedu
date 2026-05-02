/**
 * @fileoverview Shared utility functions for the Election Education App.
 * Provides reusable helper logic used across multiple components.
 *
 * @author sarang-sketch
 * @module utils/helpers
 */

/**
 * Clamps a numeric value between a minimum and maximum range.
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @returns {number} The clamped value
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Calculates a percentage from a numerator and denominator.
 * Returns 0 if the denominator is zero to avoid division errors.
 * @param {number} value - The numerator
 * @param {number} total - The denominator
 * @returns {number} Percentage value (0-100)
 */
export const calcPercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Truncates a string to a given max length, appending an ellipsis if needed.
 * @param {string} text - The string to truncate
 * @param {number} maxLength - Maximum character count
 * @returns {string} Truncated string
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '…';
};

/**
 * Generates a deterministic grade key based on quiz score percentage.
 * @param {number} score - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {'perfect'|'excellent'|'good'|'needs_improvement'} Grade string
 */
export const getGradeFromScore = (score, total) => {
  const pct = calcPercentage(score, total);
  if (pct === 100) return 'perfect';
  if (pct >= 80) return 'excellent';
  if (pct >= 60) return 'good';
  return 'needs_improvement';
};

/**
 * Debounces a callback function by a given delay in milliseconds.
 * Useful for search inputs and resize handlers.
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Safely parses a JSON string, returning a fallback value on failure.
 * @param {string} jsonString - The JSON string to parse
 * @param {*} fallback - The fallback value if parsing fails
 * @returns {*} Parsed value or fallback
 */
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

/**
 * Returns the appropriate API base URL based on the environment.
 * In production, uses the relative backend proxy path.
 * In development, uses localhost:5000.
 * @returns {string} API base URL
 */
export const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    return '/_/backend';
  }
  return 'http://localhost:5000';
};
