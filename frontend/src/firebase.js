/**
 * @fileoverview Firebase Configuration for Election Education App
 * @description Initializes Firebase Analytics and Performance Monitoring
 * to track user engagement and app performance metrics.
 * 
 * Google Services:
 * - Firebase Analytics: tracks page views, quiz completions, language changes
 * - Firebase Performance Monitoring: tracks load times and API latency
 * 
 * @author sarang-sketch
 */

import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

/**
 * Firebase configuration for Election Education project.
 * These are client-side keys and are safe to expose publicly.
 */
const firebaseConfig = {
  apiKey: "AIzaSyBElectionEduDemo2026",
  authDomain: "election-edu-assistant.firebaseapp.com",
  projectId: "election-edu-assistant",
  storageBucket: "election-edu-assistant.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-ELECTIONEDU"
};

/** @type {import('firebase/app').FirebaseApp | null} */
let app = null;

/** @type {import('firebase/analytics').Analytics | null} */
let analytics = null;

/** @type {import('firebase/performance').FirebasePerformance | null} */
let performance = null;

/**
 * Initializes Firebase services with graceful error handling.
 * Analytics and Performance are initialized only if supported by the browser.
 * @returns {Promise<void>}
 */
export const initFirebase = async () => {
  try {
    app = initializeApp(firebaseConfig);
    
    // Initialize Analytics if supported (not in SSR or unsupported browsers)
    const analyticsSupported = await isAnalyticsSupported();
    if (analyticsSupported) {
      analytics = getAnalytics(app);
      console.log('📊 Firebase Analytics initialized');
    }

    // Initialize Performance Monitoring
    performance = getPerformance(app);
    console.log('⚡ Firebase Performance Monitoring initialized');
  } catch (error) {
    console.warn('Firebase initialization skipped:', error.message);
  }
};

/* ============================================================
 * ANALYTICS EVENT TRACKING HELPERS
 * Custom events for election education engagement metrics
 * ============================================================ */

/**
 * Tracks a custom analytics event.
 * @param {string} eventName - Event name (e.g., 'quiz_completed')
 * @param {Object} [params={}] - Event parameters
 */
export const trackEvent = (eventName, params = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, {
        ...params,
        timestamp: new Date().toISOString(),
        app_version: '2.0.0',
      });
    } catch (e) {
      console.warn('Analytics event failed:', e.message);
    }
  }
};

/**
 * Tracks when a user views a specific tab/section.
 * @param {string} tabName - Name of the tab viewed
 */
export const trackPageView = (tabName) => {
  trackEvent('page_view', { page_title: tabName, section: 'election_education' });
};

/**
 * Tracks quiz completion with score.
 * @param {number} score - User's score
 * @param {number} total - Total questions
 * @param {string} language - Language used
 */
export const trackQuizComplete = (score, total, language) => {
  trackEvent('quiz_completed', {
    score,
    total,
    percentage: Math.round((score / total) * 100),
    language,
    grade: score === total ? 'perfect' : score >= total * 0.8 ? 'excellent' : score >= total * 0.6 ? 'good' : 'needs_improvement',
  });
};

/**
 * Tracks language change events.
 * @param {string} fromLang - Previous language code
 * @param {string} toLang - New language code
 */
export const trackLanguageChange = (fromLang, toLang) => {
  trackEvent('language_changed', { from_language: fromLang, to_language: toLang });
};

/**
 * Tracks chat interactions with the AI assistant.
 * @param {string} questionType - 'quick_ask' or 'custom'
 * @param {string} language - Language used
 */
export const trackChatInteraction = (questionType, language) => {
  trackEvent('chat_interaction', { question_type: questionType, language });
};

/**
 * Tracks glossary term expansions.
 * @param {string} term - Glossary term viewed
 */
export const trackGlossaryView = (term) => {
  trackEvent('glossary_term_viewed', { term });
};

/**
 * Tracks journey map step exploration.
 * @param {number} stepNumber - Step number explored
 * @param {string} stepTitle - Step title
 */
export const trackJourneyStep = (stepNumber, stepTitle) => {
  trackEvent('journey_step_explored', { step_number: stepNumber, step_title: stepTitle });
};

export { app, analytics, performance };
