import React, { useState, useEffect } from 'react';
import { Users, Flag, CheckSquare, BarChart2, Award, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const INITIAL_STEPS = [
  {
    id: 1,
    icon: Users,
    title: 'Voter Registration',
    badge: 'badge-blue',
    badgeLabel: 'Step 1',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    emoji: '📋',
    description: 'Eligible citizens register to vote, ensuring their names appear on the official Electoral Roll. Without registration, a citizen cannot participate in elections. Most countries allow registration online, at government offices, or through outreach camps in villages and towns.',
    tip: 'Check your electoral roll status online at your government\'s official voter portal. You can also update your address and add a photo ID link!',
  },
  {
    id: 2,
    icon: Flag,
    title: 'Candidate Nomination & Campaigning',
    badge: 'badge-purple',
    badgeLabel: 'Step 2',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    emoji: '🗣️',
    description: 'Political parties and independent candidates file nomination papers within the official schedule. After scrutiny and withdrawal periods, approved candidates launch campaigns — organizing rallies, debates, and digital outreach — to win voter support. The Model Code of Conduct applies during this period.',
    tip: 'Read party manifestos critically! Compare promises across candidates before deciding. Look for policy details, not just slogans.',
  },
  {
    id: 3,
    icon: CheckSquare,
    title: 'Voting Day',
    badge: 'badge-amber',
    badgeLabel: 'Step 3',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    emoji: '🗳️',
    description: 'On election day, registered voters visit their assigned polling station with valid ID. They cast their ballot using an Electronic Voting Machine (EVM) or paper ballot. Strict election commission officials maintain secrecy, order, and transparency. No campaigning is allowed within 100 metres of a polling station.',
    tip: 'Carry a government-issued photo ID. Your vote is completely secret — no one can see who you voted for, guaranteed by law!',
  },
  {
    id: 4,
    icon: BarChart2,
    title: 'Vote Counting',
    badge: 'badge-green',
    badgeLabel: 'Step 4',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    emoji: '📊',
    description: 'After polls close, EVMs or ballot boxes are sealed, transported to counting centres, and counted under strict supervision of election officials and representatives from each party. Results are recorded round-by-round and officially tallied. Any candidate can appoint a counting agent.',
    tip: 'Results for large constituencies can take hours or even an entire day! Follow the official Election Commission website for live updates.',
  },
  {
    id: 5,
    icon: Award,
    title: 'Results & Inauguration',
    badge: 'badge-amber',
    badgeLabel: 'Step 5',
    color: '#b45309',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    emoji: '🏆',
    description: 'The candidate with the highest votes in their constituency wins (First-Past-The-Post system). Parties with enough seats form governments. The winning leaders are sworn into office in a formal inauguration ceremony, and the transfer of power happens peacefully — the hallmark of a strong democracy.',
    tip: 'Understanding FPTP vs Proportional Representation can totally change how you interpret election results across different countries!',
  },
];

export default function JourneyMap() {
  const { lang, t, translateDynamic } = useLang();
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [activeStep, setActiveStep] = useState(null);
  const [completed, setCompleted] = useState(new Set());

  // Translate content dynamically
  useEffect(() => {
    let isMounted = true;
    const translateContent = async () => {
      if (lang === 'en') {
        setSteps(INITIAL_STEPS);
        return;
      }
      const translatedSteps = await Promise.all(
        INITIAL_STEPS.map(async (step) => ({
          ...step,
          title: await translateDynamic(step.title, lang),
          description: await translateDynamic(step.description, lang),
          tip: await translateDynamic(step.tip, lang),
        }))
      );
      if (isMounted) setSteps(translatedSteps);
    };
    translateContent();
    return () => { isMounted = false; };
  }, [lang]);

  const toggle = (id) => {
    setActiveStep(prev => (prev === id ? null : id));
    setCompleted(prev => new Set([...prev, id]));
  };

  const progressPct = (completed.size / steps.length) * 100;

  return (
    <div className="animate-fade-in">

      {/* ── Header Card ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.4rem' }}>{t('journeyTitle')}</h2>
            <p>{t('journeySub')}</p>
          </div>
          <div style={{ textAlign: 'right', minWidth: '160px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-blue">{completed.size}/{steps.length} {t('explored')}</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: '#94a3b8' }}>
              {progressPct === 100 ? t('journeyComplete') : `${Math.round(progressPct)}%`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Steps ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isOpen = activeStep === step.id;
          const isDone = completed.has(step.id);

          return (
            <div
              key={step.id}
              style={{
                background: isOpen ? step.bgColor : '#ffffff',
                border: `1.5px solid ${isOpen ? step.borderColor : '#e8ddd0'}`,
                borderRadius: '16px',
                padding: '1.2rem 1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isOpen ? `0 8px 24px rgba(0,0,0,0.10)` : '0 1px 4px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={() => toggle(step.id)}
              role="button"
              aria-expanded={isOpen}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && toggle(step.id)}
            >
              {/* Glossy top strip */}
              {isOpen && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: `linear-gradient(90deg, ${step.color}, ${step.color}88)`,
                  borderRadius: '16px 16px 0 0',
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Step number circle */}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                  background: isDone ? step.color : '#f1f5f9',
                  color: isDone ? '#fff' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.8rem',
                  transition: 'all 0.3s', boxShadow: isDone ? `0 4px 10px ${step.color}40` : 'none',
                }}>
                  {isDone ? '✓' : index + 1}
                </div>

                {/* Icon */}
                <div style={{
                  width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
                  background: isOpen ? `${step.color}15` : '#f8fafc',
                  border: `1.5px solid ${isOpen ? step.borderColor : '#e2e8f0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  <Icon size={20} color={isOpen ? step.color : '#94a3b8'} />
                </div>

                {/* Title */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, color: isOpen ? step.color : '#1e293b', transition: 'color 0.3s' }}>
                      {step.emoji} {step.title}
                    </h3>
                    <span className={`badge ${step.badge}`}>{step.badgeLabel}</span>
                  </div>
                  {!isOpen && (
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                      {t('clickToLearn')}
                    </p>
                  )}
                </div>

                {/* Chevron */}
                <div style={{ color: '#cbd5e1', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <ChevronDown size={20} />
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: `1px solid ${step.borderColor}`, animation: 'fadeIn 0.3s ease' }}>
                  <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.97rem' }}>
                    {step.description}
                  </p>

                  {/* Tip box */}
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                    padding: '0.85rem 1rem', borderRadius: '12px',
                    background: '#fffbeb', border: '1px solid #fde68a',
                  }}>
                    <Lightbulb size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#92400e', lineHeight: 1.65 }}>
                      <strong style={{ color: '#b45309' }}>{t('proTip')} </strong>{step.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Completion Banner ── */}
      {completed.size === steps.length && (
        <div className="card animate-pop" style={{
          marginTop: '1.5rem', textAlign: 'center', padding: '2.5rem',
          background: 'linear-gradient(135deg, #ecfdf5, #eff6ff)',
          border: '1.5px solid #a7f3d0',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem', animation: 'float 2s ease-in-out infinite' }}>🎉</div>
          <h2 style={{ color: '#059669', marginBottom: '0.5rem' }}>{t('journeyComplete')}</h2>
        </div>
      )}
    </div>
  );
}
