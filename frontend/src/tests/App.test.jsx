/**
 * @fileoverview Comprehensive frontend component tests.
 * Tests rendering, accessibility attributes, and user interactions
 * for all major UI components.
 *
 * @author sarang-sketch
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { LanguageProvider } from '../context/LanguageContext';

// Mock Firebase to prevent initialization errors in test env
vi.mock('../firebase', () => ({
  trackPageView: vi.fn(),
  trackLanguageChange: vi.fn(),
  trackChatInteraction: vi.fn(),
  trackQuizComplete: vi.fn(),
  trackGlossaryView: vi.fn(),
  trackJourneyStep: vi.fn(),
  initFirebase: vi.fn(),
}));

/** Helper: renders a component wrapped in LanguageProvider */
const renderWithProvider = (ui) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

describe('App Component', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
  });

  it('renders without crashing', () => {
    const { container } = renderWithProvider(<App />);
    expect(container).toBeTruthy();
  });

  it('renders the brand name', () => {
    renderWithProvider(<App />);
    expect(screen.getAllByText('ElectionEdu').length).toBeGreaterThan(0);
  });

  it('renders all navigation tabs', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('Journey Map')).toBeTruthy();
    expect(screen.getByText('Timeline')).toBeTruthy();
    expect(screen.getByText('Glossary')).toBeTruthy();
    expect(screen.getByText('Quiz')).toBeTruthy();
  });

  it('renders the language selector with aria-label', () => {
    renderWithProvider(<App />);
    const langSelect = document.getElementById('language-selector');
    expect(langSelect).toBeTruthy();
    expect(langSelect.getAttribute('aria-label')).toBe('Select language');
  });

  it('renders skip-to-content accessibility link', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('Skip to main content')).toBeTruthy();
  });

  it('renders the footer with role contentinfo', () => {
    renderWithProvider(<App />);
    const footer = document.querySelector('footer[role="contentinfo"]');
    expect(footer).toBeTruthy();
  });

  it('renders header with role banner', () => {
    renderWithProvider(<App />);
    const header = document.querySelector('header[role="banner"]');
    expect(header).toBeTruthy();
  });

  it('switches tabs when navigation buttons are clicked', () => {
    renderWithProvider(<App />);
    const glossaryTab = screen.getByText('Glossary');
    fireEvent.click(glossaryTab);
    // After clicking Glossary, the tab should be active
    expect(glossaryTab.closest('button').className).toContain('active');
  });
});