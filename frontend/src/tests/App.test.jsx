import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import { LanguageProvider } from '../context/LanguageContext';

vi.mock('../firebase', () => ({
  trackPageView: vi.fn(),
  trackLanguageChange: vi.fn(),
  initFirebase: vi.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
  });

  it('renders without crashing', () => {
    const { container } = render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    expect(container).toBeTruthy();
  });
});