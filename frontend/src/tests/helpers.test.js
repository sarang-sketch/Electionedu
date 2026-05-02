/**
 * @fileoverview Unit tests for shared utility functions.
 * Validates helper logic used across multiple components.
 *
 * @author sarang-sketch
 */

import { describe, it, expect } from 'vitest';
import {
  clamp,
  calcPercentage,
  truncateText,
  getGradeFromScore,
  safeJsonParse,
} from '../utils/helpers';

describe('Utility: clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('returns min when value is below range', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('returns max when value is above range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles equal min and max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});

describe('Utility: calcPercentage', () => {
  it('calculates correct percentage', () => {
    expect(calcPercentage(3, 5)).toBe(60);
  });

  it('returns 100 for full score', () => {
    expect(calcPercentage(5, 5)).toBe(100);
  });

  it('returns 0 for zero score', () => {
    expect(calcPercentage(0, 5)).toBe(0);
  });

  it('returns 0 when total is zero (avoids division by zero)', () => {
    expect(calcPercentage(5, 0)).toBe(0);
  });
});

describe('Utility: truncateText', () => {
  it('returns full text when under limit', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('truncates and adds ellipsis when over limit', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello…');
  });

  it('handles empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('handles null/undefined gracefully', () => {
    expect(truncateText(null, 10)).toBe('');
    expect(truncateText(undefined, 10)).toBe('');
  });
});

describe('Utility: getGradeFromScore', () => {
  it('returns perfect for 100%', () => {
    expect(getGradeFromScore(5, 5)).toBe('perfect');
  });

  it('returns excellent for 80%+', () => {
    expect(getGradeFromScore(4, 5)).toBe('excellent');
  });

  it('returns good for 60%+', () => {
    expect(getGradeFromScore(3, 5)).toBe('good');
  });

  it('returns needs_improvement for below 60%', () => {
    expect(getGradeFromScore(1, 5)).toBe('needs_improvement');
  });

  it('handles zero total gracefully', () => {
    expect(getGradeFromScore(0, 0)).toBe('needs_improvement');
  });
});

describe('Utility: safeJsonParse', () => {
  it('parses valid JSON correctly', () => {
    expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 });
  });

  it('returns fallback for invalid JSON', () => {
    expect(safeJsonParse('not json', 'fallback')).toBe('fallback');
  });

  it('returns null fallback by default', () => {
    expect(safeJsonParse('bad')).toBeNull();
  });
});
