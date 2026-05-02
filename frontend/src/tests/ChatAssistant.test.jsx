import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChatAssistant from '../components/ChatAssistant';

vi.mock('../context/LanguageContext', () => ({
  useLang: () => ({
    lang: 'en',
    t: (key) => key,
    translateDynamic: async (text) => text,
    LANGUAGES: [{ code: 'en', native: 'English', label: 'English' }]
  })
}));

vi.mock('../firebase', () => ({
  trackChatInteraction: vi.fn(),
}));

describe('ChatAssistant Component', () => {
  it('renders without crashing', () => {
    // Mock scrollIntoView to prevent errors in jsdom
    window.HTMLElement.prototype.scrollIntoView = function() {};
    
    const { container } = render(<ChatAssistant />);
    expect(container).toBeTruthy();
  });
});
