/**
 * @fileoverview Interactive Quiz Component.
 * Presents multiple-choice questions about the election process with
 * instant visual feedback, score tracking, grading, and multilingual support.
 *
 * @author sarang-sketch
 * @module components/Quiz
 */
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, Star, ChevronRight, HelpCircle, Zap } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const INITIAL_QUESTIONS = [
  {
    id: 1,
    question: 'What is the primary purpose of an Electoral Roll?',
    options: [
      'To count the number of political parties',
      'To list all citizens eligible to vote',
      'To announce election results',
      'To collect campaign funds',
    ],
    answer: 1,
    explanation: 'The Electoral Roll (Voter List) is the official register of citizens eligible to vote. Only those on this list can cast a ballot on election day.',
    category: 'Basics',
    categoryColor: '#2563eb',
    categorySoft: '#eff6ff',
  },
  {
    id: 2,
    question: "Which of the following best describes a 'Constituency'?",
    options: [
      'The headquarters of a political party',
      'The leader of the winning party',
      'A geographic area that elects one representative',
      'A document outlining party promises',
    ],
    answer: 2,
    explanation: 'A constituency is a specific geographic area whose registered voters collectively elect one representative to a legislative body.',
    category: 'Geography',
    categoryColor: '#7c3aed',
    categorySoft: '#f5f3ff',
  },
  {
    id: 3,
    question: 'What does EVM stand for?',
    options: [
      'Election Verification Method',
      'Electronic Voting Machine',
      'Electoral Voter Mechanism',
      'Every Vote Matters',
    ],
    answer: 1,
    explanation: 'EVM stands for Electronic Voting Machine — a tamper-proof device used in many democracies to replace paper ballots and speed up counting.',
    category: 'Technology',
    categoryColor: '#059669',
    categorySoft: '#ecfdf5',
  },
  {
    id: 4,
    question: 'In a First-Past-The-Post election system, who wins?',
    options: [
      'The candidate with more than 50% of votes',
      'The candidate with the most votes, even without a majority',
      'The candidate chosen by the election commission',
      'The party leader with the most national votes',
    ],
    answer: 1,
    explanation: "In FPTP, the candidate with the highest votes in their constituency wins, even without getting more than 50% of the total votes cast.",
    category: 'Systems',
    categoryColor: '#d97706',
    categorySoft: '#fffbeb',
  },
  {
    id: 5,
    question: "What is a 'Manifesto' in the context of elections?",
    options: [
      'An official voter registration document',
      'A list of all polling stations in a constituency',
      "A public declaration of a party's policies and promises",
      'The official result declared by the election commission',
    ],
    answer: 2,
    explanation: "A manifesto is a published document where a political party outlines its policies, plans, and promises if elected to government.",
    category: 'Terms',
    categoryColor: '#dc2626',
    categorySoft: '#fef2f2',
  },
];

const GRADE_KEYS = [
  { threshold: 100, key: 'gradePerfect',  emoji: '🏆', color: '#d97706', soft: '#fffbeb' },
  { threshold: 80,  key: 'gradeExcellent', emoji: '🌟', color: '#2563eb', soft: '#eff6ff' },
  { threshold: 60,  key: 'gradeGood',      emoji: '👍', color: '#059669', soft: '#ecfdf5' },
  { threshold: 0,   key: 'gradeKeep',      emoji: '📚', color: '#7c3aed', soft: '#f5f3ff' },
];

const GRADE_EN = {
  gradePerfect: 'Perfect Score!', gradeExcellent: 'Excellent!',
  gradeGood: 'Good Job!', gradeKeep: 'Keep Learning!',
};

const getGradeKey = (score, total) => {
  const pct = (score / total) * 100;
  if (pct === 100) return GRADE_KEYS[0];
  if (pct >= 80)  return GRADE_KEYS[1];
  if (pct >= 60)  return GRADE_KEYS[2];
  return GRADE_KEYS[3];
};

