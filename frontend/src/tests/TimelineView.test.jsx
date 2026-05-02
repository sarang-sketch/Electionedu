import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TimelineView from '../components/TimelineView';

vi.mock('../context/LanguageContext', () => ({
  useLang: () => ({
    lang: 'en',
    t: (key) => key,
    translateDynamic: async (text) => text,
  })
}));

describe('TimelineView Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<TimelineView />);
    expect(container).toBeTruthy();
  });
});
