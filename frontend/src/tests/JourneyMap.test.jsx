import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JourneyMap from '../components/JourneyMap';

vi.mock('../context/LanguageContext', () => ({
  useLang: () => ({
    lang: 'en',
    t: (key) => key,
    translateDynamic: async (text) => text,
  })
}));

vi.mock('../firebase', () => ({
  trackJourneyStep: vi.fn(),
  trackEvent: vi.fn(),
}));

describe('JourneyMap Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<JourneyMap />);
    expect(container).toBeTruthy();
  });
});