export default function Quiz() {
  const { lang, t, translateDynamic } = useLang();
  const [questions,   setQuestions]   = useState(INITIAL_QUESTIONS);
  const [translating, setTranslating] = useState(false);
  const [gradeLabels, setGradeLabels] = useState(GRADE_EN);
  const [current,  setCurrent]  = useState(0);
  const [score,    setScore]    = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answers,  setAnswers]  = useState([]);

  useEffect(() => {
    let isMounted = true;
    // Reset quiz progress on language change
    setCurrent(0); setScore(0); setSelected(null);
    setAnswered(false); setFinished(false); setAnswers([]);

    const translateContent = async () => {
      if (lang === 'en') {
        setQuestions(INITIAL_QUESTIONS);
        setGradeLabels(GRADE_EN);
        setTranslating(false);
        return;
      }
      setTranslating(true);
      const [translatedData, translatedGrades] = await Promise.all([
        Promise.all(
          INITIAL_QUESTIONS.map(async (item) => ({
            ...item,
            question: await translateDynamic(item.question, lang),
            explanation: await translateDynamic(item.explanation, lang),
            category: await translateDynamic(item.category, lang),
            options: await Promise.all(item.options.map(o => translateDynamic(o, lang)))
          }))
        ),
        Promise.all(
          Object.entries(GRADE_EN).map(async ([key, val]) => [key, await translateDynamic(val, lang)])
        ).then(Object.fromEntries)
      ]);
      if (isMounted) {
        setQuestions(translatedData);
        setGradeLabels(translatedGrades);
        setTranslating(false);
      }
    };
    translateContent();
    return () => { isMounted = false; };
  }, [lang]);

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  const handleAnswer = (idx) => {
    if (answered) return;
    const correct = idx === q.answer;
    setSelected(idx);
    setAnswered(true);
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { correct, selected: idx, answer: q.answer, question: q.question }]);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrent(0); setScore(0); setSelected(null);
    setAnswered(false); setFinished(false); setAnswers([]);
  };

  /* ── Loading Screen ── */
  if (translating) {
    return (
      <div className="animate-fade-in">
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'float 1.5s ease-in-out infinite' }}>🌐</div>
          <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Translating Quiz…</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Preparing questions in your language, please wait.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '1.5rem' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#2563eb', animation: `pulse 1s ease ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Result Screen ── */
  if (finished) {
    const gradeKey = getGradeKey(score, questions.length);
    const grade = { ...gradeKey, label: gradeLabels[gradeKey.key] };
    return (
      <div className="animate-fade-in">
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', background: grade.soft, borderColor: '#e8ddd0' }}>
          <div style={{ fontSize: '5rem', marginBottom: '0.75rem', animation: 'float 2s ease-in-out infinite' }}>
            {grade.emoji}
          </div>
          <h2 style={{ color: grade.color, marginBottom: '0.4rem' }}>{grade.label}</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            {t('score')} <strong style={{ color: grade.color, fontSize: '1.25rem' }}>{score}</strong> /{' '}
            <strong>{questions.length}</strong>
          </p>

          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', margin: '1rem 0 1.5rem' }}>
            {questions.map((_, i) => (
              <Star
                key={i}
                size={28}
                fill={i < score ? grade.color : 'none'}
                color={i < score ? grade.color : '#cbd5e1'}
                style={{ transition: `all 0.4s ease ${i * 0.08}s` }}
              />
            ))}
          </div>

          {/* Answer review */}
          <div style={{ textAlign: 'left', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {answers.map((a, i) => (
              <div key={i} style={{
                padding: '0.75rem 1rem', borderRadius: '12px',
                background: a.correct ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${a.correct ? '#a7f3d0' : '#fecaca'}`,
                display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
              }}>
                {a.correct
                  ? <CheckCircle size={18} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                  : <XCircle    size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />}
                <div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569' }}>Q{i+1}: {a.question}</p>
                  {!a.correct && (
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                      ✓ Correct: {questions[i].options[a.answer]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="btn" onClick={restart}>
            <RotateCcw size={16} /> {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  /* ── Question Screen ── */
  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HelpCircle size={20} color={q.categoryColor} />
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{t('quizTitle')}</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge" style={{ background: q.categorySoft, color: q.categoryColor, border: `1px solid ${q.categoryColor}30` }}>
              {q.category}
            </span>
            <span className="badge badge-gray">Q {current + 1} / {questions.length}</span>
            <span className="badge badge-green">
              <Zap size={10} /> {t('score')}: {score}
            </span>
          </div>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="card" key={current} style={{ borderTop: `3px solid ${q.categoryColor}` }}>
        <h3 style={{ fontSize: '1.1rem', lineHeight: 1.55, marginBottom: '1.5rem', color: '#1e293b', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {q.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {q.options.map((opt, idx) => {
            const isCorrect  = idx === q.answer;
            const isSelected = idx === selected;

            let bg         = '#fafafa';
            let border     = '#e2e8f0';
            let color      = '#1e293b';
            let fontWeight = 500;
            let shadow     = 'none';

            if (answered) {
              if (isCorrect)                      { bg = '#ecfdf5'; border = '#6ee7b7'; color = '#065f46'; fontWeight = 700; shadow = '0 0 0 2px #a7f3d080'; }
              else if (isSelected && !isCorrect)  { bg = '#fef2f2'; border = '#fca5a5'; color = '#991b1b'; fontWeight = 700; }
            } else if (isSelected) {
              bg = '#eff6ff'; border = '#93c5fd'; color = '#1e40af'; fontWeight = 600;
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answered}
                style={{
                  width: '100%', textAlign: 'left', padding: '0.9rem 1.1rem',
                  background: bg, border: `1.5px solid ${border}`,
                  borderRadius: '12px', color, fontSize: '0.95rem',
                  cursor: answered ? 'default' : 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s ease', boxShadow: shadow,
                  transform: (!answered && isSelected) ? 'translateX(4px)' : 'translateX(0)',
                }}
                onMouseEnter={e => { if (!answered) { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.borderColor = '#7dd3fc'; } }}
                onMouseLeave={e => { if (!answered) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border; } }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    background: answered && isCorrect ? '#059669' : answered && isSelected ? '#dc2626' : '#f1f5f9',
                    color: (answered && (isCorrect || isSelected)) ? '#fff' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 800, transition: 'all 0.2s',
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </span>
                {answered && isCorrect  && <CheckCircle size={20} color="#059669" />}
                {answered && isSelected && !isCorrect && <XCircle size={20} color="#dc2626" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div style={{
            marginTop: '1.25rem', padding: '1rem 1.25rem', borderRadius: '12px',
            background: selected === q.answer ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${selected === q.answer ? '#a7f3d0' : '#fecaca'}`,
            animation: 'fadeIn 0.3s ease',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.7 }}>
              <strong style={{ color: selected === q.answer ? '#059669' : '#dc2626' }}>
                {selected === q.answer ? '✅ Correct! ' : '❌ Incorrect. '}
              </strong>
              {q.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {answered && (
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn" onClick={next}>
              {current < questions.length - 1 ? t('nextQuestion') : t('seeResults')}
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
