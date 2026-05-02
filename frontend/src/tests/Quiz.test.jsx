import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Quiz from '../components/Quiz';

vi.mock('../context/LanguageContext', () => ({
  useLang: () => ({
    lang: 'en',
    t: (key) => key,
    translateDynamic: async (text) => text,
  })
}));

vi.mock('../firebase', () => ({
  trackQuizComplete: vi.fn(),
}));

describe('Quiz Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Quiz />);
    expect(container).toBeTruthy();
  });
});