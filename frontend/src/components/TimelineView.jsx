import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { Calendar, Info } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const columns = [
  { type: 'string', id: 'Phase' },
  { type: 'string', id: 'Event' },
  { type: 'date',   id: 'Start' },
  { type: 'date',   id: 'End' },
];

const rows = [
  ['Pre-Election',  'Voter Registration Period',     new Date(2024, 0,  1),  new Date(2024, 2, 31)],
  ['Pre-Election',  'Candidate Nomination',          new Date(2024, 3,  1),  new Date(2024, 3, 20)],
  ['Campaign',      'Official Campaign Period',       new Date(2024, 3, 21),  new Date(2024, 9, 25)],
  ['Campaign',      'Presidential Debates',          new Date(2024, 7,  1),  new Date(2024, 9, 10)],
  ['Election',      'Voting Day',                    new Date(2024, 10,  5), new Date(2024, 10,  6)],
  ['Post-Election', 'Vote Counting & Certification', new Date(2024, 10,  6), new Date(2024, 11, 15)],
  ['Post-Election', 'Electoral College Vote',        new Date(2024, 11, 17), new Date(2024, 11, 18)],
  ['Post-Election', 'Inauguration Day',              new Date(2025,  0, 20), new Date(2025,  0, 21)],
];

const INITIAL_PHASES = [
  {
    name: 'Pre-Election', color: '#2563eb', soft: '#eff6ff', border: '#bfdbfe',
    icon: '📋', desc: 'Voter registration opens and candidates file their nomination papers.',
  },
  {
    name: 'Campaign', color: '#7c3aed', soft: '#f5f3ff', border: '#ddd6fe',
    icon: '🗣️', desc: 'Approved candidates actively campaign with rallies, debates, and media outreach.',
  },
  {
    name: 'Election', color: '#dc2626', soft: '#fef2f2', border: '#fecaca',
    icon: '🗳️', desc: 'Citizens head to their polling stations and cast their votes on Election Day.',
  },
  {
    name: 'Post-Election', color: '#d97706', soft: '#fffbeb', border: '#fde68a',
    icon: '🏆', desc: 'Votes are counted, results certified, and the winning leader is inaugurated.',
  },
];

export default function TimelineView() {
  const { lang, t, translateDynamic } = useLang();
  const [phases, setPhases] = useState(INITIAL_PHASES);

  useEffect(() => {
    let isMounted = true;
    const translateContent = async () => {
      if (lang === 'en') {
        setPhases(INITIAL_PHASES);
        return;
      }
      const translatedData = await Promise.all(
        INITIAL_PHASES.map(async (item) => ({
          ...item,
          name: await translateDynamic(item.name, lang),
          desc: await translateDynamic(item.desc, lang),
        }))
      );
      if (isMounted) setPhases(translatedData);
    };
    translateContent();
    return () => { isMounted = false; };
  }, [lang]);

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Calendar size={22} color="#2563eb" />
          <h2 style={{ margin: 0 }}>{t('timelineTitle')}</h2>
        </div>
        <p style={{ marginBottom: '1.25rem' }}>
          {t('timelineSub')}
        </p>

        {/* Phase legend chips */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {phases.map(p => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.3rem 0.75rem', borderRadius: '20px',
              background: p.soft, border: `1px solid ${p.border}`,
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: p.color }} />
              <span style={{ fontSize: '0.78rem', color: p.color, fontWeight: 700 }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem 1rem', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', borderRadius: '10px', background: '#fafbff', border: '1px solid #e8ddd0', padding: '0.5rem' }}>
          <Chart
            chartType="Timeline"
            chartVersion="current"
            data={[columns, ...rows]}
            width="100%"
            height="400px"
            options={{
              backgroundColor: '#fafbff',
              timeline: {
                showRowLabels: true,
                rowLabelStyle: { fontSize: 13, color: '#1e293b', fontName: 'Plus Jakarta Sans' },
                barLabelStyle: { fontSize: 11, color: '#1e293b', fontName: 'Plus Jakarta Sans' },
              },
              colors: ['#2563eb', '#7c3aed', '#dc2626', '#d97706'],
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Info size={14} color="#94a3b8" />
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
            Timeline above shows a U.S. Presidential election cycle (2024–2025) as an illustrative example.
          </p>
        </div>
      </div>

      {/* ── Phase Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {phases.map(p => (
          <div key={p.name} style={{
            background: p.soft,
            border: `1.5px solid ${p.border}`,
            borderRadius: '16px',
            padding: '1.1rem 1.25rem',
            borderLeft: `4px solid ${p.color}`,
            transition: 'all 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{p.icon}</div>
            <h4 style={{ color: p.color, marginBottom: '0.3rem', fontSize: '0.92rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>
              {p.name}
            </h4>
            <p style={{ margin: 0, fontSize: '0.83rem', color: '#64748b', lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
