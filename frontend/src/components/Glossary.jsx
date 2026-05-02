/**
 * @fileoverview Searchable Glossary Component.
 * Displays election terminology with category filtering, real-time search,
 * expandable definitions, and multilingual translation support.
 *
 * @author sarang-sketch
 * @module components/Glossary
 */
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronDown } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const INITIAL_GLOSSARY = [
  { term: 'Ballot',                           icon: '🗳️', category: 'Voting',      color: '#2563eb', soft: '#eff6ff', border: '#bfdbfe', definition: 'The process of voting, typically in writing and in secret. A ballot paper or machine entry is the official vehicle through which a voter expresses their choice for a candidate or party.' },
  { term: 'Constituency',                     icon: '🗺️', category: 'Structure',   color: '#7c3aed', soft: '#f5f3ff', border: '#ddd6fe', definition: 'A geographic area whose registered voters collectively elect a single representative to a legislative body (e.g., Parliament or Congress).' },
  { term: 'EVM (Electronic Voting Machine)',  icon: '💻', category: 'Technology',  color: '#059669', soft: '#ecfdf5', border: '#a7f3d0', definition: "A tamper-resistant electronic device that replaces paper ballots. Voters press a button next to their preferred candidate's name to cast a vote, which is securely recorded." },
  { term: 'Manifesto',                        icon: '📄', category: 'Campaigns',   color: '#d97706', soft: '#fffbeb', border: '#fde68a', definition: 'A public document published by a political party before an election outlining its plans, policies, and commitments if it forms the government.' },
  { term: 'Polling Station',                  icon: '🏫', category: 'Voting',      color: '#2563eb', soft: '#eff6ff', border: '#bfdbfe', definition: 'A designated venue (school, community centre, etc.) where eligible registered voters go to cast their ballot on election day.' },
  { term: 'Electoral Roll',                   icon: '📋', category: 'Basics',      color: '#dc2626', soft: '#fef2f2', border: '#fecaca', definition: 'The official, government-maintained register of all citizens eligible to vote in a specific election. Only persons on this list may vote.' },
  { term: 'Voter Turnout',                    icon: '📊', category: 'Metrics',     color: '#059669', soft: '#ecfdf5', border: '#a7f3d0', definition: 'The percentage of registered voters who actually cast a ballot in a particular election. High turnout is a sign of democratic health.' },
  { term: 'Incumbent',                        icon: '🏛️', category: 'Candidates',  color: '#7c3aed', soft: '#f5f3ff', border: '#ddd6fe', definition: 'The current holder of an elected political office who is running for re-election in the same position.' },
  { term: 'First-Past-The-Post (FPTP)',       icon: '🏁', category: 'Systems',     color: '#d97706', soft: '#fffbeb', border: '#fde68a', definition: 'An electoral system in which the candidate with the most votes in a constituency wins, regardless of whether they get over 50%.' },
  { term: 'Coalition Government',             icon: '🤝', category: 'Government',  color: '#2563eb', soft: '#eff6ff', border: '#bfdbfe', definition: "A government formed when no single party wins an outright majority of seats, requiring two or more parties to cooperate and share power." },
  { term: 'Nomination Papers',               icon: '📝', category: 'Campaigns',   color: '#d97706', soft: '#fffbeb', border: '#fde68a', definition: 'Official forms that a candidate must submit to the election authority to formally declare their intention to contest an election.' },
  { term: 'Model Code of Conduct',           icon: '⚖️', category: 'Regulation',  color: '#dc2626', soft: '#fef2f2', border: '#fecaca', definition: 'A set of guidelines issued by the election commission that all political parties and candidates must follow from the election announcement until results are declared.' },
];

const CATEGORIES = ['All', ...Array.from(new Set(INITIAL_GLOSSARY.map(g => g.category)))];

