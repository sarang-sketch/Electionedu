/**
 * @fileoverview Root Application Component for Election Education Assistant.
 * Manages top-level routing between tabs (Journey, Timeline, Glossary, Quiz),
 * language selection, and lazy-loaded code-split views.
 *
 * @author sarang-sketch
 * @version 2.0.0
 */

import React, { useState, useEffect, Suspense } from 'react';
import { Map, Calendar, BookOpen, HelpCircle, Globe } from 'lucide-react';
import { useLang } from './context/LanguageContext';
import { trackPageView, trackLanguageChange } from './firebase';
import { A11Y } from './constants/config';
import ChatAssistant from './components/ChatAssistant';
import './index.css';

// Efficiency: Code splitting for main tabs
const JourneyMap = React.lazy(() => import('./components/JourneyMap'));
const Glossary = React.lazy(() => import('./components/Glossary'));
const Quiz = React.lazy(() => import('./components/Quiz'));
const TimelineView = React.lazy(() => import('./components/TimelineView'));

export default function App() {
  const [activeTab, setActiveTab] = useState('journey');
  const { lang, setLang, t, LANGUAGES } = useLang();

  // Track page/tab views
  useEffect(() => {
    trackPageView(activeTab);
  }, [activeTab]);

  const TABS = [
    { id: 'journey',  label: t('tabJourney'), icon: <Map size={14} /> },
    { id: 'timeline', label: t('tabTimeline'),    icon: <Calendar size={14} /> },
    { id: 'glossary', label: t('tabGlossary'),    icon: <BookOpen size={14} /> },
    { id: 'quiz',     label: t('tabQuiz'),        icon: <HelpCircle size={14} /> },
  ];

  return (
    <>
      {/* Accessibility: Skip to main content link */}
      <a href={`#${A11Y.SKIP_LINK_ID}`} className="sr-only" style={{ position: 'absolute', left: '-9999px', top: 'auto', ':focus': { left: '10px', top: '10px' } }}>
        Skip to main content
      </a>

      {/* ── HEADER ── */}
      <header role="banner">
        <div className="container">
          <div className="brand">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <span className="brand-name">ElectionEdu</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <nav aria-label="Main navigation">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  className={activeTab === tab.id ? 'active' : ''}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', padding: '0.2rem 0.6rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <Globe size={14} color="#64748b" />
              <select 
                id={A11Y.LANG_SELECT_ID}
                aria-label="Select language"
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                style={{ 
                  background: 'transparent', border: 'none', outline: 'none', 
                  fontFamily: 'Plus Jakarta Sans', fontSize: '0.8rem', fontWeight: 600, color: '#475569',
                  cursor: 'pointer'
                }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.native}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO STRIP ── */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #fdf8f2 50%, #f5f3ff 100%)',
        borderBottom: '1px solid #e8ddd0',
        padding: '1.75rem 0 1.5rem',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ marginBottom: '0.35rem' }}>{t('appTitle')}</h1>
              <p style={{ fontSize: '1rem', color: '#64748b' }}>
                {t('appDesc')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <span className="badge badge-blue">{t('badgeCivic')}</span>
              <span className="badge badge-amber">{t('badgeAI')}</span>
              <span className="badge badge-green">{t('badgeFree')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="container">
        <div
          className="layout-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 370px', gap: '2rem', alignItems: 'start' }}
        >
          <div role="main" id={A11Y.SKIP_LINK_ID}>
            <Suspense fallback={<div className="card" style={{ textAlign: 'center', padding: '2rem' }}>Loading Content...</div>}>
              {activeTab === 'journey'  && <JourneyMap />}
              {activeTab === 'timeline' && <TimelineView />}
              {activeTab === 'glossary' && <Glossary />}
              {activeTab === 'quiz'     && <Quiz />}
            </Suspense>
          </div>

          <aside style={{ position: 'sticky', top: '80px' }}>
            <ChatAssistant />
          </aside>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer role="contentinfo">
        <div className="container">
          <p>
            © {new Date().getFullYear()} <strong>ElectionEdu</strong> · Powered by{' '}
            <strong>Google Gemini AI</strong> &amp; <strong>Google Charts</strong> · {t('footer')}
          </p>
        </div>
      </footer>
    </>
  );
}
