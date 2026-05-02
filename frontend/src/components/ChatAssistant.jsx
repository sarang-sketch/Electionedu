import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Zap } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const INITIAL_QUICK_QUESTIONS = [
  'How do I register to vote?',
  'What is an EVM?',
  'How are votes counted?',
  'Who can stand for election?',
];

const renderText = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} style={{ color: '#2563eb' }}>{part.slice(2, -2)}</strong>
      : part
  );
};

export default function ChatAssistant() {
  const { lang, t, translateDynamic, LANGUAGES } = useLang();
  const [quickQuestions, setQuickQuestions] = useState(INITIAL_QUICK_QUESTIONS);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const translateInitialContent = async () => {
      const initialGreeting = "👋 Hi! I'm your **Election Assistant** powered by Google Gemini. Ask me anything about voter registration, EVMs, election timelines, or your civic rights!";
      if (lang === 'en') {
        setMessages([{ role: 'assistant', text: initialGreeting }]);
        setQuickQuestions(INITIAL_QUICK_QUESTIONS);
        return;
      }
      
      const translatedGreeting = await translateDynamic(initialGreeting, lang);
      if (isMounted && messages.length <= 1) {
        setMessages([{ role: 'assistant', text: translatedGreeting }]);
      }

      const translatedQuestions = await Promise.all(
        INITIAL_QUICK_QUESTIONS.map(q => translateDynamic(q, lang))
      );
      if (isMounted) setQuickQuestions(translatedQuestions);
    };
    translateInitialContent();
    return () => { isMounted = false; };
  }, [lang]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    
    // Prepend language instruction if not English
    const targetLang = LANGUAGES.find(l => l.code === lang)?.label || 'English';
    const payloadMsg = lang === 'en' ? msg : `[Please reply exclusively in ${targetLang} language] ${msg}`;

    try {
      const apiUrl = import.meta.env.PROD 
        ? '/_/backend/api/chat' 
        : 'http://localhost:5000/api/chat';
      
      const res  = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: payloadMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: res.ok ? data.response : "⚠️ Couldn't reach the AI. Make sure the backend is running on port 5000.",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '🔌 Connection error. Is the backend running? (`node server.js`)',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };
  const clearChat = async () => {
    const initialGreeting = "👋 Hi! I'm your **Election Assistant** powered by Google Gemini. Ask me anything about voter registration, EVMs, election timelines, or your civic rights!";
    const greetingText = await translateDynamic(initialGreeting, lang);
    setMessages([{ role: 'assistant', text: greetingText }]);
  };

  return (
    <section
      className="card animate-fade-in"
      aria-label="AI Election Assistant"
      style={{ display: 'flex', flexDirection: 'column', height: '540px', padding: '1.25rem' }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{t('aiGuide')}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>{t('online')}</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Clear chat"
          style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
            width: '32px', height: '32px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', color: '#94a3b8',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div
        role="log"
        aria-live="polite"
        style={{
          flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
          gap: '0.85rem', paddingRight: '4px',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex', gap: '0.55rem', alignItems: 'flex-end',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
              background: msg.role === 'assistant'
                ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                : 'linear-gradient(135deg, #f59e0b, #f97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}>
              {msg.role === 'assistant'
                ? <Bot size={14} color="#fff" />
                : <User size={14} color="#fff" />}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '82%',
              padding: '0.65rem 0.95rem',
              borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #2563eb, #3b82f6)'
                : '#f8fafc',
              border: msg.role === 'user' ? 'none' : '1px solid #e8ddd0',
              color: msg.role === 'user' ? '#fff' : '#1e293b',
              fontSize: '0.88rem',
              lineHeight: 1.65,
              boxShadow: msg.role === 'user'
                ? '0 4px 12px rgba(37,99,235,0.25)'
                : '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              {renderText(msg.text)}
            </div>
          </div>
        ))}

        {/* Typing dots */}
        {loading && (
          <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-end' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={14} color="#fff" />
            </div>
            <div style={{
              padding: '0.65rem 1rem', borderRadius: '4px 16px 16px 16px',
              background: '#f8fafc', border: '1px solid #e8ddd0',
              display: 'flex', gap: '4px', alignItems: 'center',
            }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8',
                  animation: `pulse 1.1s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* ── Quick Questions ── */}
      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {t('quickAsk')}
        </p>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(INITIAL_QUICK_QUESTIONS[idx])}
              disabled={loading}
              style={{
                fontSize: '0.72rem', padding: '0.3rem 0.65rem', borderRadius: '20px',
                background: '#eff6ff', border: '1px solid #bfdbfe',
                color: '#2563eb', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s', fontWeight: 600,
              }}
              onMouseEnter={e => { if (!loading) { e.target.style.background = '#dbeafe'; } }}
              onMouseLeave={e => { e.target.style.background = '#eff6ff'; }}
            >
              <Zap size={10} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input ── */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <label htmlFor="chat-input" className="sr-only">Ask election question</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('placeholder')}
          disabled={loading}
          style={{ flex: 1, fontSize: '0.88rem', padding: '0.7rem 0.9rem' }}
        />
        <button
          type="submit"
          className="btn"
          disabled={loading || !input.trim()}
          style={{ padding: '0.7rem 1.1rem', borderRadius: '12px', minWidth: 'auto' }}
        >
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}