export default function Glossary() {
  const { lang, t, translateDynamic } = useLang();
  const [glossary, setGlossary] = useState(INITIAL_GLOSSARY);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const translateContent = async () => {
      if (lang === 'en') {
        setGlossary(INITIAL_GLOSSARY);
        return;
      }
      const translatedData = await Promise.all(
        INITIAL_GLOSSARY.map(async (item) => ({
          ...item,
          term: await translateDynamic(item.term, lang),
          definition: await translateDynamic(item.definition, lang),
          category: await translateDynamic(item.category, lang),
        }))
      );
      if (isMounted) setGlossary(translatedData);
    };
    translateContent();
    return () => { isMounted = false; };
  }, [lang]);

  const filtered = glossary.filter(item => {
    const matchSearch = item.term.toLowerCase().includes(search.toLowerCase()) ||
                        item.definition.toLowerCase().includes(search.toLowerCase());
    
    // We compare with the original category if the category filter is also translated, 
    // but here we just check against the translated category. 
    // To make filters work seamlessly, we will just use the original or translated filter.
    const matchCat = category === 'All' || item.category === category || INITIAL_GLOSSARY.find(g => g.term === item.term)?.category === category;
    
    return matchSearch && matchCat;
  });

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <BookOpen size={22} color="#2563eb" />
          <h2 style={{ margin: 0 }}>{t('glossaryTitle')}</h2>
          <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>{filtered.length} terms</span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={17} style={{
            position: 'absolute', left: '13px', top: '50%',
            transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none',
          }} />
          <label htmlFor="glossary-search" className="sr-only">Search election terms</label>
          <input
            id="glossary-search"
            type="text"
            aria-label="Search election terms"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '0.28rem 0.75rem', borderRadius: '20px',
                fontSize: '0.78rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                background: category === cat ? '#2563eb' : '#f8fafc',
                color:      category === cat ? '#fff'    : '#64748b',
                border:     category === cat ? '1px solid transparent' : '1px solid #e2e8f0',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (category !== cat) { e.target.style.background = '#eff6ff'; e.target.style.color = '#2563eb'; } }}
              onMouseLeave={e => { if (category !== cat) { e.target.style.background = '#f8fafc'; e.target.style.color = '#64748b'; } }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Terms Grid ── */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
          <h3 style={{ color: '#64748b', marginBottom: '0.25rem' }}>{t('noResults')}</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem' }}>
          {filtered.map((item, idx) => {
            const isOpen = expanded === item.term;
            return (
              <div
                key={idx}
                style={{
                  background: isOpen ? item.soft : '#ffffff',
                  border: `1.5px solid ${isOpen ? item.border : '#e8ddd0'}`,
                  borderRadius: '16px',
                  padding: '1.1rem 1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isOpen ? `0 6px 20px rgba(0,0,0,0.09)` : '0 1px 4px rgba(0,0,0,0.05)',
                  transform: isOpen ? 'translateY(-2px)' : 'translateY(0)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => setExpanded(isOpen ? null : item.term)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setExpanded(isOpen ? null : item.term)}
                aria-expanded={isOpen}
              >
                {/* Colored left accent */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                  background: isOpen ? item.color : 'transparent',
                  borderRadius: '16px 0 0 16px',
                  transition: 'background 0.25s',
                }} />

                <div style={{ paddingLeft: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <h4 style={{
                          margin: '0 0 0.2rem', fontSize: '0.92rem',
                          color: isOpen ? item.color : '#1e293b',
                          fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
                        }}>
                          {item.term}
                        </h4>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px',
                          color: item.color, background: item.soft,
                          padding: '0.15rem 0.45rem', borderRadius: '10px',
                          border: `1px solid ${item.border}`,
                        }}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div style={{ color: '#cbd5e1', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  {/* Preview or full text */}
                  <p style={{
                    margin: '0.65rem 0 0', fontSize: '0.85rem',
                    color: isOpen ? '#374151' : '#94a3b8', lineHeight: 1.65,
                    animation: isOpen ? 'fadeIn 0.25s ease' : 'none',
                  }}>
                    {isOpen ? item.definition : item.definition.slice(0, 65) + '…'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
