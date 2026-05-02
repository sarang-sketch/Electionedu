/**
 * @fileoverview Tests for application configuration constants.
 * Validates that configuration values are correctly defined and immutable.
 *
 * @author sarang-sketch
 */

import { describe, it, expect } from 'vitest';
import {
  APP_NAME,
  APP_VERSION,
  API_ENDPOINTS,
  INPUT_LIMITS,
  COLORS,
  A11Y,
} from '../constants/config';

describe('Constants: Application Metadata', () => {
  it('defines app name', () => {
    expect(APP_NAME).toBe('ElectionEdu');
  });

  it('defines app version', () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe('Constants: API Endpoints', () => {
  it('defines all required endpoints', () => {
    expect(API_ENDPOINTS.CHAT).toBe('/api/chat');
    expect(API_ENDPOINTS.TRANSLATE).toBe('/api/translate');
    expect(API_ENDPOINTS.HEALTH).toBe('/api/health');
    expect(API_ENDPOINTS.SENTIMENT).toBe('/api/analyze-sentiment');
    expect(API_ENDPOINTS.SUMMARIZE).toBe('/api/summarize');
  });

  it('is frozen (immutable)', () => {
    expect(Object.isFrozen(API_ENDPOINTS)).toBe(true);
  });
});

describe('Constants: Input Limits', () => {
  it('defines sensible limits', () => {
    expect(INPUT_LIMITS.CHAT_MESSAGE_MAX).toBeGreaterThan(0);
    expect(INPUT_LIMITS.TRANSLATION_TEXT_MAX).toBeGreaterThan(INPUT_LIMITS.CHAT_MESSAGE_MAX);
    expect(INPUT_LIMITS.SEARCH_QUERY_MAX).toBeGreaterThan(0);
  });

  it('is frozen (immutable)', () => {
    expect(Object.isFrozen(INPUT_LIMITS)).toBe(true);
  });
});

describe('Constants: Theme Colors', () => {
  it('defines primary color as valid hex', () => {
    expect(COLORS.PRIMARY).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('defines all required color tokens', () => {
    expect(COLORS).toHaveProperty('PRIMARY');
    expect(COLORS).toHaveProperty('SUCCESS');
    expect(COLORS).toHaveProperty('WARNING');
    expect(COLORS).toHaveProperty('DANGER');
    expect(COLORS).toHaveProperty('TEXT_PRIMARY');
    expect(COLORS).toHaveProperty('BACKGROUND');
  });

  it('is frozen (immutable)', () => {
    expect(Object.isFrozen(COLORS)).toBe(true);
  });
});

describe('Constants: Accessibility IDs', () => {
  it('defines unique accessibility element IDs', () => {
    const ids = Object.values(A11Y);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('defines skip link ID', () => {
    expect(A11Y.SKIP_LINK_ID).toBeTruthy();
  });
});
